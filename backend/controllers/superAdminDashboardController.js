// backend/controllers/superAdminDashboardController.js
const {
  User,
  Escola,
  Matricula,
  Mensalidade,
  Pagamento
} = require("../models");

const { Op, fn, col } = require("sequelize");

// =======================================
// 🔘 Gauge - Dados de Uso do Sistema
// =======================================
exports.usoSistema = async (req, res) => {
  try {
    if (req.user.perfil !== "SUPER_ADMIN") {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const totalEscolas = await Escola.count();

    const escolasAtivas = await Matricula.count({
      distinct: true,
      col: "escolaId",
      where: { status: "ATIVA" },
    });

    const percentualUso = totalEscolas
      ? Math.round((escolasAtivas / totalEscolas) * 100)
      : 0;

    res.json({
      totalEscolas,
      escolasAtivas,
      percentualUso,
      mensagem: "Dados de uso do sistema carregados com sucesso",
    });
  } catch (err) {
    console.error("Erro ao carregar dados de uso:", err);
    res.status(500).json({
      error: "Erro ao carregar dados de uso",
      details: err.message,
    });
  }
};

// =======================================
// 📥 Total de Downloads do App
// =======================================
exports.downloads = async (req, res) => {
  try {
    if (req.user.perfil !== "SUPER_ADMIN") {
      return res.status(403).json({ error: "Acesso negado" });
    }

    // Cada matrícula ativa representa um download
    const totalDownloads = await Matricula.count({
      where: { status: "ATIVA" },
    });

    res.json({
      totalDownloads,
      mensagem: "Total de downloads carregado com sucesso",
    });
  } catch (err) {
    console.error("Erro ao carregar downloads:", err);
    res.status(500).json({
      error: "Erro ao carregar downloads",
      details: err.message,
    });
  }
};

// =======================================
// 👥 Usuários Ativos (Escolas Ativas)
// =======================================
exports.usuariosAtivos = async (req, res) => {
  try {
    if (req.user.perfil !== "SUPER_ADMIN") {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const escolasAtivas = await Matricula.count({
      distinct: true,
      col: "escolaId",
      where: { status: "ATIVA" },
    });

    res.json({
      escolasAtivas,
      mensagem: "Usuários ativos carregados com sucesso",
    });
  } catch (err) {
    console.error("Erro ao carregar usuários ativos:", err);
    res.status(500).json({
      error: "Erro ao carregar usuários ativos",
      details: err.message,
    });
  }
};

// =======================================
// 💳 Receita Mensal por Serviço (Pagamento)
// =======================================
exports.receitaPorServico = async (req, res) => {
  try {
    if (req.user.perfil !== "SUPER_ADMIN") {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    const pagamentos = await Pagamento.findAll({
      attributes: [
        "metodo",
        [fn("SUM", col("valor")), "total"],
      ],
      where: {
        dataPagamento: {
          [Op.between]: [inicioMes, fimMes],
        },
      },
      group: ["metodo"],
    });

    // Normalização recomendada
    const receitas = {
      Pix: 0,
      Crédito: 0,
      Débito: 0,
      Dinheiro: 0,
    };

    pagamentos.forEach((p) => {
      const metodo = String(p.metodo).toLowerCase();
      const total = parseFloat(p.get("total")) || 0;

      if (metodo.includes("pix")) receitas.Pix += total;
      else if (metodo.includes("crédito") || metodo.includes("credito"))
        receitas.Crédito += total;
      else if (metodo.includes("débito") || metodo.includes("debito"))
        receitas.Débito += total;
      else if (metodo.includes("dinheiro"))
        receitas.Dinheiro += total;
    });

    res.json({
      receitas,
      mensagem: "Receita mensal por serviço carregada com sucesso",
    });
  } catch (err) {
    console.error("Erro ao carregar receita por serviço:", err);
    res.status(500).json({
      error: "Erro ao carregar receita por serviço",
      details: err.message,
    });
  }
};

// =======================================
// 📊 Receita Total por Mês (Barras e Linha)
// =======================================
exports.receitaTotalMensal = async (req, res) => {
  try {
    if (req.user.perfil !== "SUPER_ADMIN") {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const meses = [];
    const receitasBarras = [];
    const receitasLinha = [];
    const hoje = new Date();

    for (let i = 11; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const inicio = new Date(data.getFullYear(), data.getMonth(), 1);
      const fim = new Date(data.getFullYear(), data.getMonth() + 1, 0);

      meses.push(
        data.toLocaleString("pt-BR", { month: "short", year: "numeric" })
      );

      const totalMes = await Pagamento.sum("valor", {
        where: {
          dataPagamento: {
            [Op.between]: [inicio, fim],
          },
        },
      });

      receitasBarras.push(totalMes || 0);
      receitasLinha.push(totalMes || 0);
    }

    res.json({
      meses,
      receitasBarras,
      receitasLinha,
      mensagem: "Receita total mensal carregada com sucesso",
    });
  } catch (err) {
    console.error("Erro ao carregar receita total mensal:", err);
    res.status(500).json({
      error: "Erro ao carregar receita total mensal",
      details: err.message,
    });
  }
};
