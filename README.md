# TenebraTrack

**TenebraTrack** is a **SaaS Financial Tracker with Semi-ERP capabilities**, designed specifically for **Small and Medium Enterprises (SMEs)** to simplify financial management without requiring accounting expertise.

The platform automates the entire business workflow—from **sales, expenses, inventory, and CRM to financial reporting**—through an intuitive interface while maintaining accurate accounting records in the background.

---

# ✨ Features

## 1. Multi-Tenant Business Onboarding

Each business gets its own isolated workspace.

### Features

- Business account registration
- Automatic tenant creation
- Industry-specific configuration:
  - Retail
  - Services
  - Food & Beverage
- Auto-generated Chart of Accounts (COA)

---

## 2. Role-Based Access Control (RBAC)

Secure permission management for operational teams.

| Role | Permissions |
|------|------------|
| **Owner** | Full system access |
| **Cashier / Sales** | POS, sales transactions, customer management |
| **Warehouse Staff** | Inventory adjustment and stock control |
| **Finance Staff** | Expenses, supplier bills, cash/bank management |

---

## 3. Smart POS (Point of Sale)

Real-time transaction processing.

### Features

- Product selection
- Automatic tax calculation
- Cash and digital payment support
- Dynamic QRIS integration
- Automatic inventory deduction
- Real-time cash ledger update

---

## 4. Digital Invoicing

Designed for B2B transactions and payment terms.

### Features

- Generate digital invoices
- Share invoices via WhatsApp or Email
- Third-party payment link integration
- Invoice status tracking

---

## 5. Automated Accounts Receivable Reminders

Automated overdue payment follow-up.

### Features

- Due date monitoring
- Automated WhatsApp payment reminders
- Dunning management

---

## 6. Expense Management

### Snap & Save

Record business expenses instantly using receipt photos.

### Features

- Receipt upload
- OCR/manual amount entry
- Expense categorization
- Owner approval workflow

---

## 7. Vendor Bills & Accounts Payable

Manage supplier obligations efficiently.

### Features

- Record supplier invoices
- Payment due dashboard
- Scheduled outgoing payments
- Automatic payable balance updates

---

## 8. Inventory Lite

Synchronize stock movements with financial records.

### Features

- Real-time stock tracking
- Inventory adjustments
- Inventory valuation
- Low stock alerts
- Draft purchase suggestions

---

## 9. Automatic Cost of Goods Sold (COGS) Calculation

Uses the **Moving Average** costing method.

### Benefits

- Instant product profitability insights
- Accurate gross margin tracking

---

## 10. CRM Lite

### Customer Directory

- Purchase history
- Transaction frequency
- Aging invoice monitoring

### Supplier Directory

- Vendor database
- Purchase price history
- Outstanding payable tracking

---

## 11. Financial Reporting

Automatically generated financial reports.

### Reports Available

- Profit & Loss Statement
- Cash Flow Analysis
- Bank Reconciliation
- PDF Export
- Excel Export

---

# 🏗 Tech Stack

## Frontend

Built with **React**

### Main Technologies

- React.js
- React Router
- Axios
- Tailwind CSS / CSS Modules
- Context API / Redux
- Chart.js / Recharts
- QRIS Payment Integration

---

## Backend

Built with **Django + Django REST Framework**

### Main Technologies

- Django
- Django REST Framework
- PostgreSQL
- JWT Authentication
- Multi-tenant architecture
- Celery
- Redis
- File storage for receipts and invoices

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/aditya-lucis/TenebraTrack.git
cd tenebratrack
```

---

## Frontend Setup (React)

Install dependencies:

```bash
cd frontend
npm install
```

Run development server:

```bash
npm run dev
```

Default URL:

```bash
http://localhost:5173
```

---

## Backend Setup (Django)

Create virtual environment:

```bash
cd backend
python -m venv venv
```

Activate virtual environment:

### macOS/Linux

```bash
source venv/bin/activate
```

### Windows

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
python manage.py migrate
```

Start development server:

```bash
python manage.py runserver
```

Default URL:

```bash
http://localhost:8000
```

---

# 🔐 Environment Variables

Example `.env` configuration:

```env
SECRET_KEY=your_secret_key
DEBUG=True

DB_NAME=tenebratrack
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432

REDIS_URL=redis://localhost:6379
```

---

# API Modules

Main API endpoints:

```bash
/api/auth/
/api/tenants/
/api/pos/
/api/invoices/
/api/expenses/
/api/inventory/
/api/crm/
/api/reports/
```

---

# 🛣 Roadmap

Future planned features:

- AI-powered financial insights
- Automated anomaly detection
- Predictive cash flow forecasting
- Tax automation
- Mobile application
- WhatsApp chatbot assistant

---

# 📄 License

MIT License

---

# 👨‍💻 Author

Built with ❤️ by **Your Name**
