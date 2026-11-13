const pool = require('../db/pool');

const SELECT_RESERVAS = `
  SELECT
    r.id,
    r.sala_id,
    s.nome AS sala_nome,
    r.responsavel,
    TO_CHAR(r.data, 'YYYY-MM-DD') AS data,
    TO_CHAR(r.hora_inicio, 'HH24:MI') AS hora_inicio,
    TO_CHAR(r.hora_fim, 'HH24:MI') AS hora_fim,
    r.motivo,
    r.criado_em
  FROM reservas r
  JOIN salas s ON s.id = r.sala_id
`;

async function listar() {
  const resultado = await pool.query(`${SELECT_RESERVAS} ORDER BY r.data, r.hora_inicio`);
  return resultado.rows;
}

async function buscarPorId(id) {
  const resultado = await pool.query(`${SELECT_RESERVAS} WHERE r.id = $1`, [id]);
  return resultado.rows[0] || null;
}

module.exports = { listar, buscarPorId };