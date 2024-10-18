const express = require("express");
const app = express();
const {
  getTopics,
  getArticlesById,
  getArticles,
  getCommentsById,
  postComment,
  getVotes,
  deleteComment,
  getUsers,
} = require("./db/controllers/controllers");

const endpoints = require("./endpoints.json");

app.use(express.json());

app.get("/api", (request, response) => {
  return response.status(200).send({ endpoints: endpoints });
});
app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.get("/api/articles/:article_id", getArticlesById);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", getVotes);

app.delete("/api/comments/:comment_id", deleteComment);

app.use((request, response, next) => {
  response.status(404).send({ msg: "not found" });
});
app.use((err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else next(err);
});
app.use((err, request, response, next) => {
  if (err.code === "23503") {
    response.status(404).send({ msg: "Article not found" });
  } else next(err);
});
app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Bad request" });
  } else next(err);
});
app.use((err, request, response, next) => {
  if (err.code === "23502") {
    response.status(400).send({ msg: "Bad request" });
  } else next(err);
});
app.use((err, request, response, next) => {
  response.status(500).send({ msg: "internal server error" });
});

module.exports = app;
