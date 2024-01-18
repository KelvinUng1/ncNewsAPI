const {
  selectTopics,
  selectArticleById,
  selectArticlesCC,
  selectCommentsByArticleId,
  insertComment,
  updateArticleVotes
} = require("../models/models");

const{ checkArticleExists, checkUserExists } = require("../utils/check-exists")
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
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  
  Promise.all([checkArticleExists(article_id), checkUserExists(username)])
  .then(() => {
    return insertComment(article_id, username, body)
    }).then((comment) => {
     res.status(201).send({ comment })
  })
  .catch(next)
}

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } =req.params;
  const { inc_votes } = req.body

  if(isNaN(inc_votes)){
    return res.status(400).send({msg: "Bad request"})
  }
updateArticleVotes(article_id, inc_votes)
.then((updatedArticle) => {
  res.status(200).send({ article: updatedArticle})
})
.catch(next)
}