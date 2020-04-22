const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

module.exports = app;

app.use(morgan("tiny"));
app.use(cors());
app.use(express.static("build"));
app.use(express.json());

module.exports = app;
