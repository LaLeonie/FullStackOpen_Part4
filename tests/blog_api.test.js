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

describe("returning of blog posts", () => {
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
});

describe("adding of blog posts", () => {
  test("post request with token successfully creates a new blog post", async () => {
    const newPost = {
      title: "How to tame a werefolf",
      author: "Hagrid",
      url: "lililililililili",
    };

    const user = {
      username: "Ronny",
      password: "secret",
    };

    const loggedInUser = await api.post("/login").send(user);
    const userToken = loggedInUser.body.token;

    await api
      .post("/blogPosts")
      .send(newPost)
      .set("Authorization", `bearer ${userToken}`)
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

    const user = {
      username: "Ronny",
      password: "secret",
    };

    const loggedInUser = await api.post("/login").send(user);
    const userToken = loggedInUser.body.token;

    await api
      .post("/blogPosts")
      .send(newPost)
      .set("Authorization", `bearer ${userToken}`)
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

    const user = {
      username: "Ronny",
      password: "secret",
    };

    const loggedInUser = await api.post("/login").send(user);
    const userToken = loggedInUser.body.token;

    await api
      .post("/blogPosts")
      .send(newPost)
      .set("Authorization", `bearer ${userToken}`)
      .expect(400);
  });

  test("backend responds with 401 Unauthorized if no token provided", async () => {
    const postsAtStart = await postsInDb();

    const newPost = {
      title: "How to tame a werefolf",
      author: "Hagrid",
      url: "lililililililili",
    };

    await api.post("/blogPosts").send(newPost).expect(401);

    const postsAtEnd = await postsInDb();
    expect(postsAtEnd).toHaveLength(postsAtStart.length);
  });
});

describe("deletion of a blog post", () => {
  test("succeeds with status code 204 if valid id", async () => {
    const postsAtStart = await postsInDb();

    const newPost = {
      author: "Hagrid",
      url: "uiuiuiuiuiuii",
      title: "How to survive in the dark forrest",
    };

    const user = {
      username: "Ronny",
      password: "secret",
    };

    const loggedInUser = await api.post("/login").send(user);
    const userToken = loggedInUser.body.token;

    await api
      .post("/blogPosts")
      .send(newPost)
      .set("Authorization", `bearer ${userToken}`);

    const newBlog = await api.get("/blogPosts");

    const postToDelete = newBlog.body[3];

    await api
      .delete(`/blogPosts/${postToDelete.id}`)
      .set("Authorization", `bearer ${userToken}`)
      .expect(204);

    const postsAtEnd = await postsInDb();

    expect(postsAtEnd).toHaveLength(postsAtStart.length);

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

    expect(postsAtEnd[0].likes).toBe(postsAtStart[0].likes + 1);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
