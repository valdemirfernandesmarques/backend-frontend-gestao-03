// backend/controllers/financeiroController.js
const db = require('../models');
const { Op } = require('sequelize');

// ===============================
// LISTAR LANÇAMENTOS
// ===============================
exports.listarLancamentos = async (req, res) => {
  try {
    const { dataInicio, dataFim, tipo, origem, escolaId: escolaIdQuery } = req.query;

    const escolaId =
      req.user.perfil === 'SUPER_ADMIN'
        ? escolaIdQuery
        : req.user.escolaId;

    if (!escolaId) {
      return res.status(400).json({ error: 'escolaId é obrigatório.' });
    }

    const where = { escolaId };

    if (tipo) where.tipo = tipo;
    if (origem) where.origem = origem;

    if (dataInicio && dataFim) {
      where.data = { [Op.between]: [dataInicio, dataFim] };
    }

    const lancamentos = await db.LancamentoFinanceiro.findAll({
      where,
      order: [['data', 'ASC']]
    });

    res.json(lancamentos);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao listar lançamentos',
      details: error.message
    });
  }
};

// ===============================
// RESUMO FINANCEIRO (SALDO)
// ===============================
exports.resumoFinanceiro = async (req, res) => {
  try {
    const { dataInicio, dataFim, escolaId: escolaIdQuery } = req.query;

    const escolaId =
      req.user.perfil === 'SUPER_ADMIN'
        ? escolaIdQuery
        : req.user.escolaId;

    if (!escolaId) {
      return res.status(400).json({ error: 'escolaId é obrigatório.' });
    }

    const where = { escolaId };

    if (dataInicio && dataFim) {
      where.data = { [Op.between]: [dataInicio, dataFim] };
    }

    const lancamentos = await db.LancamentoFinanceiro.findAll({ where });

    let entradas = 0;
    let saidas = 0;

    for (const l of lancamentos) {
      if (l.tipo === 'ENTRADA') entradas += Number(l.valor);
      if (l.tipo === 'SAIDA') saidas += Number(l.valor);
    }

    res.json({
      totalEntradas: Number(entradas.toFixed(2)),
      totalSaidas: Number(saidas.toFixed(2)),
      saldo: Number((entradas - saidas).toFixed(2))
    });

  } catch (error) {
    res.status(500).json({
      error: 'Erro no resumo financeiro',
      details: error.message
    });
  }
};

// ===============================
// DASHBOARD FINANCEIRO
// ===============================
exports.dashboardFinanceiro = async (req, res) => {
  try {
    const { dataInicio, dataFim, escolaId: escolaIdQuery } = req.query;

    const escolaId =
      req.user.perfil === 'SUPER_ADMIN'
        ? escolaIdQuery
        : req.user.escolaId;

    if (!escolaId) {
      return res.status(400).json({ error: 'escolaId é obrigatório.' });
    }

    const where = { escolaId };

    if (dataInicio && dataFim) {
      where.data = { [Op.between]: [dataInicio, dataFim] };
    }

    const lancamentos = await db.LancamentoFinanceiro.findAll({ where });

    let totalEntradas = 0;
    let totalSaidas = 0;
    let entradasPorOrigem = {};

    for (const l of lancamentos) {
      const valor = Number(l.valor);

      if (l.tipo === 'ENTRADA') {
        totalEntradas += valor;
        entradasPorOrigem[l.origem] =
          (entradasPorOrigem[l.origem] || 0) + valor;
      }

      if (l.tipo === 'SAIDA') {
        totalSaidas += valor;
      }
    }

    res.json({
      cards: {
        entradas: Number(totalEntradas.toFixed(2)),
        saidas: Number(totalSaidas.toFixed(2)),
        saldo: Number((totalEntradas - totalSaidas).toFixed(2))
      },
      entradasPorOrigem: Object.keys(entradasPorOrigem).map(origem => ({
        origem,
        total: Number(entradasPorOrigem[origem].toFixed(2))
      }))
    });

  } catch (error) {
    res.status(500).json({
      error: 'Erro ao gerar dashboard financeiro',
      details: error.message
    });
  }
};

// ===============================
// FLUXO FINANCEIRO (USADO NO DASHBOARD)
// ===============================
exports.fluxoFinanceiro = async (req, res) => {
  try {
    const { dataInicio, dataFim, escolaId: escolaIdQuery } = req.query;

    const escolaId =
      req.user.perfil === 'SUPER_ADMIN'
        ? escolaIdQuery
        : req.user.escolaId;

    if (!escolaId) {
      return res.status(400).json({ error: 'escolaId é obrigatório.' });
    }

    const where = { escolaId };

    if (dataInicio && dataFim) {
      where.data = { [Op.between]: [dataInicio, dataFim] };
    }

    const lancamentos = await db.LancamentoFinanceiro.findAll({
      where,
      order: [['data', 'ASC']]
    });

    res.json(lancamentos);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao buscar fluxo financeiro',
      details: error.message
    });
  }
};
