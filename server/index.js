const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const server = express();

server.use(bodyParser.json());

server.listen(3000, () => {
    console.log("Servidor iniciado...");
});