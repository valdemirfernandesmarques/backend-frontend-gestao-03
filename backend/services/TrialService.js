// backend/services/TrialService.js

const { Contract } = require("../models");

class TrialService {
  /**
   * Calcula a data final do trial normal (6 dias)
   */
  static calcularTrialNormal() {
    const agora = new Date();
    const fimTrial = new Date(agora);
    fimTrial.setDate(fimTrial.getDate() + 6);
    fimTrial.setHours(23, 59, 59, 999);
    return fimTrial;
  }

  /**
   * Trial estendido (teste livre)
   * Retorna null → significa "sem data de expiração"
   */
  static calcularTrialEstendido() {
    return null;
  }

  /**
   * Verifica se o trial expirou
   */
  static trialExpirado(contract) {
    if (!contract.trialEndsAt) return false;
    return new Date() > new Date(contract.trialEndsAt);
  }

  /**
   * Atualiza status do contrato se o trial acabou
   */
  static async atualizarStatusContrato(contract) {
    if (
      contract.status === "TRIAL" &&
      this.trialExpirado(contract)
    ) {
      contract.status = "ACTIVE";
      await contract.save();
    }
    return contract;
  }
}

module.exports = TrialService;
