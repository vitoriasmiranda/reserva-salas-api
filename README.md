# API de Reserva de Salas

API em Node.js e Express para reservar salas e laboratórios de instituições de ensino, com bloqueio de horários em conflito.

## Como testar

1. Instale as dependências com `npm install`
2. Crie o banco no PostgreSQL e execute o arquivo `db/schema.sql`
3. Crie um arquivo `.env` com a variável `DATABASE_URL`
4. Rode `node --watch server.js`
5. Importe no Postman a coleção que está em `postman/reserva-salas-api.postman_collection.json`

🚧 Em desenvolvimento.