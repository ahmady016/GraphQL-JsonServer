const express = require('express');
const fetch = require('node-fetch');
const graphQLRoute = require('express-graphql');
const schema = require('./graphSchema');
const env = require('./env');

const app = express();
const PORT = process.env.PORT || 2018;

app.listen(PORT, () => {
  console.log(`server running at port ${PORT}`);
});

app.use('/graphql', graphQLRoute({
  schema,
  graphiql: true
}));

app.get('/:resource', (req, res) => {
  fetch(`${env.baseURL}/${req.params.resource}`)
    .then(res => res.json())
    .then(data => res.send(data));
});