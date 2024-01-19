const express = require("express");
const app = express();

const {
  getTopics,
  getArticleById,
  getAllEndPoints,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleVotes,
  deleteCommentById,
  getUsers,
} = require("./controllers/controller");
app.use(express.json());
app.get("/api/topics", getTopics);

app.get("/api", getAllEndPoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getUsers);

app.all("*", (req, res) => {
  res.status(400).send({ msg: "Bad request" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23503") {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.status === 404) {
    res.status(404).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
