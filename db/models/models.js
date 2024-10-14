const db = require("../connection");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics`);
};

module.exports = { fetchTopics };
