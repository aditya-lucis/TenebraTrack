from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
import uuid

# Create your models here.
class UserManager (BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)
    
class Tenant (models.Model):
    """Satu tenant = satu perusahaan/bisnis UMKM"""
    id             = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name           = models.CharField(max_length=255)
    business_type  = models.CharField(max_length=100, blank=True)
    phone          = models.CharField(max_length=20, blank=True)
    email          = models.EmailField(blank=True)
    address        = models.TextField(blank=True)
    logo           = models.ImageField(upload_to="tenant_logos/", blank=True, null=True)
    subscription   = models.CharField(
        max_length=20,
        choices=[("free", "Free"), ("basic", "Basic"), ("pro", "Pro"), ("enterprise", "Enterprise")],
        default="free"
    )
    trial_ends_at  = models.DateTimeField(null=True, blank=True)
    is_active      = models.BooleanField(default=True)
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tenants"

    def __str__(self):
        return self.name
    
class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ("owner",     "Owner"),
        ("manager",   "Manager"),
        ("accountant","Accountant"),
        ("cashier",   "Cashier"),
        ("staff",     "Staff"),
    ]

    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant      = models.ForeignKey(Tenant, on_delete=models.CASCADE, null=True, blank=True, related_name="users")
    email       = models.EmailField(unique=True)
    first_name  = models.CharField(max_length=100)
    last_name   = models.CharField(max_length=100, blank=True)
    phone       = models.CharField(max_length=20, blank=True)
    role        = models.CharField(max_length=20, choices=ROLE_CHOICES, default="owner")
    avatar      = models.ImageField(upload_to="avatars/", blank=True, null=True)
    is_active   = models.BooleanField(default=True)
    is_staff    = models.BooleanField(default=False)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD  = "email"
    REQUIRED_FIELDS = ["first_name"]

    class Meta:
        db_table = "users"

    def __str__(self):
        return f"{self.first_name} {self.last_name} <{self.email}>"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()