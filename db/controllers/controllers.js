const { fetchTopics } = require("../models/models");

const getTopics = (req, res) => {
  return fetchTopics()
    .then((response) => {
      res.status(200).send({ topics: response.rows });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getTopics };
