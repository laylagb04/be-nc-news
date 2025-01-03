const request = require("supertest");
const app = require("../app");
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
  test("should respond with 200 status return a comment_count which counts all the comments with specified article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article).toHaveProperty("comment_count");
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
  test("should respond with articles sorted by a sort_by query parameter such as votes ", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSorted({ key: "votes", descending: true });
      });
  });
  test("should respond with articles sorted by a sort_by query parameter such as title ", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSorted({ key: "title", descending: true });
      });
  });
  test("should respond with articles sorted by a sort_by query parameter such as votes and an order parameter for ascending or descending ", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSorted({ key: "votes", descending: false });
      });
  });
  test('should respond with 400 "Bad request" when provided a sort_by column that doesn\'t exist', () => {
    return request(app)
      .get("/api/articles?sort_by=cats")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test('should respond with 400 "Bad request" when provided an invalid order ', () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=cats")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("should respond with articles sorted by a topic query paramter  ", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("should respond with 404 status code when topic is provided which does not exist as a value in the database  ", () => {
    return request(app)
      .get("/api/articles?topic=twitter")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article with this topic not found");
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
describe("PATCH /api/articles/:article_id", () => {
  test("200 should respond with updated number of votes and all other properties", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: 1,
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).toBe(101);
        expect(body).toHaveProperty("article_id");
        expect(body).toHaveProperty("title");
        expect(body).toHaveProperty("topic");
        expect(body).toHaveProperty("author");
        expect(body).toHaveProperty("body");
        expect(body).toHaveProperty("created_at");
        expect(body).toHaveProperty("votes");
        expect(body).toHaveProperty("article_img_url");
      });
  });
  test("400 should respond with 'Bad request' when body is missing", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400 should respond with 'Bad request' when body is present but an invalid field", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ crisps: "hula hoops" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
describe("DELETE api/comments/:comment_id", () => {
  test("should respond with 204 status code and delete specified comment from data", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then((response) => {
        expect(response.status).toBe(204);
      });
  });
  test("should respond with 404 status code when passed a comment_id not present in the database", () => {
    return request(app)
      .delete("/api/comments/999999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Comment not found");
      });
  });
  test("should respond with 400 status code when passed an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/hello")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});
describe("GET /api/users", () => {
  test("should respond with 200 status code and an array of user objects with properties: username, name, avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users).toBeInstanceOf(Array);

        response.body.users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
  test("should respond with 404 status code when passed an invalid endpoint", () => {
    return request(app)
      .get("/api/user")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});
