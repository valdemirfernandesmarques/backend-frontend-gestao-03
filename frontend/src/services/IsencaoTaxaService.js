// arquivo: src/services/IsencaoTaxaService.js
import api from '@/api/api' // usa a instância do Axios já configurada

export default {
  // Criar nova isenção
  criarIsencao: async (dados) => {
    // dados = { escolaId, dataInicio, dataFim, motivo }
    const response = await api.post('/isencao-taxa', dados)
    return response.data
  },

  // Listar todas as isenções
  listarIsencoes: async () => {
    const response = await api.get('/isencao-taxa')
    return response.data
  },

  // Ativar ou desativar isenção
  alterarStatus: async (id, ativo) => {
    // ativo = true | false
    const response = await api.put(`/isencao-taxa/${id}/status`, { ativo })
    return response.data
  },
}
