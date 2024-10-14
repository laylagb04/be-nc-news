const express = require("express");
const app = express();
const { getTopics, getArticlesById } = require("./controllers/controllers");
const { fetchTopics } = require("./models/models");
const endpoints = require("../endpoints.json");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", (request, response) => {
  return response.status(200).send({ endpoints: endpoints });
});

app.get("/api/articles/:article_id", getArticlesById);

app.use((request, response, next) => {
  response.status(404).send({ msg: "not found" });
});
app.use((err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, request, response, next) => {
  response.status(500).send({ msg: "internal server error" });
});

// Err

module.exports = app;
