require('dotenv').config();

const express = require('express');
const salasRoutes = require('./routes/salasRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/hello', (req, res) => {
  res.json({ mensagem: 'Olá! A API de reserva de salas está no ar.' });
});

app.use('/salas', salasRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});