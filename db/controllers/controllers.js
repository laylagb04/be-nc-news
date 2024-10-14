const { fetchTopics, fetchArticlesById } = require("../models/models");

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

module.exports = { getTopics, getArticlesById };
