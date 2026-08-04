// backend/controllers/webhookController.js

const { AuditLog } = require("../models");

class WebhookController {
  /**
   * Webhook genérico (gateway agnóstico)
   */
  static async handle(req, res) {
    try {
      const {
        gateway,
        event,
        data,
      } = req.body;

      if (!gateway || !event) {
        return res.status(400).json({
          error: "Payload inválido",
        });
      }

      // 🔍 Registra tudo para auditoria
      await AuditLog.create({
        origem: gateway,
        evento: event,
        payload: JSON.stringify(data || {}),
      });

      // 🔔 Aqui no futuro:
      // - pagamento aprovado
      // - pagamento recusado
      // - estorno
      // - chargeback
      // - fechamento de ciclo

      return res.status(200).json({
        status: "recebido",
      });
    } catch (error) {
      console.error("Erro no webhook:", error);

      return res.status(500).json({
        error: "Erro interno no webhook",
      });
    }
  }
}

module.exports = WebhookController;
