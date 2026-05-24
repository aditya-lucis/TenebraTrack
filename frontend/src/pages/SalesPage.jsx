import { useState, useEffect } from "react";
import api from "../lib/api";  // ← import api instance
import SalesSummaryCards from "../components/sales/SalesSummaryCards";
import InvoiceList       from "../components/sales/InvoiceList";
import InvoiceForm       from "../components/sales/InvoiceForm";
import { InvoiceDetail } from "../components/sales/PaymentModal";
import { PaymentModal }  from "../components/sales/PaymentModal";
import POSPanel          from "../components/sales/POSPanel";
import CustomerModal     from "../components/sales/CustomerModal";

import {
  useInvoiceSummary,
  useInvoices,
  useCustomers,
  useCreateInvoice,
  useSendInvoice,
  useRecordPayment,
  useCreatePOS,
  useCreateCustomer,
} from "../hooks/useSales";
import { useQueryClient } from "@tanstack/react-query";

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, type = "success", onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 80,
        right: 24,
        zIndex: 999,
        background: type === "success" ? "#0D2137" : "#ff5c7a",
        border: `1px solid ${type === "success" ? "rgba(0,200,150,0.3)" : "rgba(255,92,122,0.3)"}`,
        borderRadius: 12,
        padding: "13px 18px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        color: "white",
        fontSize: 13,
        fontWeight: 600,
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        animation: "toast-in 0.35s cubic-bezier(0.34,1.2,0.64,1)",
        maxWidth: 360,
        fontFamily: "'DM Sans', sans-serif",
        cursor: "pointer",
      }}
      onClick={onClose}
    >
      <span>{type === "success" ? "✅" : "⚠"}</span>
      {message}
    </div>
  );
}

