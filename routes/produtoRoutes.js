// backend/routes/produtoRoutes.js
const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const { verificarToken } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração do Multer para salvar na pasta CORRETA
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), 'uploads', 'produtos');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Rotas
router.post('/', verificarToken, upload.single('foto'), produtoController.criar);
router.get('/', verificarToken, produtoController.listar);
router.get('/:id', verificarToken, produtoController.obter);
router.put('/:id', verificarToken, produtoController.atualizar);
router.delete('/:id', verificarToken, produtoController.remover);
router.post('/:id/upload', verificarToken, upload.single('foto'), produtoController.uploadImagem);

module.exports = router;