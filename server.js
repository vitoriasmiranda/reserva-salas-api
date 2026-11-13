require('dotenv').config();

const express = require('express');
const pool = require('./db/pool');

const app = express();
app.use(express.json());
const PORT = 3000;

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

app.get('/hello', (req, res) => {
  res.json({ mensagem: 'Olá! A API de reserva de salas está no ar.' });
});

app.get('/salas', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM salas ORDER BY id');
    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar as salas' });
  }
});

app.get('/salas/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ erro: 'O id deve ser um número inteiro positivo' });
  }

  try {
    const resultado = await pool.query('SELECT * FROM salas WHERE id = $1', [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Sala não encontrada' });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar a sala' });
  }
});

app.post('/salas', async (req, res) => {
  const { nome, bloco, capacidade, tipo } = req.body;

  const erroValidacao = validarSala(req.body);
  if (erroValidacao) {
    return res.status(400).json({ erro: erroValidacao });
  }

  try {
    const resultado = await pool.query(
      'INSERT INTO salas (nome, bloco, capacidade, tipo) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, bloco, capacidade, tipo]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao criar a sala' });
  }
});

app.put('/salas/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ erro: 'O id deve ser um número inteiro positivo' });
  }

  const erroValidacao = validarSala(req.body);
  if (erroValidacao) {
    return res.status(400).json({ erro: erroValidacao });
  }

  const { nome, bloco, capacidade, tipo } = req.body;

  try {
    const resultado = await pool.query(
      'UPDATE salas SET nome = $1, bloco = $2, capacidade = $3, tipo = $4 WHERE id = $5 RETURNING *',
      [nome, bloco, capacidade, tipo, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Sala não encontrada' });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao atualizar a sala' });
  }
});

app.delete('/salas/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ erro: 'O id deve ser um número inteiro positivo' });
  }

  try {
    const resultado = await pool.query('DELETE FROM salas WHERE id = $1 RETURNING *', [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Sala não encontrada' });
    }

    res.status(204).send();
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao apagar a sala' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});