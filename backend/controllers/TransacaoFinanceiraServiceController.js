// backend/controllers/TransacaoFinanceiraServiceController.js

const TransacaoFinanceiraService = require('../services/TransacaoFinanceiraService');
const { Parser } = require('json2csv');

class TransacaoFinanceiraServiceController {
  /**
   * ======================================================
   * 🔹 Lista TODAS as transações (SUPER_ADMIN)
   * ======================================================
   * GET /api/transacoes-financeiras
   */
  static async listarTodas(req, res) {
    try {
      if (req.user.perfil !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Acesso restrito ao SUPER_ADMIN' });
      }

      const transacoes = await TransacaoFinanceiraService.listarTodas();
      return res.json(transacoes);
    } catch (error) {
      console.error('Erro listarTodas:', error);
      return res.status(500).json({ error: 'Erro ao listar transações financeiras' });
    }
  }

  /**
   * ======================================================
   * 🔹 Lista TODAS as transações para CSV (SUPER_ADMIN)
   * ======================================================
   */
  static async exportarCSV(req, res) {
    try {
      if (req.user.perfil !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Acesso restrito ao SUPER_ADMIN' });
      }

      const transacoes = await TransacaoFinanceiraService.listarTodas();

      const fields = ['id', 'escolaId', 'tipo', 'origem', 'valor', 'data', 'criadoEm'];
      const parser = new Parser({ fields });
      const csv = parser.parse(
        transacoes.map(t => ({
          id: t.id,
          escolaId: t.escolaId,
          tipo: t.tipo,
          origem: t.origem,
          valor: t.valor,
          data: t.data ? t.data.toISOString().split('T')[0] : '',
          criadoEm: t.createdAt ? t.createdAt.toISOString().split('T')[0] : '',
        }))
      );

      res.header('Content-Type', 'text/csv');
      res.attachment('transacoes_financeiras.csv');
      return res.send(csv);
    } catch (error) {
      console.error('Erro exportarCSV:', error);
      return res.status(500).json({ error: 'Erro ao exportar CSV' });
    }
  }

  /**
   * ======================================================
   * 🔹 Lista transações por escola
   * ======================================================
   * GET /api/transacoes-financeiras/escola/:escolaId
   */
  static async listarPorEscola(req, res) {
    try {
      if (req.user.perfil !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Acesso restrito ao SUPER_ADMIN' });
      }

      const { escolaId } = req.params;
      const transacoes = await TransacaoFinanceiraService.listarPorEscola(escolaId);
      return res.json(transacoes);
    } catch (error) {
      console.error('Erro listarPorEscola:', error);
      return res.status(500).json({ error: 'Erro ao listar transações da escola' });
    }
  }

  /**
   * ======================================================
   * 🔹 Resumo financeiro da plataforma (Dashboard)
   * ======================================================
   * GET /api/transacoes-financeiras/resumo
   */
  static async obterResumoPlataforma(req, res) {
    try {
      if (req.user.perfil !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Acesso restrito ao SUPER_ADMIN' });
      }

      const resumo = await TransacaoFinanceiraService.obterResumoPlataforma();
      return res.json(resumo);
    } catch (error) {
      console.error('Erro obterResumoPlataforma:', error);
      return res.status(500).json({ error: 'Erro ao obter resumo financeiro' });
    }
  }

  /**
   * ======================================================
   * 🔹 Realizar estorno de uma transação
   * ======================================================
   * POST /api/transacoes-financeiras/estorno
   */
  static async realizarEstorno(req, res) {
    try {
      if (req.user.perfil !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Acesso restrito ao SUPER_ADMIN' });
      }

      const { transacaoId } = req.body;
      if (!transacaoId) {
        return res.status(400).json({ error: 'transacaoId é obrigatório' });
      }

      const resultado = await TransacaoFinanceiraService.estornar(transacaoId);

      return res.json({ sucesso: true, resultado });
    } catch (error) {
      console.error('Erro realizarEstorno:', error);
      return res.status(500).json({ error: 'Erro ao realizar estorno' });
    }
  }
}

module.exports = TransacaoFinanceiraServiceController;
