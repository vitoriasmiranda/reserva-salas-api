const express = require('express');
const reservasController = require('../controllers/reservasController');

const router = express.Router();

router.get('/', reservasController.listar);
router.get('/:id', reservasController.buscarPorId);
router.post('/', reservasController.criar);

module.exports = router;