const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(process.env.PORT || 3000, function () {
  res.send("hello world");
});