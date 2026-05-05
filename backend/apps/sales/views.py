from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.http import HttpResponse
from .models import Customer, Invoice, Payment, POSTransaction
from .serializers import (
    CustomerSerializer,
    InvoiceListSerializer, InvoiceDetailSerializer, InvoiceCreateSerializer,
    PaymentCreateSerializer,
    POSCreateSerializer,
)
import urllib.parse


class CustomerListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Customer.objects.filter(tenant=request.user.tenant)
        q  = request.query_params.get("q", "")
        if q:
            qs = qs.filter(name__icontains=q)
        return Response(CustomerSerializer(qs, many=True).data)

    def post(self, request):
        s = CustomerSerializer(data=request.data)
        if s.is_valid():
            s.save(tenant=request.user.tenant)
            return Response(s.data, status=status.HTTP_201_CREATED)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomerDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def _get(self, request, pk):
        return get_object_or_404(Customer, pk=pk, tenant=request.user.tenant)

    def get(self, request, pk):
        return Response(CustomerSerializer(self._get(request, pk)).data)

    def patch(self, request, pk):
        s = CustomerSerializer(self._get(request, pk), data=request.data, partial=True)
        if s.is_valid():
            s.save()
            return Response(s.data)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        self._get(request, pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class InvoiceListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs     = Invoice.objects.filter(tenant=request.user.tenant).select_related("customer")
        status_= request.query_params.get("status", "")
        q      = request.query_params.get("q", "")
        if status_:
            qs = qs.filter(status=status_)
        if q:
            qs = qs.filter(customer__name__icontains=q) | qs.filter(number__icontains=q)
        return Response(InvoiceListSerializer(qs, many=True).data)

    def post(self, request):
        s = InvoiceCreateSerializer(data=request.data, context={"request": request})
        if s.is_valid():
            invoice = s.save()
            return Response(InvoiceDetailSerializer(invoice).data, status=status.HTTP_201_CREATED)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)


class InvoiceDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def _get(self, request, pk):
        return get_object_or_404(Invoice, pk=pk, tenant=request.user.tenant)

    def get(self, request, pk):
        inv = self._get(request, pk)
        return Response(InvoiceDetailSerializer(inv).data)

    def patch(self, request, pk):
        inv = self._get(request, pk)
        # Hanya boleh edit kalau masih draft
        if inv.status not in ("draft",):
            return Response(
                {"error": "Invoice yang sudah terkirim tidak bisa diedit."},
                status=status.HTTP_400_BAD_REQUEST
            )
        # Update fields yang diizinkan
        allowed = ["notes", "due_date", "discount_pct", "tax_pct"]
        for field in allowed:
            if field in request.data:
                setattr(inv, field, request.data[field])
        inv.save()
        inv.recalculate()
        return Response(InvoiceDetailSerializer(inv).data)

    def delete(self, request, pk):
        inv = self._get(request, pk)
        inv.status = "void"
        inv.save(update_fields=["status"])
        return Response({"message": "Invoice dibatalkan."})


class InvoiceSendView(APIView):
    """Tandai invoice sebagai 'sent' dan generate WA link."""
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        inv = get_object_or_404(Invoice, pk=pk, tenant=request.user.tenant)
        if inv.status == "draft":
            inv.status     = "sent"
            inv.wa_sent_at = timezone.now()
            inv.save(update_fields=["status", "wa_sent_at"])

        # Generate WhatsApp deep link
        tenant   = request.user.tenant
        phone    = inv.customer.phone.replace("+", "").replace("-", "").replace(" ", "")
        if phone.startswith("0"):
            phone = "62" + phone[1:]

        msg = (
            f"Halo {inv.customer.name},\n\n"
            f"Berikut invoice dari *{tenant.name}*:\n"
            f"Nomor   : *{inv.number}*\n"
            f"Total   : *Rp {inv.total:,.0f}*\n"
            f"Jatuh Tempo: *{inv.due_date.strftime('%d %B %Y')}*\n\n"
            f"Mohon segera dilakukan pembayaran. Terima kasih 🙏"
        )

        wa_url = f"https://wa.me/{phone}?text={urllib.parse.quote(msg)}"

        return Response({
            "message":    "Invoice berhasil dikirim.",
            "wa_url":     wa_url,
            "invoice":    InvoiceDetailSerializer(inv).data,
        })


class InvoicePaymentView(APIView):
    """Catat pembayaran untuk sebuah invoice."""
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        inv      = get_object_or_404(Invoice, pk=pk, tenant=request.user.tenant)
        payments = inv.payments.all()
        from .serializers import PaymentSerializer
        return Response(PaymentSerializer(payments, many=True).data)

    def post(self, request, pk):
        inv = get_object_or_404(Invoice, pk=pk, tenant=request.user.tenant)
        if inv.status == "void":
            return Response(
                {"error": "Invoice sudah dibatalkan."},
                status=status.HTTP_400_BAD_REQUEST
            )
        s = PaymentCreateSerializer(
            data    = request.data,
            context = {"request": request, "invoice": inv}
        )
        if s.is_valid():
            payment = s.save()
            from .serializers import PaymentSerializer
            return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)


class POSView(APIView):
    """Kasir cepat — buat transaksi POS."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs   = POSTransaction.objects.filter(tenant=request.user.tenant).select_related("customer","cashier")
        from .serializers import POSItemSerializer
        from rest_framework import serializers as drf_serializers

        class POSTxnSerializer(drf_serializers.ModelSerializer):
            customer_name = drf_serializers.CharField(source="customer.name", default="—")
            cashier_name  = drf_serializers.CharField(source="cashier.full_name", default="—")
            items         = POSItemSerializer(many=True, read_only=True)
            class Meta:
                from .models import POSTransaction as T
                model  = T
                fields = ["id","number","customer_name","cashier_name","total","paid_amount","change","method","created_at","items"]

        return Response(POSTxnSerializer(qs, many=True).data)

    def post(self, request):
        s = POSCreateSerializer(data=request.data, context={"request": request})
        if s.is_valid():
            txn = s.save()
            return Response({"message": "Transaksi berhasil.", "number": txn.number, "change": str(txn.change)}, status=status.HTTP_201_CREATED)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)


class InvoiceSummaryView(APIView):
    """Statistik cepat untuk header modul penjualan."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from django.db.models import Sum, Count
        tenant = request.user.tenant
        qs     = Invoice.objects.filter(tenant=tenant)

        return Response({
            "total_invoices":  qs.count(),
            "draft":           qs.filter(status="draft").count(),
            "sent":            qs.filter(status="sent").count(),
            "paid":            qs.filter(status="paid").count(),
            "overdue":         qs.filter(status="overdue").count(),
            "total_revenue":   qs.filter(status="paid").aggregate(s=Sum("total"))["s"] or 0,
            "total_piutang":   qs.exclude(status__in=["paid","void","draft"]).aggregate(s=Sum("balance_due"))["s"] or 0,
        })