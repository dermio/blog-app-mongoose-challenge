const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const {PORT, DATABASE_URL} = require('./config');

mongoose.Promise = global.Promise;
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.send("The app is working. Hello World.");
});

app.get("/:id", function (req, res) {
  res.send(`GET request, id: ${req.params.id}`);
});

app.listen(PORT, function (req, res) {
  console.log(`Your app is listening on ${PORT}`);
});