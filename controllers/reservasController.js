const reservasService = require('../services/reservasService');
const lerId = require('../utils/lerId');
const salasService = require('../services/salasService');

const FORMATO_DATA = /^\d{4}-\d{2}-\d{2}$/;
const FORMATO_HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

function dataExiste(data) {
  const convertida = new Date(`${data}T00:00:00Z`);
  return !isNaN(convertida.getTime()) && convertida.toISOString().slice(0, 10) === data;
}

function hoje() {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function validarReserva({ sala_id, responsavel, data, hora_inicio, hora_fim }) {
  if (!sala_id || !responsavel || !data || !hora_inicio || !hora_fim) {
    return 'Sala, responsável, data, hora de início e hora de fim são obrigatórios';
  }
  if (!Number.isInteger(sala_id) || sala_id <= 0) {
    return 'O sala_id deve ser um número inteiro positivo';
  }
  if (!FORMATO_DATA.test(data) || !dataExiste(data)) {
    return 'A data deve ser válida e estar no formato AAAA-MM-DD';
  }
  if (!FORMATO_HORA.test(hora_inicio) || !FORMATO_HORA.test(hora_fim)) {
    return 'Os horários devem estar no formato HH:MM';
  }
  if (hora_fim <= hora_inicio) {
    return 'A hora de fim deve ser depois da hora de início';
  }
  if (data < hoje()) {
    return 'Não é possível reservar em uma data passada';
  }
  return null;
}

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

async function criar(req, res) {
  const erroValidacao = validarReserva(req.body);
  if (erroValidacao) {
    return res.status(400).json({ erro: erroValidacao });
  }

  try {
    const sala = await salasService.buscarPorId(req.body.sala_id);
    if (!sala) {
      return res.status(404).json({ erro: 'Sala não encontrada' });
    }

    const conflito = await reservasService.buscarConflito(req.body);
    if (conflito) {
      return res.status(409).json({
        erro: `A sala já está reservada das ${conflito.hora_inicio} às ${conflito.hora_fim} nesse dia`,
        conflito,
      });
    }

    const reserva = await reservasService.criar(req.body);
    res.status(201).json(reserva);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao criar a reserva' });
  }
}

module.exports = { listar, buscarPorId, criar };