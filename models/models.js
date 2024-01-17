const db = require("../db/connection");

module.exports.selectTopics = () => {
  return db
    .query(
      `
    SELECT * FROM topics;
    `
    )
    .then(({ rows }) => {
      return rows;
    })
    
};

module.exports.selectArticleById = (article_id) => {
  return db
    .query(
      `
    SELECT * FROM articles
    WHERE article_id = $1;
    `,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article does not exist",
        });
      }
      return rows[0];
    });
};

module.exports.selectArticlesCC = () => {
  return db
  .query(`
  SELECT 
  articles.article_id,
  articles.title,
  articles.topic,
  articles.author,
  articles.created_at,
  articles.votes,
  articles.article_img_url,
  CAST (COUNT(comments.comment_id) AS INT) AS comment_count
  FROM articles
  LEFT JOIN 
  comments ON articles.article_id = comments.article_id
  Group BY articles.article_id
  ORDER BY created_at DESC;
  `
  ).then(({rows}) =>{
    return rows
  })
}

