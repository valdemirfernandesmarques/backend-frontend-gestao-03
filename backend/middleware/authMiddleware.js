// arquivo: src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Middleware de Autenticação Central
 * Pasta: src/middleware/
 * Protege rotas privadas e injeta os dados do usuário (incluindo escolaId) no objeto req.
 * Mantém o isolamento multi-tenant e garante acesso ao SUPER_ADMIN.
 */
module.exports = async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // 1. Verifica se o header de autorização existe e segue o padrão Bearer
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Sessão inválida. Por favor, realize o login novamente.' 
      });
    }

    const token = authHeader.split(' ')[1];

    // 2. Valida o token JWT
    // Se o segredo não estiver no .env, usa o fallback 'segredo123'
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo123');
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Sua sessão expirou. Entre novamente.' });
      }
      return res.status(401).json({ error: 'Token inválido ou corrompido.' });
    }

    // 3. Busca o usuário no banco para garantir que ele ainda existe e está ativo
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado no sistema.' });
    }

    // 4. Injeta os dados do usuário na requisição (req.user)
    // - Para ADMIN_ESCOLA: req.user.escolaId contém o ID da escola (Isolamento garantido).
    // - Para SUPER_ADMIN: req.user.escolaId será null (Acesso global preservado).
    req.user = {
      id: user.id,
      email: user.email,
      perfil: user.perfil,
      escolaId: user.escolaId || null,
      nome: user.nome || '',
      isIsentoTaxa: user.isIsentoTaxa || false 
    };

    // 5. Prossegue para o próximo middleware ou controller
    return next();

  } catch (error) {
    // Log de erro interno
    console.error('Erro crítico no authMiddleware:', error);
    
    return res.status(500).json({ 
      error: 'Erro interno na verificação de autenticação.' 
    });
  }
};