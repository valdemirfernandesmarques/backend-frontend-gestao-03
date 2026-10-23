// backend/services/isencaoTaxaService.js
const { IsencaoTaxa } = require('../models');
const { Op } = require('sequelize');

/**
 * ======================================================
 * 🔒 VERIFICA CONFLITO DE ISENÇÃO (REGRA OFICIAL)
 * ======================================================
 * @param {Object} params
 * @param {number|null} params.escolaId
 * @param {Date|string} params.dataInicio
 * @param {Date|string|null} params.dataFim
 * @param {number|null} params.ignoreId (para edição)
 */
async function verificarConflitoIsencao({
  escolaId,
  dataInicio,
  dataFim,
  ignoreId = null
}) {
  const inicio = new Date(dataInicio);
  const fim = dataFim ? new Date(dataFim) : new Date('2099-12-31');

  const where = {
    [Op.and]: [
      // 🔹 Escopo: global OU mesma escola
      {
        [Op.or]: [
          { escolaId: null },
          { escolaId: escolaId ?? null }
        ]
      },
      // 🔹 Período: sobreposição
      {
        dataInicio: {
          [Op.lte]: fim
        }
      },
      {
        [Op.or]: [
          { dataFim: { [Op.gte]: inicio } },
          { dataFim: null }
        ]
      }
    ]
  };

  // 🔹 Ignora o próprio registro em edição
  if (ignoreId) {
    where.id = { [Op.ne]: ignoreId };
  }

  const conflito = await IsencaoTaxa.findOne({ where });

  return !!conflito;
}

/**
 * ======================================================
 * 💳 VERIFICA SE EXISTE ISENÇÃO ATIVA (GATEWAY)
 * ======================================================
 * @param {number|null} escolaId
 * @param {Date} [dataReferencia]
 * @returns {boolean}
 */
async function existeIsencaoAtiva(escolaId, dataReferencia = new Date()) {
  const data = new Date(dataReferencia);

  const isencao = await IsencaoTaxa.findOne({
    where: {
      [Op.and]: [
        {
          [Op.or]: [
            { escolaId: null },
            { escolaId }
          ]
        },
        {
          dataInicio: {
            [Op.lte]: data
          }
        },
        {
          [Op.or]: [
            { dataFim: { [Op.gte]: data } },
            { dataFim: null }
          ]
        }
      ]
    }
  });

  return !!isencao;
}

/**
 * ======================================================
 * 🧾 OBTÉM ISENÇÃO ATIVA (AUDITORIA / DEBUG)
 * ======================================================
 */
async function getIsencaoAtivaHoje(escolaId) {
  const hoje = new Date();

  return await IsencaoTaxa.findOne({
    where: {
      [Op.and]: [
        {
          [Op.or]: [
            { escolaId: null },
            { escolaId }
          ]
        },
        {
          dataInicio: {
            [Op.lte]: hoje
          }
        },
        {
          [Op.or]: [
            { dataFim: { [Op.gte]: hoje } },
            { dataFim: null }
          ]
        }
      ]
    }
  });
}

module.exports = {
  verificarConflitoIsencao,
  existeIsencaoAtiva,
  getIsencaoAtivaHoje
};