export default function SalesPage() {
  // ── View state ─────────────────────────────────────────────────────────────
  const [view, setView] = useState("invoice"); // "invoice" | "pos"

  // ── Filter state ───────────────────────────────────────────────────────────
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery,  setSearchQuery]  = useState("");

  // ── Modal state ────────────────────────────────────────────────────────────
  const [showInvoiceForm,  setShowInvoiceForm]  = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [selectedInvoice,  setSelectedInvoice]  = useState(null);
  const [payingInvoice,    setPayingInvoice]    = useState(null);
  
  // ── Detail invoice state ─────────────────────────────────────────────────────
  const [invoiceDetail, setInvoiceDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  
  const qc = useQueryClient();

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  // ── Data hooks ─────────────────────────────────────────────────────────────
  const { data: summary,  isLoading: loadingSummary  } = useInvoiceSummary();
  const { data: invoices, isLoading: loadingInvoices } = useInvoices({
    status: statusFilter,
    q:      searchQuery,
  });
  const { data: customers } = useCustomers();

  // ── Mutations ──────────────────────────────────────────────────────────────
  const createInvoice  = useCreateInvoice();
  const sendInvoice    = useSendInvoice();
  const recordPayment  = useRecordPayment();
  const createPOS      = useCreatePOS();
  const createCustomer = useCreateCustomer();

  // ── FETCH DETAIL PAS SELECTED INVOICE BERUBAH ─────────────────────────────
  useEffect(() => {
    if (selectedInvoice?.id) {
      console.log("Fetching detail for:", selectedInvoice.id);
      setLoadingDetail(true);
      
      api.get(`/sales/invoices/${selectedInvoice.id}/`)
        .then(res => {
          console.log("Detail fetched:", res.data);
          console.log("Items:", res.data.items);
          setInvoiceDetail(res.data);
        })
        .catch(err => {
          console.error("Fetch detail failed:", err.response?.status, err.response?.data);
          setInvoiceDetail(null);
        })
        .finally(() => setLoadingDetail(false));
    } else {
      setInvoiceDetail(null);
    }
  }, [selectedInvoice?.id]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  async function handleCreateInvoice(payload) {
    try {
      await createInvoice.mutateAsync(payload);
      setShowInvoiceForm(false);
      showToast("Invoice berhasil dibuat! 🎉");
    } catch (err) {
      showToast(
        err.response?.data?.detail ?? "Gagal membuat invoice",
        "error"
      );
    }
  }

  async function handleSendWA(invoiceId) {
    try {
      const result = await sendInvoice.mutateAsync(invoiceId);
      // Buka WA di tab baru
      if (result.wa_url) window.open(result.wa_url, "_blank");
      showToast("Invoice dikirim via WhatsApp! 📲");
      
      // Refresh detail kalau modal masih buka
      if (selectedInvoice?.id === invoiceId) {
        setLoadingDetail(true);
        api.get(`/sales/invoices/${invoiceId}/`)
          .then(res => setInvoiceDetail(res.data))
          .catch(() => setInvoiceDetail(null))
          .finally(() => setLoadingDetail(false));
      }
    } catch {
      showToast("Gagal mengirim WhatsApp", "error");
    }
  }

  async function handlePayment(payload) {
    try {
      await recordPayment.mutateAsync(payload);
      setPayingInvoice(null);
      setSelectedInvoice(null);
      showToast("Pembayaran berhasil dicatat! 💰");
    } catch (err) {
      showToast(
        err.response?.data?.detail ?? "Gagal mencatat pembayaran",
        "error"
      );
    }
  }

  async function handlePOSSubmit(payload) {
    try {
      const result = await createPOS.mutateAsync(payload);
      showToast(`Transaksi ${result.number} berhasil! 🛒`);
      return result;
    } catch (err) {
      showToast(
        err.response?.data?.detail ?? "Gagal memproses transaksi",
        "error"
      );
      return null;
    }
  }

  async function handleCreateCustomer(payload) {
    try {
      await createCustomer.mutateAsync(payload);
      setShowCustomerForm(false);
      showToast("Pelanggan berhasil ditambahkan! 👤");
    } catch (err) {
      showToast(
        err.response?.data?.name?.[0] ?? "Gagal menambah pelanggan",
        "error"
      );
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Modals */}
      <InvoiceForm
        open={showInvoiceForm}
        onClose={() => setShowInvoiceForm(false)}
        onSave={handleCreateInvoice}
        customers={customers ?? []}
        isLoading={createInvoice.isPending}
        errors={createInvoice.error?.response?.data}
      />

      <InvoiceDetail
        open={!!selectedInvoice}
        onClose={() => {
          setSelectedInvoice(null);
          setInvoiceDetail(null);
        }}
        invoice={invoiceDetail}  // ← HANYA invoiceDetail, gak fallback ke selectedInvoice
        isLoading={loadingDetail}  // ← pass loading state
        onPay={(inv) => {
          setPayingInvoice(invoiceDetail || inv);
          setSelectedInvoice(null);
        }}
        onSendWA={handleSendWA}
        isSending={sendInvoice.isPending}
      />

      <PaymentModal
        open={!!payingInvoice}
        onClose={() => setPayingInvoice(null)}
        invoice={payingInvoice}
        onSave={handlePayment}
        isLoading={recordPayment.isPending}
      />

      <CustomerModal
        open={showCustomerForm}
        onClose={() => setShowCustomerForm(false)}
        onSave={handleCreateCustomer}
        isLoading={createCustomer.isPending}
      />

      {/* ── Page ── */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "28px 24px 48px",
        }}
      >
        {/* ── Page Header ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500, marginBottom: 4 }}>
              Manajemen Penjualan
            </div>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 28,
                color: "#0D2137",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Modul <span style={{ color: "#00C896" }}>Penjualan</span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => setShowCustomerForm(true)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "10px 16px",
                background: "#fff",
                border: "1.5px solid #e2e8f0",
                borderRadius: 9,
                fontSize: 13, fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                color: "#0D2137",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00C896"; e.currentTarget.style.color = "#00C896"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#0D2137"; }}
            >
              👤 Tambah Pelanggan
            </button>
            <button
              onClick={() => setShowInvoiceForm(true)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "10px 18px",
                background: "linear-gradient(135deg,#0D2137,#1a3a55)",
                color: "white",
                border: "none",
                borderRadius: 9,
                fontFamily: "'Syne', sans-serif",
                fontSize: 13, fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: "0 2px 10px rgba(13,33,55,0.2)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "linear-gradient(135deg,#00C896,#00E5B4)"; e.currentTarget.style.color = "#0D2137"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "linear-gradient(135deg,#0D2137,#1a3a55)"; e.currentTarget.style.color = "white"; }}
            >
              📄 Buat Invoice
            </button>
          </div>
        </div>

        {/* ── Summary Cards ── */}
        <SalesSummaryCards data={summary} isLoading={loadingSummary} />

        {/* ── View Toggle ── */}
        <div
          style={{
            display: "flex",
            gap: 4,
            background: "#fff",
            border: "1.5px solid #e2e8f0",
            borderRadius: 10,
            padding: 4,
            marginBottom: 20,
            width: "fit-content",
          }}
        >
          {[
            { key: "invoice", label: "🧾 Daftar Invoice" },
            { key: "pos",     label: "🛒 Kasir Cepat"    },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setView(tab.key)}
              style={{
                padding: "9px 20px",
                borderRadius: 7,
                border: "none",
                background: view === tab.key ? "#0D2137" : "none",
                color: view === tab.key ? "white" : "#64748b",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Syne', sans-serif",
                transition: "all 0.2s",
                boxShadow: view === tab.key ? "0 2px 8px rgba(13,33,55,0.15)" : "none",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        {view === "invoice" ? (
          <InvoiceList
            invoices={invoices ?? []}
            isLoading={loadingInvoices}
            onSelect={setSelectedInvoice}  // ← trigger useEffect fetch detail
            onStatusFilter={setStatusFilter}
            activeStatus={statusFilter}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 380px",
              gap: 20,
              alignItems: "start",
            }}
            className="pos-layout"
          >
            {/* Kiri: info + history singkat */}
            <div>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: "1px solid #e2e8f0",
                  padding: "20px",
                  boxShadow: "0 1px 4px rgba(13,33,55,0.06)",
                }}
              >
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, color: "#0D2137", marginBottom: 12 }}>
                  💡 Tips Kasir Cepat
                </div>
                {[
                  "Kasir cepat untuk transaksi tunai/QRIS langsung tanpa perlu buat invoice formal",
                  "Stok produk otomatis berkurang setelah transaksi berhasil",
                  "Untuk transaksi dengan pelanggan yang butuh faktur, gunakan menu Invoice",
                  "Hasil transaksi langsung masuk ke laporan arus kas harian",
                ].map((tip, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                      marginBottom: 10,
                      fontSize: 13,
                      color: "#64748b",
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: "#00C896", fontWeight: 700, flexShrink: 0 }}>
                      {i + 1}.
                    </span>
                    {tip}
                  </div>
                ))}
              </div>
            </div>

            {/* Kanan: POS form */}
            <POSPanel
              onSubmit={handlePOSSubmit}
              isLoading={createPOS.isPending}
              customers={customers ?? []}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @media (max-width: 900px) {
          .pos-layout {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          div[style*="padding: 28px 24px"] {
            padding: 20px 16px 40px !important;
          }
        }
      `}</style>
    </>
  );
}