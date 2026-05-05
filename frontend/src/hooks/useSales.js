import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

// ── Customers ─────────────────────────────────────────────────────────────
export function useCustomers(q = "") {
  return useQuery({
    queryKey: ["customers", q],
    queryFn:  async () => {
      const { data } = await api.get("/sales/customers/", { params: { q } })
      return data
    },
  })
}

export function useCreateCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: payload => api.post("/sales/customers/", payload).then(r => r.data),
    onSuccess:  () => qc.invalidateQueries(["customers"]),
  })
}

// ── Invoices ──────────────────────────────────────────────────────────────
export function useInvoices(filters = {}) {
  return useQuery({
    queryKey: ["invoices", filters],
    queryFn:  async () => {
      const { data } = await api.get("/sales/invoices/", { params: filters })
      return data
    },
  })
}

export function useInvoiceSummary() {
  return useQuery({
    queryKey: ["invoice-summary"],
    queryFn:  async () => {
      const { data } = await api.get("/sales/invoices/summary/")
      return data
    },
  })
}

export function useInvoice(id) {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn:  async () => {
      const { data } = await api.get(`/sales/invoices/${id}/`)
      return data
    },
    enabled: !!id,
  })
}

export function useCreateInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: payload => api.post("/sales/invoices/", payload).then(r => r.data),
    onSuccess:  () => {
      qc.invalidateQueries(["invoices"])
      qc.invalidateQueries(["invoice-summary"])
      qc.invalidateQueries(["dashboard-summary"])
    },
  })
}

export function useSendInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: id => api.post(`/sales/invoices/${id}/send/`).then(r => r.data),
    onSuccess:  () => qc.invalidateQueries(["invoices"]),
  })
}

export function useRecordPayment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }) =>
      api.post(`/sales/invoices/${id}/payments/`, payload).then(r => r.data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries(["invoice", id])
      qc.invalidateQueries(["invoices"])
      qc.invalidateQueries(["invoice-summary"])
      qc.invalidateQueries(["dashboard-summary"])
    },
  })
}

// ── POS ───────────────────────────────────────────────────────────────────
export function usePOSTransactions() {
  return useQuery({
    queryKey: ["pos-transactions"],
    queryFn:  async () => {
      const { data } = await api.get("/sales/pos/")
      return data
    },
  })
}

export function useCreatePOS() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: payload => api.post("/sales/pos/", payload).then(r => r.data),
    onSuccess:  () => {
      qc.invalidateQueries(["pos-transactions"])
      qc.invalidateQueries(["dashboard-summary"])
    },
  })
}