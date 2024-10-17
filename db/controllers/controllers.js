const { user } = require("pg/lib/defaults");
const {
  fetchTopics,
  fetchArticlesById,
  fetchArticles,
  fetchCommentsById,
  createComment,
  updateVotes,
  removeComment,
} = require("../models/models");
const { convertTimestampToDate } = require("../seeds/utils");

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

const postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (!article_id || !username || !body) {
    return res
      .status(400)
      .send({ msg: "Bad request, missing required fields" });
  }
  createComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment: comment });
    })
    .catch((err) => {
      next(err);
    });
};

const getVotes = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body;
  return updateVotes(article_id, body)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};

const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  return removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getTopics,
  getArticlesById,
  getArticles,
  getCommentsById,
  postComment,
  getVotes,
  deleteComment,
};
