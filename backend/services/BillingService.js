// backend/services/BillingService.js

const {
  Contract,
  BillingCycle,
  IsencaoTaxa,
  Split,
} = require("../models");

class BillingService {
  /**
   * Calcula a taxa da plataforma (ex: 1.3%)
   */
  static calcularTaxa(valor, percentual) {
    if (!valor || valor <= 0) return 0;
    return Number(((valor * percentual) / 100).toFixed(2));
  }

  /**
   * Verifica se existe isenção ativa para a escola
   */
  static async possuiIsencao(escolaId, tipoTaxa = "PLATAFORMA") {
    const hoje = new Date();

    const isencao = await IsencaoTaxa.findOne({
      where: {
        escolaId,
        tipoTaxa,
        ativo: true,
      },
    });

    if (!isencao) return false;

    if (isencao.dataInicio && hoje < new Date(isencao.dataInicio)) {
      return false;
    }

    if (isencao.dataFim && hoje > new Date(isencao.dataFim)) {
      return false;
    }

    return true;
  }

  /**
   * Calcula valores financeiros de uma transação
   * NÃO cobra, apenas calcula
   */
  static async calcularTransacao({
    escolaId,
    valorBruto,
  }) {
    const contract = await Contract.findOne({
      where: { escolaId },
    });

    if (!contract) {
      throw new Error("Contrato não encontrado para a escola");
    }

    // Trial → não cobra taxa
    if (contract.status === "TRIAL") {
      return {
        valorBruto,
        taxaPlataforma: 0,
        valorLiquido: valorBruto,
        motivo: "TRIAL_ATIVO",
      };
    }

    // Isenção ativa → não cobra taxa
    const isento = await this.possuiIsencao(escolaId);

    if (isento) {
      return {
        valorBruto,
        taxaPlataforma: 0,
        valorLiquido: valorBruto,
        motivo: "ISENCAO_ATIVA",
      };
    }

    // Cálculo normal
    const taxa = this.calcularTaxa(
      valorBruto,
      contract.taxaPercentual
    );

    const liquido = Number(
      (valorBruto - taxa).toFixed(2)
    );

    return {
      valorBruto,
      taxaPlataforma: taxa,
      valorLiquido: liquido,
      motivo: "COBRANCA_NORMAL",
    };
  }

  /**
   * Obtém splits do contrato
   */
  static async obterSplits(contractId) {
    return await Split.findAll({
      where: {
        contractId,
        ativo: true,
      },
    });
  }

  /**
   * Cria ou atualiza ciclo de billing
   */
  static async registrarNoCiclo({
    escolaId,
    contractId,
    valorBruto,
    taxa,
    liquido,
  }) {
    const hoje = new Date();
    const inicioMes = new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      1
    );
    const fimMes = new Date(
      hoje.getFullYear(),
      hoje.getMonth() + 1,
      0
    );

    let ciclo = await BillingCycle.findOne({
      where: {
        escolaId,
        contractId,
        status: "OPEN",
      },
    });

    if (!ciclo) {
      ciclo = await BillingCycle.create({
        escolaId,
        contractId,
        inicio: inicioMes,
        fim: fimMes,
      });
    }

    ciclo.totalBruto += valorBruto;
    ciclo.totalTaxa += taxa;
    ciclo.totalLiquido += liquido;

    await ciclo.save();

    return ciclo;
  }
}

module.exports = BillingService;
