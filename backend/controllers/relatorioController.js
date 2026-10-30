// backend/controllers/relatorioController.js
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
  // ===============================
  // RELATÓRIO FINANCEIRO COMPLETO (PDF)
  // ===============================
  async getRelatorioFinanceiro(req, res) {
    try {
      const escolaId =
        req.user.perfil === "ADMIN_ESCOLA" ? req.user.escolaId : null;

      if (!escolaId) {
        // SUPER_ADMIN não pode acessar relatório de escolas
        return res.status(403).json({
          error: "Acesso negado para SUPER_ADMIN",
        });
      }

      // 🔹 BUSCA MENSALIDADES PAGAS
      const mensalidades = await db.Mensalidade.findAll({
        where: {
          escolaId,
          status: "PAGO",
        },
        include: [
          {
            model: db.Matricula,
            as: "matricula",
            include: [
              {
                model: db.Aluno,
                as: "aluno",
                attributes: ["nome"],
              },
            ],
          },
        ],
      });

      // 🔹 BUSCA VENDAS / LANÇAMENTOS FINANCEIROS
      const vendas = await db.LancamentoFinanceiro.findAll({
        where: {
          escolaId,
          tipo: "ENTRADA",
          origem: "VENDA", // garante que só pega vendas
        },
      });

      // 🔹 FORMATANDO PARA O FRONT
      const resultado = [];

      // Adiciona mensalidades
      mensalidades.forEach((m) => {
        resultado.push({
          date: m.updatedAt || m.createdAt,
          type: "Receita",
          description: `Mensalidade - ${m.matricula?.aluno?.nome || "—"}`,
          entity: m.matricula?.aluno?.nome || "—",
          value: Number(m.valor),
        });
      });

      // Adiciona vendas
      vendas.forEach((v) => {
        resultado.push({
          date: v.data,
          type: "Receita",
          description: v.descricao || "Venda",
          entity: v.entidade || "—",
          value: Number(v.valor),
        });
      });

      // Ordena por data (mais recente primeiro)
      resultado.sort((a, b) => new Date(a.date) - new Date(b.date));

      return res.json(resultado);
    } catch (error) {
      console.error("Erro ao gerar relatório financeiro:", error);
      return res.status(500).json({
        error: "Erro ao gerar relatório financeiro",
        details: error.message,
      });
    }
  },

  // ===============================
  // RELATÓRIO DE MENSALIDADES (APENAS)
  // ===============================
  async relatorioMensalidades(req, res) {
    try {
      const escolaId =
        req.user.perfil === "ADMIN_ESCOLA" ? req.user.escolaId : null;

      if (!escolaId) {
        return res.status(403).json({ error: "Acesso negado para SUPER_ADMIN" });
      }

      const mensalidades = await db.Mensalidade.findAll({
        where: { escolaId },
        include: [
          {
            model: db.Matricula,
            as: "matricula",
            include: [
              {
                model: db.Aluno,
                as: "aluno",
                attributes: ["nome"],
              },
            ],
          },
        ],
      });

      return res.json(mensalidades);
    } catch (error) {
      console.error("Erro ao gerar relatório de mensalidades:", error);
      return res.status(500).json({
        error: "Erro ao gerar relatório de mensalidades",
        details: error.message,
      });
    }
  },

  // ===============================
  // ROTA DE TESTE
  // ===============================
  async testeRelatorio(req, res) {
    return res.json({ message: "Relatório funcionando!" });
  },
};
