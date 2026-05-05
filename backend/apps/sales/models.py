from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal
import uuid


class Customer(models.Model):
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant      = models.ForeignKey("users.Tenant", on_delete=models.CASCADE, related_name="customers")
    name        = models.CharField(max_length=255)
    email       = models.EmailField(blank=True)
    phone       = models.CharField(max_length=20, blank=True)
    address     = models.TextField(blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "customers"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Invoice(models.Model):
    STATUS_CHOICES = [
        ("draft",   "Draft"),
        ("sent",    "Terkirim"),
        ("partial", "Bayar Sebagian"),
        ("paid",    "Lunas"),
        ("overdue", "Jatuh Tempo"),
        ("void",    "Dibatalkan"),
    ]

    id             = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant         = models.ForeignKey("users.Tenant", on_delete=models.CASCADE, related_name="invoices")
    customer       = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name="invoices")
    created_by     = models.ForeignKey("users.User", on_delete=models.SET_NULL, null=True, related_name="invoices_created")

    number         = models.CharField(max_length=50, unique=True)
    status         = models.CharField(max_length=10, choices=STATUS_CHOICES, default="draft")
    issue_date     = models.DateField()
    due_date       = models.DateField()
    notes          = models.TextField(blank=True)

    subtotal       = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal("0"))
    discount_pct   = models.DecimalField(max_digits=5,  decimal_places=2, default=Decimal("0"))
    discount_amount= models.DecimalField(max_digits=18, decimal_places=2, default=Decimal("0"))
    tax_pct        = models.DecimalField(max_digits=5,  decimal_places=2, default=Decimal("11"))  # PPN 11%
    tax_amount     = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal("0"))
    total          = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal("0"))
    paid_amount    = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal("0"))
    balance_due    = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal("0"))

    wa_sent_at     = models.DateTimeField(null=True, blank=True)
    paid_at        = models.DateTimeField(null=True, blank=True)
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "invoices"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.number} — {self.customer.name}"

    def recalculate(self):
        """Hitung ulang subtotal, tax, total dari line items."""
        self.subtotal        = sum(i.amount for i in self.items.all())
        self.discount_amount = self.subtotal * (self.discount_pct / Decimal("100"))
        taxable              = self.subtotal - self.discount_amount
        self.tax_amount      = taxable * (self.tax_pct / Decimal("100"))
        self.total           = taxable + self.tax_amount
        self.balance_due     = self.total - self.paid_amount
        self.save(update_fields=[
            "subtotal","discount_amount","tax_amount",
            "total","balance_due"
        ])


class InvoiceItem(models.Model):
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice     = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="items")
    product     = models.ForeignKey("inventory.Product", on_delete=models.SET_NULL, null=True, blank=True)
    description = models.CharField(max_length=255)
    quantity    = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal("0.01"))])
    unit        = models.CharField(max_length=20, default="pcs")
    unit_price  = models.DecimalField(max_digits=18, decimal_places=2)
    amount      = models.DecimalField(max_digits=18, decimal_places=2)

    class Meta:
        db_table = "invoice_items"

    def save(self, *args, **kwargs):
        self.amount = self.quantity * self.unit_price
        super().save(*args, **kwargs)


class Payment(models.Model):
    METHOD_CHOICES = [
        ("cash",     "Tunai"),
        ("transfer", "Transfer Bank"),
        ("qris",     "QRIS"),
        ("other",    "Lainnya"),
    ]

    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice     = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="payments")
    amount      = models.DecimalField(max_digits=18, decimal_places=2)
    method      = models.CharField(max_length=20, choices=METHOD_CHOICES, default="cash")
    reference   = models.CharField(max_length=100, blank=True)
    notes       = models.CharField(max_length=255, blank=True)
    paid_at     = models.DateTimeField()
    created_by  = models.ForeignKey("users.User", on_delete=models.SET_NULL, null=True)

    class Meta:
        db_table = "payments"
        ordering = ["-paid_at"]


class POSTransaction(models.Model):
    """Transaksi kasir cepat — tidak perlu invoice formal"""
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant      = models.ForeignKey("users.Tenant", on_delete=models.CASCADE, related_name="pos_transactions")
    customer    = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    cashier     = models.ForeignKey("users.User", on_delete=models.SET_NULL, null=True)
    number      = models.CharField(max_length=50, unique=True)
    total       = models.DecimalField(max_digits=18, decimal_places=2)
    paid_amount = models.DecimalField(max_digits=18, decimal_places=2)
    change      = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal("0"))
    method      = models.CharField(max_length=20, choices=Payment.METHOD_CHOICES, default="cash")
    notes       = models.CharField(max_length=255, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "pos_transactions"
        ordering = ["-created_at"]


class POSItem(models.Model):
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    transaction = models.ForeignKey(POSTransaction, on_delete=models.CASCADE, related_name="items")
    product     = models.ForeignKey("inventory.Product", on_delete=models.SET_NULL, null=True, blank=True)
    description = models.CharField(max_length=255)
    quantity    = models.DecimalField(max_digits=12, decimal_places=2)
    unit_price  = models.DecimalField(max_digits=18, decimal_places=2)
    amount      = models.DecimalField(max_digits=18, decimal_places=2)

    class Meta:
        db_table = "pos_items"