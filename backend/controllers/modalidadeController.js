// backend/controllers/modalidadeController.js

const db = require('../models');

/**
 * ======================================================
 * ➕ CRIAR MODALIDADE
 * ADMIN_ESCOLA → cria somente na própria escola
 * SUPER_ADMIN → pode criar informando escolaId
 * ======================================================
 */
const criarModalidade = async (req, res) => {
  try {
    const { nome, descricao, precoAula, escolaId: escolaIdBody } = req.body;

    if (!nome || precoAula === undefined || precoAula === null) {
      return res.status(400).json({
        error: 'Os campos nome e precoAula são obrigatórios.'
      });
    }

    let escolaIdFinal = req.user.escolaId;

    // SUPER_ADMIN pode definir escolaId manualmente
    if (req.user.perfil === 'SUPER_ADMIN') {
      if (!escolaIdBody) {
        return res.status(400).json({
          error: 'SUPER_ADMIN deve informar escolaId.'
        });
      }
      escolaIdFinal = escolaIdBody;
    }

    const modalidade = await db.Modalidade.create({
      nome,
      descricao,
      precoAula,
      escolaId: escolaIdFinal
    });

    res.status(201).json({
      message: 'Modalidade criada com sucesso!',
      modalidade
    });

  } catch (error) {
    console.error('Erro ao criar modalidade:', error);
    res.status(500).json({
      error: 'Erro ao criar modalidade',
      details: error.message
    });
  }
};

/**
 * ======================================================
 * 📋 LISTAR MODALIDADES
 * ADMIN_ESCOLA → somente da própria escola
 * SUPER_ADMIN → todas
 * ======================================================
 */
const listarModalidades = async (req, res) => {
  try {
    const where =
      req.user.perfil === 'SUPER_ADMIN'
        ? {}
        : { escolaId: req.user.escolaId };

    const modalidades = await db.Modalidade.findAll({ where });

    res.json(modalidades);
  } catch (error) {
    console.error('Erro ao listar modalidades:', error);
    res.status(500).json({
      error: 'Erro ao listar modalidades',
      details: error.message
    });
  }
};

/**
 * ======================================================
 * 🔍 BUSCAR MODALIDADE POR ID
 * ======================================================
 */
const obterModalidade = async (req, res) => {
  try {
    const where =
      req.user.perfil === 'SUPER_ADMIN'
        ? { id: req.params.id }
        : { id: req.params.id, escolaId: req.user.escolaId };

    const modalidade = await db.Modalidade.findOne({ where });

    if (!modalidade) {
      return res.status(404).json({ error: 'Modalidade não encontrada.' });
    }

    res.json(modalidade);
  } catch (error) {
    console.error('Erro ao obter modalidade:', error);
    res.status(500).json({
      error: 'Erro ao obter modalidade',
      details: error.message
    });
  }
};

/**
 * ======================================================
 * ✏️ ATUALIZAR MODALIDADE
 * ======================================================
 */
const atualizarModalidade = async (req, res) => {
  try {
    const { nome, descricao, precoAula } = req.body;

    const where =
      req.user.perfil === 'SUPER_ADMIN'
        ? { id: req.params.id }
        : { id: req.params.id, escolaId: req.user.escolaId };

    const modalidade = await db.Modalidade.findOne({ where });

    if (!modalidade) {
      return res.status(404).json({ error: 'Modalidade não encontrada.' });
    }

    await modalidade.update({ nome, descricao, precoAula });

    res.json({
      message: 'Modalidade atualizada com sucesso!',
      modalidade
    });
  } catch (error) {
    console.error('Erro ao atualizar modalidade:', error);
    res.status(500).json({
      error: 'Erro ao atualizar modalidade',
      details: error.message
    });
  }
};

/**
 * ======================================================
 * 🗑️ REMOVER MODALIDADE
 * ======================================================
 */
const removerModalidade = async (req, res) => {
  try {
    const where =
      req.user.perfil === 'SUPER_ADMIN'
        ? { id: req.params.id }
        : { id: req.params.id, escolaId: req.user.escolaId };

    const modalidade = await db.Modalidade.findOne({ where });

    if (!modalidade) {
      return res.status(404).json({ error: 'Modalidade não encontrada.' });
    }

    await modalidade.destroy();

    res.json({ message: 'Modalidade removida com sucesso!' });
  } catch (error) {
    console.error('Erro ao remover modalidade:', error);
    res.status(500).json({
      error: 'Erro ao remover modalidade',
      details: error.message
    });
  }
};

module.exports = {
  criarModalidade,
  listarModalidades,
  obterModalidade,
  atualizarModalidade,
  removerModalidade
};
