from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta
from dateutil.relativedelta import relativedelta

# Import model dari modul lain (akan kita buat bertahap)
# Untuk sekarang kita buat structure response dulu
# nanti diganti query real saat modul sales/purchase selesai

class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tenant = request.user.tenant
        now    = timezone.now()

        # ── Nanti ini diganti query real dari model ──
        # Sementara return struktur data yang benar
        data = {
            "tenant": {
                "name":          tenant.name if tenant else "Bisnis Saya",
                "subscription":  tenant.subscription if tenant else "free",
                "trial_ends_at": tenant.trial_ends_at.isoformat() if (tenant and tenant.trial_ends_at) else None,
                "trial_days_left": self._trial_days_left(tenant),
            },
            "stats": {
                "saldo_kas":     0,
                "total_piutang": 0,
                "total_utang":   0,
                "laba_bersih":   0,
                "saldo_change":  0,
                "piutang_change":0,
                "utang_change":  0,
                "laba_change":   0,
            },
            "cashflow_chart":  self._cashflow_chart(tenant, now),
            "weekly_sales":    self._weekly_sales(tenant, now),
            "income_breakdown":[
                {"name": "Penjualan Produk", "value": 0, "color": "#00C896"},
                {"name": "Jasa / Servis",    "value": 0, "color": "#3b82f6"},
                {"name": "Lainnya",          "value": 0, "color": "#f59e0b"},
            ],
            "recent_transactions": [],
            "piutang_aging":       [],
        }
        return Response(data)

    def _trial_days_left(self, tenant):
        if not tenant or not tenant.trial_ends_at:
            return 0
        delta = tenant.trial_ends_at - timezone.now()
        return max(0, delta.days)

    def _cashflow_chart(self, tenant, now):
        """Struktur 7 bulan terakhir — nanti diisi query real"""
        months = []
        for i in range(6, -1, -1):
            dt = now - relativedelta(months=i)
            months.append({
                "bln":         dt.strftime("%b"),
                "pendapatan":  0,
                "pengeluaran": 0,
            })
        return months

    def _weekly_sales(self, tenant, now):
        """Penjualan 7 hari terakhir"""
        days_id = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"]
        result  = []
        for i in range(6, -1, -1):
            dt = now - timedelta(days=i)
            result.append({
                "hari": days_id[dt.weekday() % 7],
                "val":  0,
            })
        return result