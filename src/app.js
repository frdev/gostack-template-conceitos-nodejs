const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateUuid (request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) return response.status(400).json({ error: 'ID invalido.' });

  return next();
}

app.use('/repositories/:id', validateUuid);

app.get('/repositories', (request, response) => {
  response.status(200).json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  if (!title || !url || !Array.isArray(techs))
    return response.status(400).json({ error: 'Todos os campos sao obrigatorios.' });

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(r => r.id === id);

  if (index === -1) return response.status(400).json({ error: 'Repositorio nao encontrado.' });

  const { title, url, techs } = request.body;

  const repository = repositories[index];

  repository.title = title || repository.title;
  repository.url = url || repository.url;
  repository.techs = Array.isArray(techs) && techs ? techs : repository.techs;

  return response.status(200).json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(r => r.id === id);

  if (index === -1) return response.status(400).json({ error: 'Repositorio nao encontrado.' });

  repositories.splice(index, 1);

  return response.status(204).json();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(r => r.id === id);

  if (index === -1) return response.status(400).json({ error: 'Repositorio nao encontrado.' });

  repositories[index].likes = repositories[index].likes + 1;

  return response.status(200).json(repositories[index]);
});

module.exports = app;
