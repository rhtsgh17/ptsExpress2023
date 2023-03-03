const express = require("express");
const app = express();
const routers = require("./src/routers/rotuers.js");
const log = require("./src/middleware/log.js");
require("dotenv").config;
const port = process.env.PORT || 8081;

app.use(log);
app.use(express.json());
app.use(routers);

app.listen(port, () =>
  console.log(`Server berjalan di http://localhost:${port}`)
);
