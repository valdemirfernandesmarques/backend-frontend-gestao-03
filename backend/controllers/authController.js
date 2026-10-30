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
      process.env.JWT_SECRET || "secreto_gestao_danca",
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

    // 🌐 URL do Frontend com fallback dinâmico para Netlify se FRONTEND_URL não existir
    const frontendUrl =
      process.env.FRONTEND_URL ||
      process.env.URL_FRONTEND ||
      "https://gestaoemdanca.netlify.app";

    const resetLink = `${frontendUrl.replace(/\/$/, "")}/reset-password/${token}`;

    // ================================
    // ENVIO DE E-MAIL REAL (Suporta EMAIL_* e MAIL_*)
    // ================================
    if (nodemailer) {
      const host = process.env.EMAIL_HOST || process.env.MAIL_HOST || "smtp.gmail.com";
      const port = Number(process.env.EMAIL_PORT || process.env.MAIL_PORT || 587);
      const mailUser = process.env.EMAIL_USER || process.env.MAIL_USER;
      const mailPass = process.env.EMAIL_PASS || process.env.MAIL_PASS;
      const mailFrom = mailUser || process.env.MAIL_FROM_EMAIL || "gestaoemdanca@gmail.com";

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // True para 465, False para 587/Outros
        auth: {
          user: mailUser,
          pass: mailPass,
        },
      });

      await transporter.sendMail({
        from: `"Gestão em Dança" <${mailFrom}>`,
        to: user.email,
        subject: "Recuperação de Senha - Gestão em Dança",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #ff3c78;">Recuperação de Senha</h2>
            <p style="color: #333;">Você solicitou a redefinição de sua senha de acesso ao <strong>Gestão em Dança</strong>.</p>
            <p style="color: #333;">Clique no botão abaixo para cadastrar uma nova senha:</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}"
                 style="display:inline-block;padding:12px 24px;background:#ff3c78;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">
                Redefinir minha senha
              </a>
            </p>
            <p style="color: #666; font-size: 13px;">Se você não solicitou essa alteração, basta ignorar este e-mail.</p>
            <p style="color: #666; font-size: 13px;">Este link expira em 1 hora.</p>
          </div>
        `,
      });

      console.log("📧 E-mail de recuperação enviado com sucesso para:", user.email);
    } else {
      console.log("⚠️ Nodemailer indisponível. Link gerado:", resetLink);
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