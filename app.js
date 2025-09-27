const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const morgan = require("morgan");
const blogRouter = require("./controllers/blogController");
const middleware = require("./utils/middleware");
const app = express();

const url = config.MONGODB_URI;
logger.info("connecting to", url);

mongoose
  .connect(url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

morgan.token("data", (req) => {
  return JSON.stringify(req.body);
});

if (process.env.NODE_ENV !== "test") {
  app.use(
    morgan(
      ":method :url :status :res[content-length] - :response-time ms :data"
    )
  );
}

app.use(express.json());
app.use("/api/blogs", blogRouter);

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;
