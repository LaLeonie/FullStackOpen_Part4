const mongoose = require("mongoose");
const supertest = require("supertest");
const BlogPost = require("../models/blogpost");
const app = require("../app");
const { initialBlog, postsInDb } = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await BlogPost.deleteMany({});

  const postsObject = initialBlog.map((p) => new BlogPost(p));
  const promiseArray = postsObject.map((post) => post.save());
  await Promise.all(promiseArray);
});

test("api returns blog posts in JSON", async () => {
  await api
    .get("/blogPosts")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("api retunrs correct amount of blog posts", async () => {
  const response = await api.get("/blogPosts");
  expect(response.body).toHaveLength(initialBlog.length);
});

test("unique identifier property of blog posts is named id", async () => {
  const response = await api.get("/blogPosts");
  console.log(response.body[0]);
  expect(response.body[0].id).toBeDefined();
});

afterAll(() => {
  mongoose.connection.close();
});
