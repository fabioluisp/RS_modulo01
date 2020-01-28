const express = require("express");

const server = express();

server.use(express.json());

//Middleware global - é utilizado em todas as requisições
server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd("Request");
});

//Middleware local - utilizado em requisições epecíficas,
//colocando o midd nas rotas da requisição que se quer utilizá-lo
//como nas rotas de post e put - criacao e alteração de usuário
function checkUserIfExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: "User does not exists" });
  }

  req.user = user;

  return next();
}

const users = ["Fabio", "Sergio", "Maru", "Carlos"];

// Tipos de parâmetros de requisição:
// Query params = ?teste=1  => na url vai estar .../user?nome=Fabio
//  => get('/user', (req, res))...  => req.query.nome  =
// Route params = /users/1  => na url vai estar localhost:3000/user/123
// => get('users/:id', (req,res))... => req.params.id
// Request body = { "name" : "Fabio", " email" : "fabioluis.enf@gmail.com" }

server.get("/users", (req, res) => {
  return res.json(users);
});

server.get("/users/:index", checkUserInArray, (req, res) => {
  // const { index } = req.params;

  // return res.json(users[index]);
  return res.json(req.user);
});

server.post("/users", checkUserIfExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put("/users/:index", checkUserInArray, checkUserIfExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  // splice => percorre o vetor e remove itens, a partir do index especificado,
  // de acordo com o numero de posiçoes especificadas
  // neste exemplo, removerá 1 registro a partir da posição 'index', incluindo esta posição
  users.splice(index, 1);

  return res.send();
});
server.listen(3000);
