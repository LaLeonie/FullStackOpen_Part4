const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

test("api returns blog posts in JSON", async () => {
  await api
    .get("/blogPosts")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

afterAll(() => {
  mongoose.connection.close();
});
