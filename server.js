require('dotenv').config();

const express = require('express');
const pool = require('./db/pool');

const app = express();
const PORT = 3000;

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

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});