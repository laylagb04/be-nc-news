const request = require("supertest");
const app = require("../db/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end;
});

describe("GET /api/topics", () => {
  it('responds with an array containing the properties "slug" and "description"', () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics).toBeInstanceOf(Array);

        response.body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
  it("responds with an error message when passed an invalid endpoint", () => {
    return request(app)
      .get("/api/topppics")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});

describe("GET /api", () => {
  test("responds with JSON object which lists all available API endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("should respond with 200 status and an object", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((response) => {
        const result = response.body.article;
        expect(typeof result).toBe("object");
        expect(result.article_id).toBe(2);
      });
  });
  test("should return 400 status code and respond with error message for a article_id which is a valid type but does not exist in our database", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article does not exist");
      });
  });
});
describe("GET /api/articles", () => {
  test("should respond with 200 status code and an article array of article objects.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeInstanceOf(Array);
        response.body.articles.forEach((article) => {
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("author");
          expect(article).not.toHaveProperty("body");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
  test("should respond with articles sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });
  test("responds with an error message when passed an invalid endpoint", () => {
    return request(app)
      .get("/api/articls")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("should respond with all comments for a specified article", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBe(2);

        comments.forEach((comment) => {
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("article_id");
          expect(comment).toHaveProperty("created_at");
        });
      });
  });
  test("should return 400 status code and respond with error message for a article_id which is a valid type but does not exist in our database", () => {
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article does not exist");
      });
  });
  test("should respond with comments sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("201: should post a new comment to the comments table with the endpoint of article_id and respond with the comment object upon completion.", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "lurker",
        body: "this is cool",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          author: "lurker",
          body: "this is cool",
          article_id: 1,
          votes: 0,
          comment_id: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("should return 400 status code and respond with 'Bad request' when body is missing ", () => {
    return request(app)
      .post("/api/articles/99999/comments")
      .send({
        username: "lurker",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, missing required fields");
      });
  });
  test("should return 400 status code and respond with 'Bad request' when username is missing ", () => {
    return request(app)
      .post("/api/articles/99999/comments")
      .send({
        body: "heyyy",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, missing required fields");
      });
  });
  test("should return 404 status code and respond with 'Article not found' when passed an article_id that doesn't exist in the database ", () => {
    return request(app)
      .post("/api/articles/99999/comments")
      .send({
        username: "lurker",
        body: "heyyy",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("should return 400 status code and respond with 'Bad request' when passed an invalid article_id  ", () => {
    return request(app)
      .post("/api/articles/cats/comments")
      .send({
        username: "lurker",
        body: "heyyy",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
