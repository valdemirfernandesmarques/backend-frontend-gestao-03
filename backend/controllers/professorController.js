// backend/controllers/professorController.js
const db = require('../models');

/**
 * ======================================================
 * ➕ CRIAR PROFESSOR
 * ======================================================
 */
exports.criarProfessor = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const {
      nome,
      cpf,
      vinculo,
      email,
      telefone,
      endereco,
      ativo,
      modalidadeIds = []
    } = req.body;

    if (!nome || !cpf || !vinculo) {
      await transaction.rollback();
      return res.status(400).json({
        error: 'Nome, CPF e vínculo são obrigatórios'
      });
    }

    const escolaId = req.user.escolaId;

    if (!escolaId && req.user.perfil !== 'SUPER_ADMIN') {
      await transaction.rollback();
      return res.status(403).json({
        error: 'Usuário sem escola vinculada'
      });
    }

    // 1️⃣ Cria o professor
    const professor = await db.Professor.create({
      nome,
      cpf,
      vinculo,
      email,
      telefone,
      endereco,
      ativo,
      escolaId
    }, { transaction });

    // 2️⃣ Associa modalidades (many-to-many)
    if (modalidadeIds.length > 0) {
      await professor.setModalidades(modalidadeIds, { transaction });
    }

    await transaction.commit();

    return res.status(201).json({
      message: 'Professor criado com sucesso!',
      professor
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao criar professor:', error);

    return res.status(500).json({
      error: 'Erro ao criar professor'
    });
  }
};

/**
 * ======================================================
 * 📋 LISTAR PROFESSORES
 * ======================================================
 */
exports.listarProfessores = async (req, res) => {
  try {
    const where = {};

    if (req.user.perfil !== 'SUPER_ADMIN') {
      where.escolaId = req.user.escolaId;
    }

    const professores = await db.Professor.findAll({
      where,
      include: [
        {
          model: db.Modalidade,
          as: 'modalidades',
          through: { attributes: [] }
        }
      ],
      order: [['nome', 'ASC']]
    });

    return res.json(professores);

  } catch (error) {
    console.error('Erro ao listar professores:', error);
    return res.status(500).json({
      error: 'Erro ao listar professores'
    });
  }
};

/**
 * ======================================================
 * 🔍 OBTER PROFESSOR
 * ======================================================
 */
exports.obterProfessor = async (req, res) => {
  try {
    const where = { id: req.params.id };

    if (req.user.perfil !== 'SUPER_ADMIN') {
      where.escolaId = req.user.escolaId;
    }

    const professor = await db.Professor.findOne({
      where,
      include: [
        {
          model: db.Modalidade,
          as: 'modalidades',
          through: { attributes: [] }
        }
      ]
    });

    if (!professor) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }

    return res.json(professor);

  } catch (error) {
    console.error('Erro ao obter professor:', error);
    return res.status(500).json({
      error: 'Erro ao obter professor'
    });
  }
};

/**
 * ======================================================
 * ✏️ ATUALIZAR PROFESSOR
 * ======================================================
 */
exports.atualizarProfessor = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { modalidadeIds, escolaId, ...dados } = req.body;

    const where = { id: req.params.id };

    if (req.user.perfil !== 'SUPER_ADMIN') {
      where.escolaId = req.user.escolaId;
    }

    const professor = await db.Professor.findOne({ where });

    if (!professor) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Professor não encontrado' });
    }

    await professor.update(dados, { transaction });

    if (Array.isArray(modalidadeIds)) {
      await professor.setModalidades(modalidadeIds, { transaction });
    }

    await transaction.commit();

    return res.json({
      message: 'Professor atualizado com sucesso!',
      professor
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao atualizar professor:', error);

    return res.status(500).json({
      error: 'Erro ao atualizar professor'
    });
  }
};

/**
 * ======================================================
 * 🗑️ DELETAR PROFESSOR
 * ======================================================
 */
exports.deletarProfessor = async (req, res) => {
  try {
    const where = { id: req.params.id };

    if (req.user.perfil !== 'SUPER_ADMIN') {
      where.escolaId = req.user.escolaId;
    }

    const professor = await db.Professor.findOne({ where });

    if (!professor) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }

    await professor.destroy();

    return res.json({
      message: 'Professor apagado com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao apagar professor:', error);
    return res.status(500).json({
      error: 'Erro ao apagar professor'
    });
  }
};
