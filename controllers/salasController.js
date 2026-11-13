const salasService = require('../services/salasService');

function validarSala({ nome, bloco, capacidade, tipo }) {
  if (!nome || !bloco || !capacidade || !tipo) {
    return 'Nome, bloco, capacidade e tipo são obrigatórios';
  }
  if (!Number.isInteger(capacidade) || capacidade <= 0) {
    return 'A capacidade deve ser um número inteiro positivo';
  }
  if (tipo !== 'sala' && tipo !== 'laboratorio') {
    return "O tipo deve ser 'sala' ou 'laboratorio'";
  }
  return null;
}

function lerId(req) {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function listar(req, res) {
  try {
    const salas = await salasService.listar();
    res.json(salas);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar as salas' });
  }
}

async function buscarPorId(req, res) {
  const id = lerId(req);
  if (!id) {
    return res.status(400).json({ erro: 'O id deve ser um número inteiro positivo' });
  }

  try {
    const sala = await salasService.buscarPorId(id);
    if (!sala) {
      return res.status(404).json({ erro: 'Sala não encontrada' });
    }
    res.json(sala);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar a sala' });
  }
}

async function criar(req, res) {
  const erroValidacao = validarSala(req.body);
  if (erroValidacao) {
    return res.status(400).json({ erro: erroValidacao });
  }

  try {
    const sala = await salasService.criar(req.body);
    res.status(201).json(sala);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao criar a sala' });
  }
}

async function atualizar(req, res) {
  const id = lerId(req);
  if (!id) {
    return res.status(400).json({ erro: 'O id deve ser um número inteiro positivo' });
  }

  const erroValidacao = validarSala(req.body);
  if (erroValidacao) {
    return res.status(400).json({ erro: erroValidacao });
  }

  try {
    const sala = await salasService.atualizar(id, req.body);
    if (!sala) {
      return res.status(404).json({ erro: 'Sala não encontrada' });
    }
    res.json(sala);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao atualizar a sala' });
  }
}

async function remover(req, res) {
  const id = lerId(req);
  if (!id) {
    return res.status(400).json({ erro: 'O id deve ser um número inteiro positivo' });
  }

  try {
    const removida = await salasService.remover(id);
    if (!removida) {
      return res.status(404).json({ erro: 'Sala não encontrada' });
    }
    res.status(204).send();
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao apagar a sala' });
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };