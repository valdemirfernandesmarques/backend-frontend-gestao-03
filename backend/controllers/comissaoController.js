// backend/controllers/comissaoController.js
const db = require('../models');

/**
 * ======================================================
 * ➕ CRIAR COMISSÃO
 * ADMIN_ESCOLA → somente professores da própria escola
 * SUPER_ADMIN → livre
 * ======================================================
 */
const criarComissao = async (req, res) => {
  try {
    const { professorId, valor, pagamentoId } = req.body;

    if (!professorId || !valor || !pagamentoId) {
      return res.status(400).json({
        error: 'Os campos professorId, valor e pagamentoId são obrigatórios.'
      });
    }

    // 🔒 Valida se o professor pertence à escola
    const professor = await db.Professor.findOne({
      where:
        req.user.perfil === 'SUPER_ADMIN'
          ? { id: professorId }
          : { id: professorId, escolaId: req.user.escolaId }
    });

    if (!professor) {
      return res.status(403).json({
        error: 'Professor não pertence à sua escola.'
      });
    }

    const comissao = await db.Comissao.create({
      professorId,
      valor,
      pagamentoId
    });

    res.status(201).json({
      message: 'Comissão criada com sucesso!',
      comissao
    });
  } catch (error) {
    console.error('Erro ao criar comissão:', error);
    res.status(500).json({
      error: 'Erro ao criar comissão',
      details: error.message
    });
  }
};

/**
 * ======================================================
 * 📋 LISTAR TODAS AS COMISSÕES
 * ADMIN_ESCOLA → somente da própria escola
 * SUPER_ADMIN → todas
 * ======================================================
 */
const listarTodas = async (req, res) => {
  try {
    const include = [
      {
        model: db.Professor,
        as: 'professor',
        where:
          req.user.perfil === 'SUPER_ADMIN'
            ? {}
            : { escolaId: req.user.escolaId }
      },
      { model: db.Pagamento, as: 'pagamento' }
    ];

    const comissoes = await db.Comissao.findAll({ include });

    res.json(comissoes);
  } catch (error) {
    console.error('Erro ao listar comissões:', error);
    res.status(500).json({
      error: 'Erro ao listar comissões',
      details: error.message
    });
  }
};

/**
 * ======================================================
 * 📋 LISTAR COMISSÕES POR PROFESSOR
 * ======================================================
 */
const listarPorProfessor = async (req, res) => {
  try {
    const { professorId } = req.params;

    // 🔒 Valida professor x escola
    const professor = await db.Professor.findOne({
      where:
        req.user.perfil === 'SUPER_ADMIN'
          ? { id: professorId }
          : { id: professorId, escolaId: req.user.escolaId }
    });

    if (!professor) {
      return res.status(403).json({
        error: 'Professor não pertence à sua escola.'
      });
    }

    const comissoes = await db.Comissao.findAll({
      where: { professorId },
      include: [
        { model: db.Professor, as: 'professor' },
        { model: db.Pagamento, as: 'pagamento' }
      ]
    });

    const total = comissoes.reduce(
      (acc, c) => acc + parseFloat(c.valor),
      0
    );

    res.json({ professorId, total, comissoes });
  } catch (error) {
    console.error('Erro ao listar comissões do professor:', error);
    res.status(500).json({
      error: 'Erro ao listar comissões do professor',
      details: error.message
    });
  }
};

/**
 * ======================================================
 * ✏️ ATUALIZAR COMISSÃO
 * ======================================================
 */
const atualizarComissao = async (req, res) => {
  try {
    const { id } = req.params;
    const { valor, pagamentoId } = req.body;

    const comissao = await db.Comissao.findByPk(id, {
      include: [{ model: db.Professor, as: 'professor' }]
    });

    if (!comissao) {
      return res.status(404).json({ error: 'Comissão não encontrada' });
    }

    if (
      req.user.perfil !== 'SUPER_ADMIN' &&
      comissao.professor.escolaId !== req.user.escolaId
    ) {
      return res.status(403).json({
        error: 'Você não pode alterar comissão de outra escola.'
      });
    }

    await comissao.update({ valor, pagamentoId });

    res.json({
      message: 'Comissão atualizada com sucesso!',
      comissao
    });
  } catch (error) {
    console.error('Erro ao atualizar comissão:', error);
    res.status(500).json({
      error: 'Erro ao atualizar comissão',
      details: error.message
    });
  }
};

/**
 * ======================================================
 * 🗑️ REMOVER COMISSÃO
 * ======================================================
 */
const removerComissao = async (req, res) => {
  try {
    const { id } = req.params;

    const comissao = await db.Comissao.findByPk(id, {
      include: [{ model: db.Professor, as: 'professor' }]
    });

    if (!comissao) {
      return res.status(404).json({ error: 'Comissão não encontrada' });
    }

    if (
      req.user.perfil !== 'SUPER_ADMIN' &&
      comissao.professor.escolaId !== req.user.escolaId
    ) {
      return res.status(403).json({
        error: 'Você não pode remover comissão de outra escola.'
      });
    }

    await comissao.destroy();

    res.json({ message: 'Comissão removida com sucesso!' });
  } catch (error) {
    console.error('Erro ao remover comissão:', error);
    res.status(500).json({
      error: 'Erro ao remover comissão',
      details: error.message
    });
  }
};

module.exports = {
  criarComissao,
  listarTodas,
  listarPorProfessor,
  atualizarComissao,
  removerComissao
};
