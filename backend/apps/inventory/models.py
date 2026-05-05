from django.db import models
from decimal import Decimal
import uuid


class Product(models.Model):
    UNIT_CHOICES = [
        ("pcs", "Pcs"), ("kg", "Kg"), ("gram", "Gram"),
        ("liter", "Liter"), ("meter", "Meter"), ("box", "Box"),
        ("lusin", "Lusin"), ("karton", "Karton"),
    ]

    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant        = models.ForeignKey("users.Tenant", on_delete=models.CASCADE, related_name="products")
    name          = models.CharField(max_length=255)
    sku           = models.CharField(max_length=50, blank=True)
    description   = models.TextField(blank=True)
    unit          = models.CharField(max_length=20, choices=UNIT_CHOICES, default="pcs")
    sell_price    = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal("0"))
    cost_price    = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal("0"))
    stock         = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0"))
    stock_min     = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("5"))
    image         = models.ImageField(upload_to="products/", blank=True, null=True)
    is_active     = models.BooleanField(default=True)
    created_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "products"
        ordering = ["name"]

    def __str__(self):
        return self.name

    @property
    def is_low_stock(self):
        return self.stock <= self.stock_min