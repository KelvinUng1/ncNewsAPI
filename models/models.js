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
    });
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

module.exports.selectArticles = (
  topic,
  sort_by = "created_at",
  order = "desc"
) => {
  const validSortQueries = ["created_at"];

  const validOrderQueries = ["asc", "desc"];

  if (!validSortQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by query" });
  }
  if (!validOrderQueries.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  let queryStr = `
    SELECT 
      articles.article_id,
      articles.title,
      articles.topic,
      articles.author,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      CAST(COUNT(comments.comment_id) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    `;

  const queryParameters = [];
  if (topic !== undefined) {
    queryStr += " WHERE topic = $1";
    queryParameters.push(topic);
  }

  queryStr += ` 
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}
    `;

  return db
    .query(queryStr, queryParameters)
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `
  SELECT * FROM comments 
  WHERE comments.article_id = $1
  ORDER BY created_at DESC;
  `,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No comments found for article",
        });
      }
      return rows;
    });
};

module.exports.insertComment = (article_id, username, body) => {
  return db
    .query(
      `SELECT * FROM articles
  WHERE article_id =$1;
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

      return db
        .query(
          `SELECT * FROM users
    WHERE username =$1;
    `,
          [username]
        )
        .then(({ rows }) => {
          if (rows.length === 0) {
            return Promise.reject({
              status: 404,
              msg: "User does not exist",
            });
          }
          return db.query(
            `INSERT INTO comments (article_id, author, body)
    VALUES($1, $2, $3)
    RETURNING *;
    `,
            [article_id, username, body]
          );
        });
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

module.exports.updateArticleVotes = (article_id, inc_votes) => {
  if (isNaN(inc_votes)) {
    return Promise.reject({
      status:400,
      msg: "Bad request"
  })
}
  return db
    .query(
      `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING*;
    `,
      [inc_votes, article_id]
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

module.exports.removeCommentById = (comment_id) => {
  return db
    .query(
      `
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING *;
  `,
      [comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        throw {
          status: 404,
          msg: "Comment does not exist",
        };
      }
      return rows[0];
    });
};

module.exports.selectUsers = () => {
  return db
    .query(
      `
    SELECT * FROM users;
    `
    )
    .then(({ rows }) => {
      return rows;
    });
};
