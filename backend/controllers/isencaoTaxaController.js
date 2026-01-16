// backend/controllers/isencaoTaxaController.js

const db = require('../models');
const { Op } = require('sequelize');

// ===============================
// CRIAR ISENÇÃO
// ===============================
const criarIsencao = async (req, res) => {
  try {
    if (!req.user || req.user.perfil !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const { escolaId, dataInicio, dataFim, motivo } = req.body;

    if (!dataInicio) {
      return res.status(400).json({ error: 'dataInicio é obrigatória' });
    }

    const isencao = await db.IsencaoTaxa.create({
      escolaId: escolaId || null,
      dataInicio,
      dataFim: dataFim || null,
      motivo: motivo || null,
      criadoPor: req.user.id,
      tipoTaxa: 'PLATAFORMA',
      ativo: true,
    });

    return res.status(201).json({
      message: 'Isenção criada com sucesso',
      isencao,
    });
  } catch (error) {
    console.error('Erro ao criar isenção:', error);
    return res.status(500).json({ error: 'Erro interno ao criar isenção' });
  }
};

// ===============================
// LISTAR ISENÇÕES
// ===============================
const listarIsencoes = async (req, res) => {
  try {
    if (!req.user || req.user.perfil !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    console.log('Listando isenções para SUPER_ADMIN:', req.user.email);

    // Teste: verificar se o model está carregando
    if (!db.IsencaoTaxa) {
      console.error('Model IsencaoTaxa não encontrado!');
      return res.status(500).json({ error: 'Model IsencaoTaxa não encontrado' });
    }

    // Listagem completa
    const isencoes = await db.IsencaoTaxa.findAll({
      include: [
        {
          model: db.Escola,
          as: 'escola',
          attributes: ['id', 'nome'],
          required: false, // evita falha se escolaId estiver nulo
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    console.log(`Total de isenções encontradas: ${isencoes.length}`);
    return res.json(isencoes);
  } catch (error) {
    console.error('Erro ao listar isenções:', error);
    return res.status(500).json({ error: 'Erro interno ao listar isenções', details: error.message });
  }
};

// ===============================
// ALTERAR STATUS (ATIVAR / DESATIVAR)
// ===============================
const alterarStatus = async (req, res) => {
  try {
    if (!req.user || req.user.perfil !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const { id } = req.params;
    const { ativo } = req.body;

    const isencao = await db.IsencaoTaxa.findByPk(id);

    if (!isencao) {
      return res.status(404).json({ error: 'Isenção não encontrada' });
    }

    await isencao.update({ ativo });

    console.log(`Isenção ${id} atualizada para ativo=${ativo}`);

    return res.json({
      message: 'Status da isenção atualizado',
      isencao,
    });
  } catch (error) {
    console.error('Erro ao atualizar status da isenção:', error);
    return res.status(500).json({ error: 'Erro interno ao atualizar status da isenção', details: error.message });
  }
};

// ===============================
// FUNÇÃO INTERNA: Verificar se escola está isenta
// ===============================
const escolaIsentaAtiva = async (escolaId, dataReferencia = new Date()) => {
  try {
    const isencao = await db.IsencaoTaxa.findOne({
      where: {
        ativo: true,
        tipoTaxa: 'PLATAFORMA',
        [Op.and]: [
          { dataInicio: { [Op.lte]: dataReferencia } },
          { [Op.or]: [{ dataFim: null }, { dataFim: { [Op.gte]: dataReferencia } }] },
          { [Op.or]: [{ escolaId }, { escolaId: null }] },
        ],
      },
    });
    return isencao;
  } catch (error) {
    console.error('Erro ao verificar isenção ativa para escola:', error);
    return null;
  }
};

module.exports = {
  criarIsencao,
  listarIsencoes,
  alterarStatus,
  escolaIsentaAtiva,
};
