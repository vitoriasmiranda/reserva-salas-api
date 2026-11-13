const express = require('express');
const salasController = require('../controllers/salasController');

const router = express.Router();

router.get('/', salasController.listar);
router.get('/:id', salasController.buscarPorId);
router.post('/', salasController.criar);
router.put('/:id', salasController.atualizar);
router.delete('/:id', salasController.remover);

module.exports = router;