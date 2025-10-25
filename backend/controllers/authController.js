// backend/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { User, PasswordResetToken } = require("../models"); // ⚠️ Certifique-se que PasswordResetToken exista no seu modelo

// ================================
// Login do usuário
// ================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Usuário não encontrado" });

    const senhaValida = await bcrypt.compare(password, user.password);
    if (!senhaValida) return res.status(401).json({ error: "Senha inválida" });

    const token = jwt.sign(
      { id: user.id, email: user.email, perfil: user.perfil, escolaId: user.escolaId },
      process.env.JWT_SECRET || "segredo123",
      { expiresIn: "8h" }
    );

    res.json({ message: "Login realizado com sucesso", token });
  } catch (error) {
    console.error("❌ Erro no login:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

// ================================
// Esqueci a senha - gerar token
// ================================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: "E-mail é obrigatório" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    const token = crypto.randomBytes(32).toString("hex");

    // Salvar token no banco (PasswordResetToken precisa existir)
    await PasswordResetToken.create({
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 3600000) // expira em 1 hora
    });

    // ⚠️ Aqui você enviaria o link por e-mail. Por enquanto retornamos o link para teste
    res.json({
      message: "Link de recuperação gerado",
      resetLink: `http://localhost:3000/reset-password/${token}`
    });
  } catch (error) {
    console.error("❌ Erro ao solicitar recuperação de senha:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

// ================================
// Resetar senha usando token
// ================================
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) return res.status(400).json({ error: "Senha é obrigatória" });

    const resetToken = await PasswordResetToken.findOne({ where: { token } });
    if (!resetToken || resetToken.expiresAt < new Date()) {
      return res.status(400).json({ error: "Token inválido ou expirado" });
    }

    const user = await User.findByPk(resetToken.userId);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    // Atualiza senha do usuário
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    // Remove token após uso
    await resetToken.destroy();

    res.json({ message: "Senha alterada com sucesso" });
  } catch (error) {
    console.error("❌ Erro ao resetar senha:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};
