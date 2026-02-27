const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../models");

/**
 * ======================================================
 * 🚀 ATIVAÇÃO DE NOVA ESCOLA (PÚBLICA)
 * ======================================================
 * - Cria Escola
 * - Cria Usuário ADMIN_ESCOLA
 * - NÃO usa authMiddleware
 */

router.post("/", async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const {
      tipoPessoa,
      nome,
      cpf,
      cnpj,
      email,
      nomeEscola
    } = req.body;

    // 🔒 Validações básicas
    if (!nome || !email || !nomeEscola) {
      return res.status(400).json({
        error: "Dados obrigatórios não informados"
      });
    }

    // 🔍 Verifica se e-mail já existe
    const usuarioExistente = await db.User.findOne({
      where: { email }
    });

    if (usuarioExistente) {
      return res.status(409).json({
        error: "Já existe um usuário com este e-mail"
      });
    }

    // 🏫 Criação da Escola
    const escola = await db.Escola.create(
      {
        nome: nomeEscola,
        status: "ATIVA"
      },
      { transaction }
    );

    // 🔐 Geração de senha automática
    const senhaGerada = Math.random().toString(36).slice(-8);
    const senhaHash = await bcrypt.hash(senhaGerada, 10);

    // 👤 Criação do Usuário ADMIN_ESCOLA
    const usuario = await db.User.create(
      {
        nome,
        email,
        password: senhaHash,
        perfil: "ADMIN_ESCOLA",
        escolaId: escola.id
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(201).json({
      message: "Ativação realizada com sucesso",
      dadosAcesso: {
        email,
        senha: senhaGerada
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Erro na ativação:", error);

    return res.status(500).json({
      error: "Erro ao processar ativação"
    });
  }
});

module.exports = router;
