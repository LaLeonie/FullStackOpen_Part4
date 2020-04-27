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

test("backend responds with 400 if title and url are missing", async () => {
  const newPost = {
    author: "Hagrid",
  };

  await api.post("/blogPosts").send(newPost).expect(400);
});

describe("deletion of a blog post", () => {
  test("succeeds with status code 204 if valid id", async () => {
    const postsAtStart = await postsInDb();
    const postToDelete = postsAtStart[0];

    await api.delete(`/blogPosts/${postToDelete.id}`).expect(204);

    const postsAtEnd = await postsInDb();

    expect(postsAtEnd).toHaveLength(postsAtStart.length - 1);

    const authors = postsAtEnd.map((p) => p.author);
    expect(authors).not.toContain(postToDelete.author);
  });
});

describe("updating of a blog post", () => {
  test("succeeds when number of likes are updated", async () => {
    const postsAtStart = await postsInDb();
    const postToUpdate = postsAtStart[0];

    const updatedPost = {
      ...postToUpdate,
      likes: postToUpdate.likes + 1,
    };

    await api
      .put(`/blogPosts/${postToUpdate.id}`)
      .send(updatedPost)
      .expect(200);

    const postsAtEnd = await postsInDb();
    console.log(postsAtEnd[0]);

    expect(postsAtEnd[0].likes).toBe(postsAtStart[0].likes + 1);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
