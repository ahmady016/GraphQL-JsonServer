const express = require('express');
const app = express();
const PORT = process.env.PORT || 2018

app.listen(PORT, () => {
  console.log(`server running at port ${PORT}`);
});