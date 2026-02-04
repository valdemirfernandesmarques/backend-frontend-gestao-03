const db = require('../models');
const sequelize = db.sequelize;

// ===============================
// LISTAR VENDAS
// ===============================
exports.listarVendas = async (req, res) => {
  try {
    const escolaId =
      req.user.perfil === 'SUPER_ADMIN'
        ? req.query.escolaId
        : req.user.escolaId;

    if (!escolaId) {
      return res.status(400).json({ error: 'escolaId é obrigatório.' });
    }

    const vendas = await db.Venda.findAll({
      where: { escolaId },
      include: [
        {
          model: db.VendaItem,
          as: 'itens',
          include: [{ model: db.Produto, as: 'produto' }]
        }
      ],
      order: [['dataVenda', 'DESC']]
    });

    res.json(vendas);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao listar vendas',
      details: error.message
    });
  }
};

// ===============================
// OBTER VENDA POR ID
// ===============================
exports.obterVenda = async (req, res) => {
  try {
    const { id } = req.params;

    const venda = await db.Venda.findByPk(id, {
      include: [
        {
          model: db.VendaItem,
          as: 'itens',
          include: [{ model: db.Produto, as: 'produto' }]
        }
      ]
    });

    if (!venda) {
      return res.status(404).json({ error: 'Venda não encontrada.' });
    }

    if (
      req.user.perfil !== 'SUPER_ADMIN' &&
      venda.escolaId !== req.user.escolaId
    ) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    res.json(venda);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao buscar venda',
      details: error.message
    });
  }
};

// ===============================
// CRIAR VENDA
// ===============================
exports.criarVenda = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      itens,
      metodoPagamento,
      escolaId: escolaIdBody,
      alunoId,
      usuarioId
    } = req.body;

    if (!Array.isArray(itens) || itens.length === 0) {
      await t.rollback();
      return res.status(400).json({ error: 'Itens da venda são obrigatórios.' });
    }

    const escolaId =
      req.user.perfil === 'SUPER_ADMIN'
        ? escolaIdBody
        : req.user.escolaId;

    if (!escolaId) {
      await t.rollback();
      return res.status(400).json({ error: 'escolaId é obrigatório.' });
    }

    // ===============================
    // CALCULA TOTAIS
    // ===============================
    let totalBruto = 0;

    for (const item of itens) {
      totalBruto += Number(item.precoUnitario) * Number(item.quantidade);
    }

    const totalLiquido = Number(totalBruto.toFixed(2));

    // ===============================
    // CRIA VENDA
    // ===============================
    const venda = await db.Venda.create(
      {
        totalBruto,
        totalDescontos: 0,
        totalLiquido,
        metodoPagamento,
        dataVenda: new Date(),
        status: 'Concluida',
        escolaId,
        alunoId: alunoId || null,
        usuarioId: usuarioId || req.user.id
      },
      { transaction: t }
    );

    // ===============================
    // CRIA ITENS + BAIXA ESTOQUE
    // ===============================
    for (const item of itens) {
      // Busca produto da escola correta
      const produto = await db.Produto.findOne({
        where: {
          id: item.produtoId,
          escolaId
        },
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      if (!produto) {
        throw new Error(`Produto ${item.produtoId} não encontrado`);
      }

      if (produto.quantidade < item.quantidade) {
        throw new Error(
          `Estoque insuficiente para o produto ${produto.nome}`
        );
      }

      // Cria item da venda
      await db.VendaItem.create(
        {
          vendaId: venda.id,
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
          subtotal: Number(
            (item.precoUnitario * item.quantidade).toFixed(2)
          )
        },
        { transaction: t }
      );

      // Dá baixa no estoque
      produto.quantidade -= item.quantidade;
      await produto.save({ transaction: t });
    }

    // ===============================
    // CRIA PAGAMENTO
    // ===============================
    await db.Pagamento.create(
      {
        vendaId: venda.id,
        valor: totalLiquido,
        metodo: metodoPagamento,
        dataPagamento: new Date(),
        escolaId
      },
      { transaction: t }
    );

    // ===============================
    // LANÇAMENTO FINANCEIRO (ENTRADA)
    // ===============================
    await db.LancamentoFinanceiro.create(
      {
        tipo: 'ENTRADA',
        origem: 'VENDA',
        descricao: `Venda #${venda.id}`,
        valor: totalLiquido,
        data: new Date(),
        escolaId
      },
      { transaction: t }
    );

    await t.commit();

    res.status(201).json({
      message: 'Venda registrada com sucesso',
      vendaId: venda.id
    });

  } catch (error) {
    await t.rollback();
    console.error('Erro ao criar venda:', error);
    res.status(500).json({
      error: 'Erro ao criar venda',
      details: error.message
    });
  }
};
