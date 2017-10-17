const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.listen(process.env.PORT || 3000, function () {
  console.log(`Your app is listening on ${process.env.PORT || 3000}`);
});