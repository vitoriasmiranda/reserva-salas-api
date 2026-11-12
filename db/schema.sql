CREATE TABLE salas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  bloco VARCHAR(50) NOT NULL,
  capacidade INTEGER NOT NULL CHECK (capacidade > 0),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('sala', 'laboratorio')),
  criado_em TIMESTAMP DEFAULT NOW()
);

INSERT INTO salas (nome, bloco, capacidade, tipo) VALUES
  ('Sala 101', 'Bloco A', 40, 'sala'),
  ('Laboratório de Redes', 'Bloco B', 25, 'laboratorio');