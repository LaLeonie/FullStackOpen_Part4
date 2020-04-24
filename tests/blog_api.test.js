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

test("post request to the /api/blogs url successfully creates a new blog post", async () => {
  const newPost = {
    title: "How to tame a werefolf",
    author: "Hagrid",
    url: "lililililililili",
  };

  await api
    .post("/blogPosts")
    .send(newPost)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const postsAtTheEnd = await postsInDb();
  expect(postsAtTheEnd).toHaveLength(initialBlog.length + 1);

  const titles = postsAtTheEnd.map((post) => post.title);
  expect(titles).toContain("How to tame a werefolf");
});

test("if likes missing from request, it will default to 0", async () => {
  const newPost = {
    title: "How to tame a werefolf",
    author: "Hagrid",
    url: "lililililililili",
  };

  await api
    .post("/blogPosts")
    .send(newPost)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const postsAtTheEnd = await postsInDb();
  const lastPost = postsAtTheEnd[postsAtTheEnd.length - 1];
  expect(lastPost.likes).toBe(0);
});

afterAll(() => {
  mongoose.connection.close();
});
