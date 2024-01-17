const { selectTopics, selectArticleById, selectArticlesCC  } = require("../models/models");
const endPoints = require("../endpoints.json");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getAllEndPoints = (req, res) => {
  res.status(200).send({ endPoints });
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;
  selectArticleById(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  
  selectArticlesCC()
  .then((articles) => {
    res.status(200).send({ articles });
  }).catch(next);
}


