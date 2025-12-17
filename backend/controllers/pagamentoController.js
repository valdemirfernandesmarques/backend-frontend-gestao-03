// backend/controllers/pagamentoController.js
const db = require('../models');

module.exports = {
  // ===============================
  // REGISTRAR PAGAMENTO
  // ===============================
  async registrarPagamento(req, res) {
    const t = await db.sequelize.transaction();

    try {
      const { mensalidadeId, valor, dataPagamento, metodo } = req.body;

      if (!mensalidadeId || !valor || !dataPagamento || !metodo) {
        return res.status(400).json({
          error: 'Campos obrigatórios não informados'
        });
      }

      // 🔎 Busca mensalidade com TODA a hierarquia necessária
      const mensalidade = await db.Mensalidade.findByPk(mensalidadeId, {
        include: [
          {
            model: db.Matricula,
            as: 'matricula',
            include: [
              {
                model: db.Turma,
                as: 'turma',
                include: [
                  {
                    model: db.Professor,
                    as: 'professor'
                  }
                ]
              }
            ]
          }
        ]
      });

      if (!mensalidade) {
        return res.status(404).json({ error: 'Mensalidade não encontrada' });
      }

      // 🔐 Segurança Multi-Tenant
      if (
        req.user.perfil === 'ADMIN_ESCOLA' &&
        mensalidade.escolaId !== req.user.escolaId
      ) {
        return res.status(403).json({
          error: 'Acesso negado para pagamento de outra escola'
        });
      }

      // ❌ Impede pagamento duplicado
      if (mensalidade.status === 'PAGA') {
        return res.status(400).json({
          error: 'Esta mensalidade já está paga'
        });
      }

      // 💰 Cria o pagamento
      const pagamento = await db.Pagamento.create(
        {
          mensalidadeId,
          valor,
          dataPagamento,
          metodo,
          escolaId: mensalidade.escolaId
        },
        { transaction: t }
      );

      // ===============================
      // COMISSÃO DO PROFESSOR (SE EXISTIR)
      // ===============================
      const professor = mensalidade?.matricula?.turma?.professor;

      if (
        professor &&
        professor.vinculo === 'Comissão' &&
        professor.ativo === true &&
        professor.percentualComissao &&
        Number(professor.percentualComissao) > 0
      ) {
        const valorComissao = Number(valor) * Number(professor.percentualComissao);

        await db.Comissao.create(
          {
            pagamentoId: pagamento.id,
            professorId: professor.id,
            valor: valorComissao
          },
          { transaction: t }
        );
      }

      // ===============================
      // ATUALIZA STATUS DA MENSALIDADE
      // ===============================
      mensalidade.status = 'PAGO';
      await mensalidade.save({ transaction: t });

      await t.commit();

      return res.status(201).json({
        message: 'Pagamento registrado com sucesso',
        pagamento
      });
    } catch (error) {
      await t.rollback();
      console.error('Erro ao registrar pagamento:', error);
      return res.status(500).json({
        error: 'Erro ao registrar pagamento',
        details: error.message
      });
    }
  },

  // ===============================
  // LISTAR PAGAMENTOS
  // ===============================
  async listarPagamentos(req, res) {
    try {
      const where = {};

      if (req.user.perfil === 'ADMIN_ESCOLA') {
        where.escolaId = req.user.escolaId;
      }

      const pagamentos = await db.Pagamento.findAll({
        where,
        include: [
          {
            model: db.Mensalidade,
            as: 'mensalidade',
            include: [
              {
                model: db.Matricula,
                as: 'matricula'
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json(pagamentos);
    } catch (error) {
      console.error('Erro ao listar pagamentos:', error);
      res.status(500).json({
        error: 'Erro ao listar pagamentos',
        details: error.message
      });
    }
  }
};
