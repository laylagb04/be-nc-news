const express = require("express");
const app = express();
const { getTopics } = require("./controllers/controllers");
const { fetchTopics } = require("./models/models");

app.use(express.json());

app.get("/api/topics", getTopics);

app.use((request, response) => {
  response.status(404).send({ msg: "not found" });
});

module.exports = app;
