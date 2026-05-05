from rest_framework import serializers
from django.utils import timezone
from .models import Customer, Invoice, InvoiceItem, Payment, POSTransaction, POSItem
from .utils import generate_invoice_number, generate_pos_number, update_invoice_status, reduce_stock


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Customer
        fields = ["id","name","email","phone","address","created_at"]
        read_only_fields = ["id","created_at"]


class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model  = InvoiceItem
        fields = ["id","product","description","quantity","unit","unit_price","amount"]
        read_only_fields = ["id","amount"]


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Payment
        fields = ["id","amount","method","reference","notes","paid_at"]
        read_only_fields = ["id"]


class InvoiceListSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source="customer.name", read_only=True)
    customer_phone= serializers.CharField(source="customer.phone", read_only=True)

    class Meta:
        model  = Invoice
        fields = [
            "id","number","status","customer_name","customer_phone",
            "issue_date","due_date","total","paid_amount",
            "balance_due","created_at"
        ]


class InvoiceDetailSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    items    = InvoiceItemSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)

    class Meta:
        model  = Invoice
        fields = "__all__"


class InvoiceCreateSerializer(serializers.Serializer):
    customer_id    = serializers.UUIDField()
    issue_date     = serializers.DateField()
    due_date       = serializers.DateField()
    notes          = serializers.CharField(required=False, allow_blank=True, default="")
    discount_pct   = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, default=0)
    tax_pct        = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, default=11)
    items          = InvoiceItemSerializer(many=True)

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("Invoice harus memiliki minimal 1 item.")
        return value

    def validate(self, data):
        tenant = self.context["request"].user.tenant
        try:
            data["customer"] = Customer.objects.get(id=data["customer_id"], tenant=tenant)
        except Customer.DoesNotExist:
            raise serializers.ValidationError({"customer_id": "Pelanggan tidak ditemukan."})
        return data

    def create(self, validated_data):
        request  = self.context["request"]
        tenant   = request.user.tenant
        items_data = validated_data.pop("items")
        validated_data.pop("customer_id")

        invoice = Invoice.objects.create(
            tenant      = tenant,
            created_by  = request.user,
            number      = generate_invoice_number(tenant),
            discount_pct= validated_data.get("discount_pct", 0),
            tax_pct     = validated_data.get("tax_pct", 11),
            **{k: v for k, v in validated_data.items() if k not in ["discount_pct","tax_pct"]}
        )

        for item_data in items_data:
            InvoiceItem.objects.create(invoice=invoice, **item_data)

        invoice.recalculate()
        return invoice


class PaymentCreateSerializer(serializers.Serializer):
    amount    = serializers.DecimalField(max_digits=18, decimal_places=2)
    method    = serializers.ChoiceField(choices=Payment.METHOD_CHOICES)
    reference = serializers.CharField(required=False, allow_blank=True, default="")
    notes     = serializers.CharField(required=False, allow_blank=True, default="")
    paid_at   = serializers.DateTimeField(required=False)

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Nominal pembayaran harus lebih dari 0.")
        return value

    def create(self, validated_data):
        invoice  = self.context["invoice"]
        request  = self.context["request"]
        if "paid_at" not in validated_data:
            validated_data["paid_at"] = timezone.now()

        payment = Payment.objects.create(
            invoice    = invoice,
            created_by = request.user,
            **validated_data,
        )
        invoice.paid_amount += payment.amount
        update_invoice_status(invoice)
        return payment


class POSItemSerializer(serializers.ModelSerializer):
    class Meta:
        model  = POSItem
        fields = ["id","product","description","quantity","unit_price","amount"]
        read_only_fields = ["id","amount"]


class POSCreateSerializer(serializers.Serializer):
    customer_id = serializers.UUIDField(required=False, allow_null=True)
    paid_amount = serializers.DecimalField(max_digits=18, decimal_places=2)
    method      = serializers.ChoiceField(choices=Payment.METHOD_CHOICES, default="cash")
    notes       = serializers.CharField(required=False, allow_blank=True, default="")
    items       = POSItemSerializer(many=True)

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("Transaksi harus memiliki minimal 1 item.")
        return value

    def create(self, validated_data):
        request    = self.context["request"]
        tenant     = request.user.tenant
        items_data = validated_data.pop("items")
        customer_id= validated_data.pop("customer_id", None)

        total = sum(
            item["quantity"] * item["unit_price"]
            for item in items_data
        )

        customer = None
        if customer_id:
            try:
                customer = Customer.objects.get(id=customer_id, tenant=tenant)
            except Customer.DoesNotExist:
                pass

        txn = POSTransaction.objects.create(
            tenant      = tenant,
            cashier     = request.user,
            customer    = customer,
            number      = generate_pos_number(tenant),
            total       = total,
            paid_amount = validated_data["paid_amount"],
            change      = max(0, validated_data["paid_amount"] - total),
            method      = validated_data.get("method", "cash"),
            notes       = validated_data.get("notes", ""),
        )

        for item_data in items_data:
            amount = item_data["quantity"] * item_data["unit_price"]
            POSItem.objects.create(
                transaction = txn,
                amount      = amount,
                **item_data,
            )
            # Kurangi stok jika ada produk
            if item_data.get("product"):
                reduce_stock(item_data["product"].id, item_data["quantity"])

        return txn