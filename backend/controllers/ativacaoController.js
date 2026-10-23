const db = require("../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

// ===============================
// 🔓 ATIVAÇÃO DE CONTA
// Cria Escola + Usuário ADMIN_ESCOLA
// + SEED INICIAL PARA DASHBOARD (SaaS)
// ===============================
exports.ativarConta = async (req, res) => {
  try {
    const {
      tipoPessoa,
      nome,
      cpf,
      cnpj,
      email,
      nomeEscola,
    } = req.body;

    // ===============================
    // ✅ Validações Básicas
    // ===============================
    if (!nome || !email || !nomeEscola) {
      return res.status(400).json({
        error: "Dados obrigatórios não informados.",
      });
    }

    if (tipoPessoa === "fisica" && !cpf) {
      return res.status(400).json({ error: "CPF é obrigatório." });
    }

    if (tipoPessoa === "juridica" && !cnpj) {
      return res.status(400).json({ error: "CNPJ é obrigatório." });
    }

    // ===============================
    // 🚫 Verifica se e-mail já existe
    // ===============================
    const usuarioExistente = await db.User.findOne({
      where: { email },
    });

    if (usuarioExistente) {
      return res.status(409).json({
        error: "Já existe uma conta com este e-mail.",
      });
    }

    // ===============================
    // 🏫 Criação da Escola
    // ===============================
    const escola = await db.Escola.create({
      nome: nomeEscola,
      nomeResponsavel: nome,
      tipoPessoa,
      cpf: tipoPessoa === "fisica" ? cpf : null,
      cnpj: tipoPessoa === "juridica" ? cnpj : null,
      email,
      status: "ATIVA",
    });

    // ===============================
    // 🔐 Geração de Senha Automática
    // ===============================
    const senhaGerada = Math.random().toString(36).slice(-8);
    const senhaHash = await bcrypt.hash(senhaGerada, 10);

    // ===============================
    // 👤 Criação do ADMIN_ESCOLA
    // ===============================
    const admin = await db.User.create({
      nome,
      email,
      password: senhaHash,
      perfil: "ADMIN_ESCOLA",
      escolaId: escola.id,
    });

    // =====================================================
    // 🌱 SEED INICIAL (OBRIGATÓRIO PARA SaaS EM PRODUÇÃO)
    // Garante Dashboard sempre com gráficos
    // =====================================================

    // 1️⃣ Aluno Demonstração
    const alunoDemo = await db.Aluno.create({
      nome: "Aluno Demonstração",
      email: email,
      telefone: "(00) 00000-0000",
      escolaId: escola.id,
      ativo: true,
    });

    // 2️⃣ Matrícula Ativa
    const matriculaDemo = await db.Matricula.create({
      alunoId: alunoDemo.id,
      escolaId: escola.id,
      status: "ATIVA",
      valorMensalidade: 150,
      dataMatricula: new Date(),
    });

    // 3️⃣ Financeiro Inicial
    await db.Financeiro.create({
      escolaId: escola.id,
      descricao: "Mensalidade Inicial (Ativação)",
      valor: 150,
      data: new Date(),
      tipo: "ENTRADA",
      referencia: "ATIVACAO",
    });

    // ===============================
    // ✅ Sucesso
    // ===============================
    return res.status(201).json({
      message: "Conta ativada com sucesso!",
      escolaId: escola.id,
      email,
      senhaGerada, // ⚠️ em produção, enviar por e-mail
    });

  } catch (error) {
    console.error("❌ Erro na ativação:", error);
    return res.status(500).json({
      error: "Erro interno ao ativar conta.",
    });
  }
};
