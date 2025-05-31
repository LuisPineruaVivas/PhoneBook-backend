const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))

const db = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(db);
})

app.get('/info', (request, response) => {
  const personCount = db.length;
  const currentTime = new Date();
  response.send(`<p>Phonebook has info for ${personCount} people</p><p>${currentTime}</p>`);
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = db.find(p => p.id === id);
  
  if (person) {
    response.json(person);
  } else {
    response.status(404).send({ error: 'Person not found' });
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const personIndex = db.findIndex(p => p.id === id);
  
  if (personIndex !== -1) {
    db.splice(personIndex, 1);
    response.status(204).end();
  } else {
    response.status(404).send({ error: 'Person not found' });
  }
})

app.post('/api/persons', (request, response) => {
  const newPerson = request.body;

  if (!newPerson.name || !newPerson.number) {
    return response.status(400).json({ error: 'Name or number is missing' });
  }

    if (db.some(p => p.name === newPerson.name)) {
    return response.status(400).json({ error: 'Name must be unique' });
  }

  newPerson.id =  Math.random().toFixed(5) * 1000000; // Generate a random ID
  db.push(newPerson);
  
  response.status(201).json(newPerson);
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})