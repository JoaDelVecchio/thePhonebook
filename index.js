const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(express.static("dist"));

const cors = require("cors");

app.use(cors());

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(
  morgan(":method :url :status :res[content-length] :response-time :body")
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const currentDate = new Date();
  const currentPersons = persons.length;
  response.send(
    `<p>Phonebook has info for ${currentPersons} people</p><p>${currentDate}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.number || !body.name) {
    return response.status(400).json({ error: "Name or number missing" });
  }

  if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({ error: "Name must be unique" });
  }

  const newPerson = {
    id: String(Math.floor(Math.random() * 10000)),
    name: body.name,
    number: body.number,
  };

  persons.push(newPerson);
  response.json(newPerson);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
