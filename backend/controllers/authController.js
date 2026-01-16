// backend/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { User, PasswordResetToken } = require("../models");

// ================================
// SMTP (carregamento seguro)
// ================================
let nodemailer = null;

try {
  nodemailer = require("nodemailer");
} catch (err) {
  console.warn("⚠️ Nodemailer não instalado. E-mails não serão enviados.");
}

// ================================
// LOGIN
// ================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(password, user.password);
    if (!senhaValida) {
      return res.status(401).json({ error: "Senha inválida" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        perfil: user.perfil,
        escolaId: user.escolaId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({ token });
  } catch (error) {
    console.error("❌ Erro no login:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

// ================================
// ESQUECI A SENHA
// ================================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "E-mail é obrigatório" });
    }

    const user = await User.findOne({ where: { email } });

    // 🔒 Segurança: nunca revelar se existe
    if (!user) {
      return res.json({
        message:
          "Se o e-mail existir, você receberá um link para redefinir sua senha.",
      });
    }

    // 🔐 Token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

    // Remove tokens antigos
    await PasswordResetToken.destroy({
      where: { userId: user.id },
    });

    // Cria novo token
    await PasswordResetToken.create({
      userId: user.id,
      token,
      expiresAt,
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // ================================
    // ENVIO DE E-MAIL REAL
    // ================================
    if (nodemailer) {
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: process.env.MAIL_SECURE === "true",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
        to: user.email,
        subject: "Recuperação de senha",
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h2>Recuperação de Senha</h2>
            <p>Você solicitou a redefinição de senha.</p>
            <p>Clique no botão abaixo para criar uma nova senha:</p>
            <p>
              <a href="${resetLink}"
                 style="display:inline-block;padding:10px 20px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:6px;">
                Redefinir senha
              </a>
            </p>
            <p>Este link expira em 1 hora.</p>
          </div>
        `,
      });

      console.log("📧 E-mail de recuperação enviado para:", user.email);
    } else {
      console.log("⚠️ Token gerado (modo DEV):", resetLink);
    }

    return res.json({
      message:
        "Se o e-mail existir, você receberá um link para redefinir sua senha.",
    });
  } catch (error) {
    console.error("❌ Erro ao solicitar recuperação de senha:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

// ================================
// RESETAR SENHA
// ================================
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Senha é obrigatória" });
    }

    const resetToken = await PasswordResetToken.findOne({
      where: { token },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return res.status(400).json({ error: "Token inválido ou expirado" });
    }

    const user = await User.findByPk(resetToken.userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    await resetToken.destroy();

    return res.json({ message: "Senha alterada com sucesso" });
  } catch (error) {
    console.error("❌ Erro ao redefinir senha:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};
