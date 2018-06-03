const express = require('express');
const fetch = require('node-fetch');
const graphQLRoute = require('express-graphql');
const schema = require('./graphSchema');

const app = express();
const PORT = process.env.PORT || 2018;

app.use('/graphql', graphQLRoute({
  schema,
  graphiql: true
}));

app.listen(PORT, () => {
  console.log(`server running at port ${PORT}`);
});

app.get('/:resource', (req, res) => {
  fetch(`http://localhost:3000/${req.params.resource}`)
    .then(res => res.json())
    .then(data => res.send(data));
});