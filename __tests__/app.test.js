const request = require("supertest");
const app = require("../db/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const { application_name } = require("pg/lib/defaults");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end;
});

describe.only("GET /api/topics", () => {
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
