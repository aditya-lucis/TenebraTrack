from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from .models import Product, StockMovement
from rest_framework import serializers as drf_s


class ProductSerializer(drf_s.ModelSerializer):
    is_low_stock = drf_s.ReadOnlyField()

    class Meta:
        model  = Product
        fields = [
            "id","name","sku","description","unit",
            "sell_price","cost_price","stock","stock_min",
            "image","is_active","is_low_stock","created_at"
        ]
        read_only_fields = ["id","is_low_stock","created_at"]


class StockMovementSerializer(drf_s.ModelSerializer):
    product_name = drf_s.CharField(source="product.name", read_only=True)

    class Meta:
        model  = StockMovement
        fields = ["id","product","product_name","type","qty",
                  "stock_before","stock_after","reference","notes","created_at"]
        read_only_fields = ["id","created_at"]


class ProductListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser]

    def get(self, request):
        qs = Product.objects.filter(tenant=request.user.tenant, is_active=True)
        q  = request.query_params.get("q", "")
        low= request.query_params.get("low_stock", "")
        if q:
            qs = qs.filter(name__icontains=q)
        if low == "1":
            qs = [p for p in qs if p.is_low_stock]
        return Response(ProductSerializer(qs, many=True).data)

    def post(self, request):
        s = ProductSerializer(data=request.data)
        if s.is_valid():
            s.save(tenant=request.user.tenant)
            return Response(s.data, status=status.HTTP_201_CREATED)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductDetailView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser]

    def _get(self, request, pk):
        return get_object_or_404(Product, pk=pk, tenant=request.user.tenant)

    def get(self, request, pk):
        return Response(ProductSerializer(self._get(request, pk)).data)

    def patch(self, request, pk):
        s = ProductSerializer(self._get(request, pk), data=request.data, partial=True)
        if s.is_valid():
            s.save()
            return Response(s.data)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        prod = self._get(request, pk)
        prod.is_active = False
        prod.save(update_fields=["is_active"])
        return Response(status=status.HTTP_204_NO_CONTENT)


class StockAdjustView(APIView):
    """Penyesuaian stok manual."""
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        product = get_object_or_404(Product, pk=pk, tenant=request.user.tenant)
        qty     = request.data.get("qty")
        notes   = request.data.get("notes", "Penyesuaian stok")

        if qty is None:
            return Response({"error": "qty wajib diisi."}, status=status.HTTP_400_BAD_REQUEST)

        from decimal import Decimal
        qty          = Decimal(str(qty))
        stock_before = product.stock
        product.stock = max(Decimal("0"), product.stock + qty)
        product.save(update_fields=["stock"])

        StockMovement.objects.create(
            tenant       = request.user.tenant,
            product      = product,
            type         = "adjust",
            qty          = qty,
            stock_before = stock_before,
            stock_after  = product.stock,
            notes        = notes,
            created_by   = request.user,
        )
        return Response(ProductSerializer(product).data)


class StockMovementListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = StockMovement.objects.filter(tenant=request.user.tenant).select_related("product")
        product_id = request.query_params.get("product", "")
        if product_id:
            qs = qs.filter(product_id=product_id)
        return Response(StockMovementSerializer(qs[:50], many=True).data)


class InventorySummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from django.db.models import Sum, F, FloatField, ExpressionWrapper
        qs         = Product.objects.filter(tenant=request.user.tenant, is_active=True)
        total_prods= qs.count()
        low_stock  = sum(1 for p in qs if p.is_low_stock)
        total_value= sum(p.stock * p.cost_price for p in qs)

        return Response({
            "total_products": total_prods,
            "low_stock":      low_stock,
            "total_value":    float(total_value),
            "out_of_stock":   qs.filter(stock=0).count(),
        })