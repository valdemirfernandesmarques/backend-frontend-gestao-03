const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

/**
 * ======================================================
 * 🔐 RECUPERAÇÃO DE SENHA (PÚBLICA)
 * ======================================================
 * - NÃO usa authMiddleware
 * - Funciona para ADMIN_ESCOLA e SUPER_ADMIN
 */

/**
 * 📩 SOLICITAR RECUPERAÇÃO DE SENHA
 * POST /api/auth/recuperar-senha
 */
router.post("/recuperar-senha", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "E-mail é obrigatório",
      });
    }

    const user = await User.findOne({ where: { email } });

    // ⚠️ Por segurança, não informamos se o e-mail existe
    if (!user) {
      return res.json({
        message:
          "Se o e-mail existir, você receberá instruções para redefinir a senha.",
      });
    }

    // 🔐 Gera token seguro
    const resetToken = crypto.randomBytes(32).toString("hex");

    // ⏰ Token expira em 1 hora
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000);

    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires,
    });

    /**
     * 🚨 PRODUÇÃO:
     * Aqui você enviaria o e-mail com o link:
     * https://seudominio.com/resetar-senha?token=XXX
     */

    return res.json({
      message:
        "Se o e-mail existir, você receberá instruções para redefinir a senha.",
      // 🔧 TEMPORÁRIO (DEV / TESTE POSTMAN)
      token: resetToken,
    });
  } catch (error) {
    console.error("Erro recuperar senha:", error);
    return res.status(500).json({
      error: "Erro ao processar recuperação de senha",
    });
  }
});

/**
 * 🔄 RESETAR SENHA
 * POST /api/auth/resetar-senha
 */
router.post("/resetar-senha", async (req, res) => {
  try {
    const { token, novaSenha } = req.body;

    if (!token || !novaSenha) {
      return res.status(400).json({
        error: "Token e nova senha são obrigatórios",
      });
    }

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
      },
    });

    if (!user) {
      return res.status(400).json({
        error: "Token inválido",
      });
    }

    if (new Date() > user.resetPasswordExpires) {
      return res.status(400).json({
        error: "Token expirado",
      });
    }

    // 🔐 Atualiza senha
    const senhaHash = await bcrypt.hash(novaSenha, 10);

    await user.update({
      password: senhaHash,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return res.json({
      message: "Senha redefinida com sucesso",
    });
  } catch (error) {
    console.error("Erro resetar senha:", error);
    return res.status(500).json({
      error: "Erro ao redefinir senha",
    });
  }
});

module.exports = router;
