const { selectTopics, selectArticleById } = require("../models/topics.model");
const endPoints = require("../endpoints.json");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getAllEndPoints = (req, res, next) => {
  console.log(endPoints);
  res.status(200).send({ endPoints }).catch(next);
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;
  selectArticleById(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
