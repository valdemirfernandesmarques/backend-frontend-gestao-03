// backend/controllers/onboardingController.js

const bcrypt = require('bcryptjs');
const { Escola, User, Contract, Split, AuditLog } = require('../models');

/**
 * Ativação inicial do sistema (Onboarding)
 * Cria:
 *  - Escola
 *  - Usuário ADMIN_ESCOLA
 *  - Contract (TRIAL)
 *  - Splits padrão
 *  - Audit Log
 */
exports.activate = async (req, res) => {
  const transaction = await Escola.sequelize.transaction();

  try {
    const {
      nomeEscola,
      nomeResponsavel,
      email,
      senha,
      modo = 'TEST', // TEST ou PROD
      trialDias = 6 // pode ser alterado futuramente (trial estendido)
    } = req.body;

    if (!nomeEscola || !nomeResponsavel || !email || !senha) {
      return res.status(400).json({
        error: 'Dados obrigatórios não informados'
      });
    }

    // 🔐 Criptografar senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // 🏫 Criar Escola
    const escola = await Escola.create(
      {
        nome: nomeEscola
      },
      { transaction }
    );

    // 👤 Criar Usuário ADMIN_ESCOLA
    const usuario = await User.create(
      {
        nome: nomeResponsavel,
        email,
        password: senhaHash,
        perfil: 'ADMIN_ESCOLA',
        escolaId: escola.id
      },
      { transaction }
    );

    // 📄 Criar Contract (TRIAL)
    const agora = new Date();
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + trialDias);

    const contract = await Contract.create(
      {
        escolaId: escola.id,
        status: 'TRIAL',
        modo,
        taxaPercentual: 1.3,
        trialEndsAt
      },
      { transaction }
    );

    // 🔀 Criar Splits padrão
    await Split.bulkCreate(
      [
        {
          contractId: contract.id,
          tipo: 'PLATFORM',
          percentual: 1.3,
          destinatario: 'PLATAFORMA',
          ativo: true
        },
        {
          contractId: contract.id,
          tipo: 'ESCOLA',
          percentual: 98.7,
          destinatario: 'ESCOLA',
          ativo: true
        }
      ],
      { transaction }
    );

    // 🧾 Audit Log
    await AuditLog.create(
      {
        usuarioId: usuario.id,
        acao: 'ONBOARDING_ACTIVATE',
        entidade: 'contracts',
        entidadeId: contract.id,
        payload: JSON.stringify({
          escolaId: escola.id,
          modo,
          trialDias
        })
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(201).json({
      message: 'Sistema ativado com sucesso',
      escolaId: escola.id,
      contractId: contract.id,
      trialEndsAt
    });
  } catch (error) {
    await transaction.rollback();

    console.error('Erro no onboarding:', error);

    return res.status(500).json({
      error: 'Erro ao ativar sistema',
      details: error.message
    });
  }
};
