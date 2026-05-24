export function fmt(angka) {
  if (!angka && angka !== 0) return "Rp 0";
  if (angka >= 1_000_000_000) return `Rp ${(angka / 1_000_000_000).toFixed(1)}M`;
  if (angka >= 1_000_000) return `Rp ${(angka / 1_000_000).toFixed(1)}jt`;
  if (angka >= 1_000) return `Rp ${(angka / 1_000).toFixed(0)}rb`;
  return `Rp ${angka.toLocaleString("id-ID")}`;
}

export function trialDaysLabel(days) {
  if (!days || days <= 0) return "Masa uji coba telah berakhir";
  return `Masa Uji Coba Gratis — ${days} hari tersisa`;
}

export const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "sales", label: "Penjualan" },
  { key: "purchase", label: "Pembelian" },
  { key: "inventory", label: "Stok" },
  { key: "expenses", label: "Pengeluaran" },
  { key: "contacts", label: "Kontak" },
  { key: "reports", label: "Laporan" },
];

export const STAT_CONFIG = [
  { label: "Saldo Kas & Bank", key: "saldo_kas", changeKey: "saldo_change", color: "#00C896" },
  { label: "Piutang Belum Lunas", key: "total_piutang", changeKey: "piutang_change", color: "#3b82f6" },
  { label: "Utang ke Supplier", key: "total_utang", changeKey: "utang_change", color: "#f59e0b" },
  { label: "Laba Bersih Bulan Ini", key: "laba_bersih", changeKey: "laba_change", color: "#00C896" },
];