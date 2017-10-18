const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const {PORT, DATABASE_URL} = require('./config');

mongoose.Promise = global.Promise;
app.use(bodyParser.json());

app.get("/posts", function (req, res) {
  res.send("The app is working. Hello World.");
});

app.get("/posts/:id", function (req, res) {
  res.send(`GET request, id: ${req.params.id}`);
});

app.post("/posts", function (req, res) {
  res.send(`POST request made`);
});

app.put("/posts/:id", function (req, res) {
  res.send(`PUT request, id: ${req.params.id}`);
});

app.delete("/posts/:id", function (req, res) {
  res.send(`DELETE request, id: ${req.params.id}`);
});

app.listen(PORT, function () {
  console.log(`Your app is listening on ${PORT}`);
});