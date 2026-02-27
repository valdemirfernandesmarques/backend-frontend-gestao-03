const { Produto } = require('../models');

exports.criar = async (req, res) => {
    try {
        // Captura os dados do corpo da requisição
        const { nome, preco, quantidade, descricao, escolaId } = req.body;

        // Validação de Usuário/Escola
        let escolaIdFinal;
        if (req.user.perfil === 'SUPER_ADMIN') {
            if (!escolaId) return res.status(400).json({ error: 'SUPER_ADMIN precisa informar o escolaId.' });
            escolaIdFinal = escolaId;
        } else {
            escolaIdFinal = req.user.escolaId;
        }

        if (!escolaIdFinal) return res.status(400).json({ error: 'escolaId não identificado.' });
        if (!nome || preco === undefined) return res.status(400).json({ error: 'Nome e Preço são obrigatórios.' });

        // Tratamento da Imagem (Multer)
        // Usamos 'imageUrl' para bater com o que o seu frontend espera ler
        let fotoPath = null;
        if (req.file) {
            fotoPath = req.file.filename; 
        }

        const produto = await Produto.create({
            nome,
            descricao: descricao || '', // Evita erro se o campo for obrigatório no banco
            preco: parseFloat(preco),
            quantidade: parseInt(quantidade) || 0,
            escolaId: escolaIdFinal,
            imageUrl: fotoPath // Padronizado com o frontend
        });

        res.status(201).json({ message: 'Produto criado com sucesso', produto });
    } catch (error) {
        console.error('ERRO NO BACKEND (Criar Produto):', error);
        res.status(500).json({ error: 'Erro interno ao criar produto', details: error.message });
    }
};

exports.listar = async (req, res) => {
    try {
        let where = {};
        if (req.user.perfil === 'ADMIN_ESCOLA') {
            where.escolaId = req.user.escolaId;
        } else if (req.user.perfil === 'SUPER_ADMIN' && req.query.escolaId) {
            where.escolaId = req.query.escolaId;
        }
        const produtos = await Produto.findAll({ where });
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar produtos' });
    }
};

exports.obter = async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id);
        if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
        res.json(produto);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter produto' });
    }
};

exports.atualizar = async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id);
        if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });

        const { nome, preco, quantidade } = req.body;
        await produto.update({
            nome: nome ?? produto.nome,
            preco: preco ?? produto.preco,
            quantidade: quantidade ?? produto.quantidade,
        });
        res.json({ message: 'Produto atualizado', produto });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
};

exports.remover = async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id);
        if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
        await produto.destroy();
        res.json({ message: 'Produto removido' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover produto' });
    }
};

exports.uploadImagem = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
        const produto = await Produto.findByPk(req.params.id);
        if (!produto) return res.status(404).json({ error: 'Produto não encontrado.' });

        produto.imageUrl = req.file.filename;
        await produto.save();
        res.json({ message: 'Imagem atualizada', imageUrl: produto.imageUrl });
    } catch (err) {
        res.status(500).json({ error: 'Erro no upload' });
    }
};