const db = require("../connection");

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

module.exports = { fetchTopics, fetchArticlesById };
