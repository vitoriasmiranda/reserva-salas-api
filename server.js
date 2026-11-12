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

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});