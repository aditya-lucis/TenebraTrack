from django.urls import path
from . import views

urlpatterns = [
    # Customers
    path("customers/",          views.CustomerListCreateView.as_view()),
    path("customers/<uuid:pk>/",views.CustomerDetailView.as_view()),

    # Invoices
    path("invoices/",                        views.InvoiceListCreateView.as_view()),
    path("invoices/summary/",                views.InvoiceSummaryView.as_view()),
    path("invoices/<uuid:pk>/",              views.InvoiceDetailView.as_view()),
    path("invoices/<uuid:pk>/send/",         views.InvoiceSendView.as_view()),
    path("invoices/<uuid:pk>/payments/",     views.InvoicePaymentView.as_view()),

    # POS
    path("pos/",                             views.POSView.as_view()),
]