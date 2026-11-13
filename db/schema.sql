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

CREATE TABLE reservas (
  id SERIAL PRIMARY KEY,
  sala_id INTEGER NOT NULL REFERENCES salas(id) ON DELETE CASCADE,
  responsavel VARCHAR(100) NOT NULL,
  data DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  motivo VARCHAR(200),
  criado_em TIMESTAMP DEFAULT NOW(),
  CHECK (hora_fim > hora_inicio)
);

INSERT INTO reservas (sala_id, responsavel, data, hora_inicio, hora_fim, motivo) VALUES
  (1, 'Prof. Ana', '2026-11-20', '08:00', '10:00', 'Aula de Cálculo'),
  (1, 'Prof. Bruno', '2026-11-20', '10:00', '12:00', 'Aula de Física'),
  (2, 'Prof. Carla', '2026-11-20', '14:00', '16:00', 'Prática de Redes');

