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
      return response.rows[0];
    });
};

const fetchArticles = () => {
  return db.query(`SELECT 
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
    ORDER BY created_at DESC;`);
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

module.exports = {
  fetchTopics,
  fetchArticlesById,
  fetchArticles,
  fetchCommentsById,
  createComment,
};
