const {
  fetchTopics,
  fetchArticlesById,
  fetchArticles,
  fetchCommentsById,
} = require("../models/models");

const getTopics = (req, res, next) => {
  return fetchTopics()
    .then((response) => {
      res.status(200).send({ topics: response.rows });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  return fetchArticlesById(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (req, res, next) => {
  return fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles: articles.rows });
    })
    .catch((err) => {
      next(err);
    });
};

const getCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  return fetchCommentsById(article_id)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getTopics, getArticlesById, getArticles, getCommentsById };
