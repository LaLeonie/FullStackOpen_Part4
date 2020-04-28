const logger = require("./logger");

const unknownEndpoint = (req, res) => {
  res.status(400).send({ error: "unknown endpoint" });
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    req.token = authorization.substring(7);
  } else {
    req.token = null;
  }
  next();
};

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).send({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "invalid token" });
  }
  next(error);
};

module.exports = { unknownEndpoint, errorHandler, tokenExtractor };
