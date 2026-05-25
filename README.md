<div align="center">

# 🌑 TenebraTrack

**SaaS Financial Tracker & Semi-ERP Adaptif Berkinerja Tinggi**

[![Status](https://img.shields.io/badge/status-active_development-success.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()

<p align="center">
  TenebraTrack adalah solusi <i>Software as a Service</i> (SaaS) yang mengombinasikan kelincahan <b>Financial Tracker</b> dengan ketangguhan <b>Semi-ERP</b>. Dirancang khusus untuk memotong birokrasi pembukuan konvensional, memberikan otomatisasi penuh dari hulu transaksi ke hilir laporan keuangan tanpa mewajibkan pengguna memahami istilah teknis akuntansi.
</p>

[Pelajari Lebih Lanjut](#-fitur-utama-core-engine) •
[Modul Adaptif](#-modul-adaptif-ekstensi-industri) •
[Tech Stack](#️-tech-stack)

---

</div>

## ✨ Mengapa TenebraTrack?

Sebagian besar ERP terlalu berat untuk UMKM, dan aplikasi pencatat kas terlalu sederhana untuk bisnis yang sedang berkembang. TenebraTrack mengisi celah tersebut dengan **Core Engine** yang ringan untuk akuntansi & inventaris, ditambah **Modul Adaptif** yang berubah wujud menyesuaikan jenis industri penggunanya.

## 🚀 Fitur Utama (Core Engine)

* 📊 **Dashboard "Denyut Nadi" Bisnis:** Pantauan seketika untuk arus kas, piutang, utang, dan metrik kesehatan bisnis.
* 💸 **Order-to-Cash (O2C) Lite:** Kasir pintar terintegrasi, pembuatan faktur digital instan, dan pengingat piutang otomatis (Dunning Management).
* 🛒 **Procure-to-Pay (P2P) Lite:** Pencatatan pengeluaran harian (Snap & Save), manajemen utang *supplier*, dan rekonsiliasi kas.
* 📦 **Inventory Lite:** Perhitungan Harga Pokok Penjualan (HPP) otomatis dan peringatan stok menipis (*Safety Stock Alert*).
* 📈 **Automated Core Accounting:** Menghasilkan Laporan Laba Rugi, Arus Kas, dan Neraca secara otomatis tanpa perlu input jurnal manual.

---

## 🧩 Modul Adaptif (Ekstensi Industri)

Sistem ini dirancang tidak kaku. Antarmuka dan logika bisnis akan beradaptasi secara dinamis jika modul spesifik berikut diaktifkan:

### 🧺 1. Modul Laundry (Work Order Jasa)
* **Kanban Board WO:** Lacak status pesanan secara visual (Antrean ➔ Cuci ➔ Setrika ➔ Selesai).
* **Auto-Cut Consumables:** Pemotongan stok deterjen dan plastik secara otomatis berdasarkan berat atau satuan cucian.

### 🚗 2. Modul Sewa Kendaraan (Asset Booking)
* **Manajemen Aset Tetap:** Pemblokiran kalender untuk memastikan ketersediaan armada.
* **Logika Deposit:** Pemisahan akuntansi secara otomatis antara uang sewa (Pendapatan) dan uang jaminan/deposit (Liabilitas/Utang).

### 💊 3. Modul Farmasi (Klinik & Apotek)
* **Logika FEFO (First Expired, First Out):** Pemotongan stok otomatis berdasarkan Nomor Batch dan Tanggal Kedaluwarsa terdekat.
* **Multi-UOM & Obat Racikan:** Konversi otomatis dari satuan besar (Karton) ke eceran (Strip/Tablet), serta manajemen *Bill of Materials* untuk puyer atau salep.

### 🏬 4. Modul Swalayan (Retail Skala Besar)
* **High-Speed POS:** Antarmuka kasir yang dioptimalkan untuk *full-keyboard* dan *barcode scanner*, lengkap dengan manajemen laci kas serta toleransi selisih pembayaran.
* **Mesin Promo Dinamis & Konsinyasi:** Diskon bertingkat otomatis serta manajemen khusus untuk barang titip jual (terpisah dari kewajiban utang usaha).

---

## 🛠️ Tech Stack

Dibangun dengan arsitektur modern yang berfokus pada kecepatan, keamanan, dan skalabilitas tinggi:

* **Frontend:** React.js, Tailwind CSS
* **Backend:** Django
* **Database:** PostgreSQL

---

<div align="center">
  <b>TenebraTrack</b> dibuat dengan ❤️ untuk memajukan ekosistem bisnis digital.
</div>
