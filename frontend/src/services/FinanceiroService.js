// src/services/FinanceiroService.js
import api from '@/api/api'

// ===============================
// SERVICE FINANCEIRO (SUPER_ADMIN)
// ===============================
export default {
  // ===============================
  // RESUMO FINANCEIRO (DASHBOARD)
  // ===============================
  async getResumoFinanceiro(params = {}) {
    const response = await api.get('/financeiro/resumo', {
      params,
    })
    return response.data
  },

  // ===============================
  // LISTAR LANÇAMENTOS FINANCEIROS
  // ===============================
  async listarLancamentos(params = {}) {
    const response = await api.get('/financeiro', {
      params,
    })
    return response.data
  },
}
