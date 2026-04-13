const { Mensalidade, Matricula, Aluno, Turma } = require('../models');
const { Op } = require('sequelize');

// ====================================
// CRIAR MENSALIDADE
// ====================================
const cadastrarMensalidade = async (req, res) => {
  try {
    const { alunoId, turmaId, valor, dataVencimento, status } = req.body;

    if (!alunoId || !turmaId || !valor || !dataVencimento) {
      return res.status(400).json({ erro: 'Campos obrigatórios não preenchidos.' });
    }

    const matricula = await Matricula.findOne({
      where: { alunoId, turmaId }
    });

    if (!matricula) {
      return res.status(404).json({ erro: 'Matrícula não encontrada.' });
    }

    const mensalidade = await Mensalidade.create({
      matriculaId: matricula.id,
      escolaId: matricula.escolaId,
      valor,
      dataVencimento,
      status: status || 'PENDENTE'
    });

    return res.status(201).json(mensalidade);
  } catch (err) {
    console.error('Erro ao cadastrar mensalidade:', err);
    return res.status(500).json({ erro: 'Erro interno ao cadastrar mensalidade.' });
  }
};

// ====================================
// LISTAR MENSALIDADES (🔴 CORRIGIDO)
// ====================================
const listarMensalidades = async (req, res) => {
  try {
    const escolaId =
      req.user.perfil === 'SUPER_ADMIN'
        ? req.query.escolaId
        : req.user.escolaId;

    if (!escolaId) {
      return res.status(400).json({ erro: 'escolaId é obrigatório.' });
    }

    const mensalidades = await Mensalidade.findAll({
      where: { escolaId },
      include: [
        {
          model: Matricula,
          as: 'matricula',
          include: [
            { model: Aluno, as: 'aluno', attributes: ['id', 'nome'] },
            { model: Turma, as: 'turma', attributes: ['id', 'nome'] }
          ]
        }
      ],
      order: [['dataVencimento', 'ASC']]
    });

    return res.json(mensalidades);
  } catch (err) {
    console.error('Erro ao listar mensalidades:', err);
    return res.status(500).json({ erro: 'Erro interno ao listar mensalidades.' });
  }
};

// ====================================
// OBTER MENSALIDADE POR ID
// ====================================
const obterMensalidade = async (req, res) => {
  try {
    const { id } = req.params;

    const mensalidade = await Mensalidade.findByPk(id, {
      include: [
        {
          model: Matricula,
          as: 'matricula',
          include: [
            { model: Aluno, as: 'aluno', attributes: ['id', 'nome'] },
            { model: Turma, as: 'turma', attributes: ['id', 'nome'] }
          ]
        }
      ]
    });

    if (!mensalidade) {
      return res.status(404).json({ erro: 'Mensalidade não encontrada.' });
    }

    return res.json(mensalidade);
  } catch (err) {
    console.error('Erro ao obter mensalidade:', err);
    return res.status(500).json({ erro: 'Erro interno ao obter mensalidade.' });
  }
};

// ====================================
// ATUALIZAR MENSALIDADE
// ====================================
const atualizarMensalidade = async (req, res) => {
  try {
    const { id } = req.params;
    const { alunoId, turmaId, valor, dataVencimento, status } = req.body;

    const mensalidade = await Mensalidade.findByPk(id);
    if (!mensalidade) {
      return res.status(404).json({ erro: 'Mensalidade não encontrada.' });
    }

    let matriculaId = mensalidade.matriculaId;
    let escolaId = mensalidade.escolaId;

    if (alunoId && turmaId) {
      const matricula = await Matricula.findOne({ where: { alunoId, turmaId } });
      if (!matricula) {
        return res.status(404).json({ erro: 'Matrícula não encontrada.' });
      }
      matriculaId = matricula.id;
      escolaId = matricula.escolaId;
    }

    await mensalidade.update({
      matriculaId,
      escolaId,
      valor: valor ?? mensalidade.valor,
      dataVencimento: dataVencimento || mensalidade.dataVencimento,
      status: status || mensalidade.status
    });

    return res.json(mensalidade);
  } catch (err) {
    console.error('Erro ao atualizar mensalidade:', err);
    return res.status(500).json({ erro: 'Erro interno ao atualizar mensalidade.' });
  }
};

// ====================================
// DELETAR MENSALIDADE
// ====================================
const deletarMensalidade = async (req, res) => {
  try {
    const { id } = req.params;

    const mensalidade = await Mensalidade.findByPk(id);
    if (!mensalidade) {
      return res.status(404).json({ erro: 'Mensalidade não encontrada.' });
    }

    await mensalidade.destroy();
    return res.json({ mensagem: 'Mensalidade deletada com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar mensalidade:', err);
    return res.status(500).json({ erro: 'Erro interno ao deletar mensalidade.' });
  }
};

// ====================================
// PAGAR MENSALIDADE
// ====================================
const pagarMensalidade = async (req, res) => {
  try {
    const { id } = req.params;

    const mensalidade = await Mensalidade.findByPk(id);
    if (!mensalidade) {
      return res.status(404).json({ erro: 'Mensalidade não encontrada.' });
    }

    mensalidade.status = 'PAGO';
    mensalidade.dataPagamento = new Date();

    await mensalidade.save();

    return res.json({
      mensagem: 'Mensalidade paga com sucesso.',
      mensalidade
    });
  } catch (err) {
    console.error('Erro ao pagar mensalidade:', err);
    return res.status(500).json({ erro: 'Erro interno ao pagar mensalidade.' });
  }
};

// ====================================
// EXPORT
// ====================================
module.exports = {
  cadastrarMensalidade,
  listarMensalidades,
  obterMensalidade,
  atualizarMensalidade,
  deletarMensalidade,
  pagarMensalidade
};
