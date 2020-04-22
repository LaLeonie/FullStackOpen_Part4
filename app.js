const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const blogPostsRouter = require("./controllers/blogposts");

const app = express();

logger.info(`Connecting to`, config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => logger.info(`Connected to MongoDB`))
  .catch((error) => logger.info("error connecting to MongoDB", error.message));

app.use(morgan("tiny"));
app.use(cors());
app.use(express.static("build"));
app.use(express.json());

app.use("/blogPosts", blogPostsRouter);
module.exports = app;
