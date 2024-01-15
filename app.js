const express = require("express");
const app = express();
const endPoints = require("./endpoints.json")

const { getTopics } = require("./controllers/topics.controller");

app.get("/api/topics", getTopics);

app.get("/api", (req, res) => {
    console.log(endPoints)
    console.log({endPoints},"<<<<")
    res.status(200).send({endPoints})
})

app.all("*", (req, res) => {
  res.status(400).send({ msg: "Bad Request" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});
module.exports = app;
