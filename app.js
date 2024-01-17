const express = require("express");
const app = express();

const {
  getTopics,
  getArticleById,
  getAllEndPoints,
  getArticles,
  getCommentsByArticleId,
} = require("./controllers/controller");
app.use(express.json());
app.get("/api/topics", getTopics);

app.get("/api", getAllEndPoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.all("*", (req, res) => {
  res.status(400).send({ msg: "Bad request" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.status === 404) {
    res.status(404).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});
module.exports = app;
