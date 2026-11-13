const reservasService = require('../services/reservasService');
const lerId = require('../utils/lerId');

async function listar(req, res) {
  try {
    const reservas = await reservasService.listar();
    res.json(reservas);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar as reservas' });
  }
}

async function buscarPorId(req, res) {
  const id = lerId(req);
  if (!id) {
    return res.status(400).json({ erro: 'O id deve ser um número inteiro positivo' });
  }

  try {
    const reserva = await reservasService.buscarPorId(id);
    if (!reserva) {
      return res.status(404).json({ erro: 'Reserva não encontrada' });
    }
    res.json(reserva);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar a reserva' });
  }
}

module.exports = { listar, buscarPorId };