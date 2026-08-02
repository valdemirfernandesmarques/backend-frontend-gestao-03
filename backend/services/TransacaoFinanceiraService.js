// backend/services/TransacaoFinanceiraService.js

const {
  TransacaoFinanceira,
  Pagamento,
  Escola,
} = require('../models');

const BillingService = require('./BillingService');

/**
 * ======================================================
 * 💳 SERVICE DE TRANSAÇÃO FINANCEIRA (SaaS / SUPER_ADMIN)
 * ======================================================
 * Responsável por:
 * - Calcular taxas da plataforma
 * - Aplicar isenção ou trial
 * - Registrar transação financeira consolidada
 * - NÃO realiza cobrança (gateway externo)
 */
class TransacaoFinanceiraService {
  /**
   * ======================================================
   * 🔹 Registra uma transação financeira PROCESSADA
   * ======================================================
   * @param {Object} params
   * @param {number} params.escolaId
   * @param {number|null} params.pagamentoId
   * @param {number} params.valorBruto
   * @param {string} params.gateway (ex: PAGARME_EXEMPLO)
   * @param {string|null} params.gatewayTransactionId
   * @param {Object|null} params.metadata
   */
  static async registrarTransacao({
    escolaId,
    pagamentoId = null,
    valorBruto,
    gateway = 'PAGARME_EXEMPLO', // ⚠️ EXEMPLO — poderá ser trocado futuramente
    gatewayTransactionId = null,
    metadata = null,
  }) {
    if (!escolaId) {
      throw new Error('escolaId é obrigatório');
    }

    if (!valorBruto || valorBruto <= 0) {
      throw new Error('valorBruto inválido');
    }

    // 🔍 Verifica se a escola existe
    const escola = await Escola.findByPk(escolaId);
    if (!escola) {
      throw new Error('Escola não encontrada');
    }

    // 🔢 Calcula valores via BillingService
    const resultado = await BillingService.calcularTransacao({
      escolaId,
      valorBruto,
    });

    const valorPlataforma = Number(
      (resultado.taxaPlataforma || 0).toFixed(2)
    );

    const valorEscola = Number(
      (valorBruto - valorPlataforma).toFixed(2)
    );

    const isencaoAplicada =
      resultado.motivo === 'ISENCAO_ATIVA' ||
      resultado.motivo === 'TRIAL_ATIVO';

    const percentualPlataforma =
      valorBruto > 0
        ? Number(((valorPlataforma / valorBruto) * 100).toFixed(2))
        : 0;

    // 💾 Registra transação financeira consolidada
    const transacao = await TransacaoFinanceira.create({
      escolaId,
      pagamentoId,
      valorBruto,
      percentualPlataforma,
      valorPlataforma,
      valorEscola,
      isencaoAplicada,
      gateway,
      gatewayTransactionId,
      status: 'PROCESSADO',
      dataProcessamento: new Date(),
      metadata: {
        ...metadata,
        motivoCalculo: resultado.motivo,
      },
    });

    return transacao;
  }

  /**
   * ======================================================
   * 🔹 Obtém resumo financeiro da plataforma
   * ======================================================
   */
  static async obterResumoPlataforma() {
    const total = await TransacaoFinanceira.sum('valorPlataforma', {
      where: { status: 'PROCESSADO' },
    });

    const totalIsento = await TransacaoFinanceira.sum('valorBruto', {
      where: {
        status: 'PROCESSADO',
        isencaoAplicada: true,
      },
    });

    return {
      totalPlataforma: Number(total || 0),
      totalIsento: Number(totalIsento || 0),
    };
  }

  /**
   * ======================================================
   * 🔹 Lista transações por escola
   * ======================================================
   */
  static async listarPorEscola(escolaId) {
    return await TransacaoFinanceira.findAll({
      where: { escolaId },
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * ======================================================
   * 🔹 Lista todas as transações (SUPER_ADMIN)
   * ======================================================
   */
  static async listarTodas() {
    return await TransacaoFinanceira.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Escola,
          as: 'escola',
          attributes: ['id', 'nome'],
        },
        {
          model: Pagamento,
          as: 'pagamento',
        },
      ],
    });
  }
}

module.exports = TransacaoFinanceiraService;
