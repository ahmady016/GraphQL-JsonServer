const express = require('express');
const fetch = require('node-fetch');
const graphQLRoute = require('express-graphql');
const schema = require('./graphSchema');
const env = require('./env');

const app = express();
const PORT = process.env.PORT || env.PORT;

app.listen(PORT, () => {
  console.log(`server running at port ${PORT}`);
});

app.use(express.static('static'));

app.use('/graphql', graphQLRoute({
  schema,
  graphiql: true
}));

app.get('/:resource', (req, res) => {
  const resource = req.params.resource;
  if(env.resources.includes(resource)) {
    fetch(`${env.baseURL}/${resource}`)
      .then(res => res.json())
      .then(data => res.send(data));
  }
});