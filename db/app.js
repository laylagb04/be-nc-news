const express = require("express");
const app = express();
const { getTopics } = require("./controllers/controllers");
const { fetchTopics } = require("./models/models");
const endpoints = require("../endpoints.json");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", (request, response) => {
  return response.status(200).send({ endpoints: endpoints });
});

app.use((request, response) => {
  response.status(404).send({ msg: "not found" });
});

module.exports = app;
