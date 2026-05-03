from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils import timezone
from datetime import timedelta
from .models import User, Tenant


class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Tenant
        fields = ["id", "name", "business_type", "phone", "subscription", "trial_ends_at"]


class UserSerializer(serializers.ModelSerializer):
    tenant     = TenantSerializer(read_only=True)
    full_name  = serializers.ReadOnlyField()

    class Meta:
        model  = User
        fields = [
            "id", "email", "first_name", "last_name", "full_name",
            "phone", "role", "avatar", "tenant", "created_at"
        ]


class RegisterSerializer(serializers.Serializer):
    # Personal info
    first_name    = serializers.CharField(max_length=100)
    last_name     = serializers.CharField(max_length=100, required=False, default="")
    email         = serializers.EmailField()
    phone         = serializers.CharField(max_length=20, required=False, default="")
    password      = serializers.CharField(min_length=8, write_only=True)
    # Business info
    company_name  = serializers.CharField(max_length=255)
    business_type = serializers.CharField(max_length=100, required=False, default="")

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email sudah terdaftar.")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password minimal 8 karakter.")
        return value

    def create(self, validated_data):
        # Buat tenant dulu
        tenant = Tenant.objects.create(
            name          = validated_data["company_name"],
            business_type = validated_data.get("business_type", ""),
            email         = validated_data["email"],
            phone         = validated_data.get("phone", ""),
            subscription  = "free",
            trial_ends_at = timezone.now() + timedelta(days=14),
        )
        # Buat user sebagai owner tenant
        user = User.objects.create_user(
            email      = validated_data["email"],
            password   = validated_data["password"],
            first_name = validated_data["first_name"],
            last_name  = validated_data.get("last_name", ""),
            phone      = validated_data.get("phone", ""),
            tenant     = tenant,
            role       = "owner",
        )
        return user


class LoginSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data["email"], password=data["password"])
        if not user:
            raise serializers.ValidationError("Email atau password salah.")
        if not user.is_active:
            raise serializers.ValidationError("Akun Anda dinonaktifkan.")
        data["user"] = user
        return data


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(min_length=8, write_only=True)

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Password lama salah.")
        return value