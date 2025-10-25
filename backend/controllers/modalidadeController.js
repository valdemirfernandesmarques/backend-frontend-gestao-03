// arquivo: backend/src/controllers/modalidadeController.js (CORRIGIDO)

const db = require('../models');

// Criar modalidade
const criarModalidade = async (req, res) => {
    try {
        // Campos corretos esperados do frontend
        const { nome, descricao, precoAula, escolaId } = req.body;

        // Validação CORRIGIDA dos campos obrigatórios
        if (!nome || precoAula === undefined || precoAula === null) {
            return res.status(400).json({
                error: 'Os campos nome e precoAula são obrigatórios.'
            });
        }

        if (!escolaId) {
            return res.status(400).json({
                error: 'A identificação da escola (escolaId) é obrigatória.'
            });
        }

        // Criação da modalidade com os campos corretos
        const modalidade = await db.Modalidade.create({
            nome,
            descricao, // Opcional
            precoAula,
            escolaId // Associando à escola
        });

        res.status(201).json({
            message: 'Modalidade criada com sucesso!',
            modalidade
        });

    } catch (error) {
        console.error('Erro ao criar modalidade:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: 'Erro de validação ao criar modalidade',
                details: error.errors.map(e => e.message)
            });
        }
        res.status(500).json({
            error: 'Erro ao criar modalidade',
            details: error.message
        });
    }
};

// Listar todas as modalidades
const listarModalidades = async (req, res) => {
    try {
        const modalidades = await db.Modalidade.findAll();
        res.json(modalidades);
    } catch (error) {
        console.error('Erro ao listar modalidades:', error);
        res.status(500).json({
            error: 'Erro ao listar modalidades',
            details: error.message
        });
    }
};

// Obter modalidade por ID
const obterModalidade = async (req, res) => {
    try {
        const modalidade = await db.Modalidade.findByPk(req.params.id);
        if (!modalidade) {
            return res.status(404).json({ error: 'Modalidade não encontrada.' });
        }
        res.json(modalidade);
    } catch (error) {
        console.error('Erro ao obter modalidade:', error);
        res.status(500).json({ error: 'Erro ao obter modalidade', details: error.message });
    }
};

// Atualizar modalidade
const atualizarModalidade = async (req, res) => {
    try {
        const { id } = req.params;
        // Campos corretos para atualização
        const { nome, descricao, precoAula } = req.body;

        const modalidade = await db.Modalidade.findByPk(id);
        if (!modalidade) {
            return res.status(404).json({ error: 'Modalidade não encontrada.' });
        }

        await modalidade.update({ nome, descricao, precoAula });

        res.json({
            message: 'Modalidade atualizada com sucesso!',
            modalidade
        });
    } catch (error) {
        console.error('Erro ao atualizar modalidade:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: 'Erro de validação ao atualizar modalidade',
                details: error.errors.map(e => e.message)
            });
        }
        res.status(500).json({
            error: 'Erro ao atualizar modalidade',
            details: error.message
        });
    }
};

// Remover modalidade
const removerModalidade = async (req, res) => {
    try {
        const { id } = req.params;

        const modalidade = await db.Modalidade.findByPk(id);
        if (!modalidade) {
            return res.status(404).json({ error: 'Modalidade não encontrada.' });
        }

        await modalidade.destroy();

        res.json({ message: 'Modalidade removida com sucesso!' });
    } catch (error) {
        console.error('Erro ao remover modalidade:', error);
        res.status(500).json({
            error: 'Erro ao remover modalidade',
            details: error.message
        });
    }
};

module.exports = {
    criarModalidade,
    listarModalidades,
    obterModalidade,
    atualizarModalidade,
    removerModalidade
};