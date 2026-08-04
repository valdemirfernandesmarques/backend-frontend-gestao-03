// backend/controllers/alunoController.js
const db = require("../models");

/**
 * ======================================================
 * ➕ CRIAR ALUNO
 * ADMIN_ESCOLA → cria SOMENTE na própria escola
 * SUPER_ADMIN → pode criar informando escolaId
 * ======================================================
 */
exports.criarAluno = async (req, res) => {
  try {
    const {
      nome,
      dataNascimento,
      cpf,
      email,
      telefone,
      endereco,
      escolaId: escolaIdBody,
    } = req.body;

    if (!nome) {
      return res.status(400).json({
        error: "O campo nome é obrigatório.",
      });
    }

    let escolaIdFinal = req.user.escolaId;

    // SUPER_ADMIN pode informar escolaId manualmente
    if (req.user.perfil === "SUPER_ADMIN") {
      if (!escolaIdBody) {
        return res.status(400).json({
          error: "SUPER_ADMIN deve informar o escolaId.",
        });
      }
      escolaIdFinal = escolaIdBody;
    }

    if (!escolaIdFinal) {
      return res.status(400).json({
        error: "Escola não identificada para o aluno.",
      });
    }

    const novoAluno = await db.Aluno.create({
      nome,
      dataNascimento,
      cpf,
      email,
      telefone,
      endereco,
      escolaId: escolaIdFinal,
    });

    return res.status(201).json({
      message: "Aluno criado com sucesso!",
      aluno: novoAluno,
    });
  } catch (error) {
    console.error("Erro ao criar aluno:", error);
    return res.status(500).json({
      error: "Erro interno ao criar aluno.",
      details: error.message,
    });
  }
};

/**
 * ======================================================
 * 📋 LISTAR ALUNOS
 * ADMIN_ESCOLA → somente da própria escola
 * SUPER_ADMIN → todos
 * ======================================================
 */
exports.listarAlunos = async (req, res) => {
  try {
    const where =
      req.user.perfil === "SUPER_ADMIN"
        ? {}
        : { escolaId: req.user.escolaId };

    const alunos = await db.Aluno.findAll({
      where,
      order: [["nome", "ASC"]],
    });

    return res.json(alunos);
  } catch (error) {
    console.error("Erro ao listar alunos:", error);
    return res.status(500).json({
      error: "Erro ao listar alunos.",
      details: error.message,
    });
  }
};

/**
 * ======================================================
 * 🔍 BUSCAR ALUNO POR ID
 * ======================================================
 */
exports.buscarAlunoPorId = async (req, res) => {
  try {
    const where =
      req.user.perfil === "SUPER_ADMIN"
        ? { id: req.params.id }
        : { id: req.params.id, escolaId: req.user.escolaId };

    const aluno = await db.Aluno.findOne({ where });

    if (!aluno) {
      return res.status(404).json({
        error: "Aluno não encontrado.",
      });
    }

    return res.json(aluno);
  } catch (error) {
    console.error("Erro ao buscar aluno:", error);
    return res.status(500).json({
      error: "Erro ao buscar aluno.",
      details: error.message,
    });
  }
};

/**
 * ======================================================
 * ✏️ ATUALIZAR ALUNO
 * ======================================================
 */
exports.atualizarAluno = async (req, res) => {
  try {
    const where =
      req.user.perfil === "SUPER_ADMIN"
        ? { id: req.params.id }
        : { id: req.params.id, escolaId: req.user.escolaId };

    const aluno = await db.Aluno.findOne({ where });

    if (!aluno) {
      return res.status(404).json({
        error: "Aluno não encontrado.",
      });
    }

    await aluno.update(req.body);

    return res.json({
      message: "Aluno atualizado com sucesso!",
      aluno,
    });
  } catch (error) {
    console.error("Erro ao atualizar aluno:", error);
    return res.status(500).json({
      error: "Erro ao atualizar aluno.",
      details: error.message,
    });
  }
};

/**
 * ======================================================
 * 🗑️ DELETAR ALUNO
 * ======================================================
 */
exports.deletarAluno = async (req, res) => {
  try {
    const where =
      req.user.perfil === "SUPER_ADMIN"
        ? { id: req.params.id }
        : { id: req.params.id, escolaId: req.user.escolaId };

    const aluno = await db.Aluno.findOne({ where });

    if (!aluno) {
      return res.status(404).json({
        error: "Aluno não encontrado.",
      });
    }

    await aluno.destroy();

    return res.json({
      message: "Aluno removido com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao deletar aluno:", error);
    return res.status(500).json({
      error: "Erro ao deletar aluno.",
      details: error.message,
    });
  }
};
