const db = require('../models');
const isencaoTaxaController = require('../controllers/isencaoTaxaController');

/**
 * Calcula e registra a taxa da plataforma
 * @param {Object} params
 * @param {number} params.escolaId
 * @param {number} params.valorBase
 * @param {string} params.origem - VENDA | MENSALIDADE
 * @param {Transaction} transaction
 */
const aplicarTaxaPlataforma = async ({
  escolaId,
  valorBase,
  origem,
  transaction,
}) => {
  // 🔍 Verifica se a escola está isenta
  const isencaoAtiva = await isencaoTaxaController.escolaIsentaAtiva(escolaId);

  if (isencaoAtiva) {
    console.log(
      `🚫 Escola ${escolaId} está isenta da taxa da plataforma`
    );
    return {
      taxaAplicada: 0,
      isento: true,
    };
  }

  // 📊 Taxa padrão (por enquanto fixa)
  const percentualTaxa = 0.05; // 5%
  const valorTaxa = Number((valorBase * percentualTaxa).toFixed(2));

  if (valorTaxa <= 0) {
    return {
      taxaAplicada: 0,
      isento: false,
    };
  }

  // 💸 Lançamento financeiro da taxa
  await db.LancamentoFinanceiro.create(
    {
      tipo: 'SAIDA',
      origem: 'TAXA_PLATAFORMA',
      descricao: `Taxa da plataforma (${origem})`,
      valor: valorTaxa,
      data: new Date(),
      escolaId,
    },
    { transaction }
  );

  return {
    taxaAplicada: valorTaxa,
    isento: false,
  };
};

module.exports = {
  aplicarTaxaPlataforma,
};
