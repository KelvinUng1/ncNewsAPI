const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");

const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  test("GET:200 sends an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBe(3)
        response.body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });

  test("GET:400 sends an appropriate message when given an invalid path", () => {
    return request(app)
      .get("/api/topicnotatopic")
      .expect(400)
      .then((response) => { 
          
        expect(response.body.msg).toBe('Bad Request')
       
        });
      });
  });
