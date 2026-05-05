from django.utils import timezone
from .models import Invoice
from apps.inventory.models import Product
from decimal import Decimal


def generate_invoice_number(tenant):
    """Format: INV-YYYYMM-XXXX"""
    now    = timezone.now()
    prefix = f"INV-{now.strftime('%Y%m')}-"
    last   = (
        Invoice.objects
        .filter(tenant=tenant, number__startswith=prefix)
        .order_by("-number")
        .first()
    )
    if last:
        try:
            seq = int(last.number.split("-")[-1]) + 1
        except ValueError:
            seq = 1
    else:
        seq = 1
    return f"{prefix}{seq:04d}"


def generate_pos_number(tenant):
    """Format: POS-YYYYMMDD-XXXX"""
    from .models import POSTransaction
    now    = timezone.now()
    prefix = f"POS-{now.strftime('%Y%m%d')}-"
    last   = (
        POSTransaction.objects
        .filter(tenant=tenant, number__startswith=prefix)
        .order_by("-number")
        .first()
    )
    seq = int(last.number.split("-")[-1]) + 1 if last else 1
    return f"{prefix}{seq:04d}"


def update_invoice_status(invoice):
    """Update status invoice berdasarkan paid_amount vs total."""
    if invoice.paid_amount <= 0:
        if invoice.status not in ("draft", "sent", "void"):
            invoice.status = "sent"
    elif invoice.paid_amount >= invoice.total:
        invoice.status  = "paid"
        invoice.paid_at = timezone.now()
    else:
        invoice.status = "partial"
    invoice.balance_due = invoice.total - invoice.paid_amount
    invoice.save(update_fields=["status", "paid_at", "balance_due"])


def reduce_stock(product_id, qty):
    """Kurangi stok produk setelah transaksi."""
    try:
        product       = Product.objects.get(id=product_id)
        product.stock = max(Decimal("0"), product.stock - Decimal(str(qty)))
        product.save(update_fields=["stock"])
    except Product.DoesNotExist:
        pass