const pool = require('../db/pool');

async function listar() {
  const resultado = await pool.query('SELECT * FROM salas ORDER BY id');
  return resultado.rows;
}

async function buscarPorId(id) {
  const resultado = await pool.query('SELECT * FROM salas WHERE id = $1', [id]);
  return resultado.rows[0] || null;
}

async function criar({ nome, bloco, capacidade, tipo }) {
  const resultado = await pool.query(
    'INSERT INTO salas (nome, bloco, capacidade, tipo) VALUES ($1, $2, $3, $4) RETURNING *',
    [nome, bloco, capacidade, tipo]
  );
  return resultado.rows[0];
}

async function atualizar(id, { nome, bloco, capacidade, tipo }) {
  const resultado = await pool.query(
    'UPDATE salas SET nome = $1, bloco = $2, capacidade = $3, tipo = $4 WHERE id = $5 RETURNING *',
    [nome, bloco, capacidade, tipo, id]
  );
  return resultado.rows[0] || null;
}

async function remover(id) {
  const resultado = await pool.query('DELETE FROM salas WHERE id = $1 RETURNING *', [id]);
  return resultado.rows.length > 0;
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };