const db = require("../connection");
const format = require("pg-format");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics`);
};

const fetchArticlesById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      const article = response.rows[0];

      return article;
    });
};

const fetchArticles = (sort_by = "created_at", order = "desc") => {
  const queryOrder = ["asc", "desc"];

  const queryVals = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
  ];

  if (!queryOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  if (!queryVals.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  const queryStr = `SELECT 
    articles.article_id,
    articles.title,
    articles.topic,
    articles.author,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    COUNT(comments.comment_id) AS comment_count
    FROM 
    articles 
    LEFT JOIN 
    comments
    on articles.article_id = comments.article_id
    GROUP BY articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.article_img_url
    ORDER BY ${sort_by} ${order} ;`;

  return db.query(queryStr).then((response) => {
    return response;
  });
};

const fetchCommentsById = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return response.rows;
    });
};

const createComment = (article_id, username, body) => {
  return db
    .query(
      "INSERT INTO comments (article_id, author,body) VALUES ($1, $2, $3) RETURNING *",
      [article_id, username, body]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return rows[0];
    });
};

const updateVotes = (article_id, body) => {
  return fetchArticlesById(article_id).then(() => {
    return db
      .query(
        `UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;`,
        [body.inc_votes, article_id]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  });
};

const removeComment = (comment_id) => {
  return db
    .query(
      `
    DELETE FROM comments
    WHERE comment_id = $1`,
      [comment_id]
    )
    .then((response) => {
      if (response.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      } else return response;
    });
};

const fetchUsers = () => {
  return db.query(`SELECT * FROM users`);
};

module.exports = {
  fetchTopics,
  fetchArticlesById,
  fetchArticles,
  fetchCommentsById,
  createComment,
  updateVotes,
  removeComment,
  fetchUsers,
};
