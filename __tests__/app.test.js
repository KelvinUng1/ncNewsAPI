const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const endPoints = require("../endpoints.json");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  test("GET:200 responds with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });

  test("GET:400 responds with an appropriate message when given an invalid path", () => {
    return request(app)
      .get("/api/topicnotatopic")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("/api", () => {
  test("GET:200 provides a description of all other endpoints available", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endPoints).toEqual(endPoints);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET:200 responds with an single article object with properties by id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("author", expect.any(String));
        expect(article).toHaveProperty("title", expect.any(String));
        expect(article).toHaveProperty("article_id", 1);
        expect(article).toHaveProperty("body", expect.any(String));
        expect(article).toHaveProperty("topic", expect.any(String));
        expect(article).toHaveProperty("created_at", expect.any(String));
        expect(article).toHaveProperty("votes", 100);
        expect(article).toHaveProperty("article_img_url", expect.any(String));
      });
  });

  test("GET:404 responds with an appropriate status and message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article does not exist");
      });
  });

  test("GET:400 responds with an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("/api/articles", () => {
  test("GET:200 responds with an articles array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length > 0).toBe(true);
        body.articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article.comment_count).toEqual(expect.any(Number));
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("GET:200 responds with data sorted by date in descending order by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });

  test("GET:400 responds with an appropriate status and error message when given invalid path ", () => {
    return request(app)
      .get("/api/arti")
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe("Bad request");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET:200 responds with an array of comments belonging to a single article", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(2);
        body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("article_id", 9);
        });
      });
  });

  test("GET:200 responds with data sorted by date in descending order by default", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });
  test("GET:404 responds with an appropriate status and message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No comments found for article");
      });
  });

  test("GET:400 responds with an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-article/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("POST:201 responds with the posted comment with expected properties", () => {
    return request(app)
      .post("/api/articles/9/comments")
      .send({
        username: "butter_bridge",
        body: "test comment",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toHaveProperty("comment_id", expect.any(Number));
        expect(body.comment).toHaveProperty("article_id", 9);
        expect(body.comment).toHaveProperty("author", "butter_bridge");
        expect(body.comment).toHaveProperty("body", "test comment");
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("PATCH:200 responds with the updated article and updates the article votes by 1", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        const {article} =body
        expect(article).toHaveProperty("article_id", 1);
        expect(article).toHaveProperty("title", expect.any(String));
        expect(article).toHaveProperty("author", expect.any(String));
        expect(article).toHaveProperty("body", expect.any(String));
        expect(article).toHaveProperty("topic", expect.any(String));
        expect(article).toHaveProperty("created_at", expect.any(String));
        expect(article).toHaveProperty("votes", 101);
        expect(article).toHaveProperty("article_img_url", expect.any(String));
      });
  });

  test("PATCH:200 responds with the updated article and updates the article votes by -100", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -100 })
      .expect(200)
      .then(({ body }) => {
        const {article} =body
        expect(article).toHaveProperty("article_id", 1);
        expect(article).toHaveProperty("title", expect.any(String));
        expect(article).toHaveProperty("author", expect.any(String));
        expect(article).toHaveProperty("body", expect.any(String));
        expect(article).toHaveProperty("topic", expect.any(String));
        expect(article).toHaveProperty("created_at", expect.any(String));
        expect(article).toHaveProperty("votes", 0);
        expect(article).toHaveProperty("article_img_url", expect.any(String));
      });
  });


test("PATCH:400 responds with an appropriate status and error message for invalid inc_votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "anystring" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("PATCH:404 responds with an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .patch("/api/articles/999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article does not exist");
      });
  });
});
