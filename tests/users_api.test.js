const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const { usersInDb } = require("./test_helper");
const User = require("../models/user");

const api = supertest(app);

describe("tests with initially one user", () => {
  // beforeEach(async () => {
  //   await User.deleteMany({});
  //   const user = new User({ username: "root", passwordHash });

  //   await user.save();
  // });
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("secret", 10);
    const initialUsers = [
      { username: "Ronny", user: "Ron", passwordHash },
      { username: "The One", user: "Harry", passwordHash },
      { username: "Hermy", user: "Hermione", passwordHash },
    ];

    const usersObject = initialUsers.map((user) => new User(user));

    const promiseArray = usersObject.map((user) => user.save());

    await Promise.all(promiseArray);
  });

  test("api gets all users in database in JSON", async () => {
    const response = await api
      .get("/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(3);
  });

  test("creation succeeds with a new username", async () => {
    const usersAtStart = await usersInDb();
    const user = {
      username: "Leonie",
      name: "LalaLand",
      passwordHash: "Monday",
    };

    await api
      .post("/users")
      .send(user)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(user.username);
  });

  test("doesn't allow another user with existing username", async () => {
    const usersAtStart = await usersInDb();
    const passwordHash = await bcrypt.hash("secret", 10);
    const user = new User({ username: "root", passwordHash });

    api
      .post("/users")
      .send(user)
      .expect(400)
      .expect(/to be unique/);

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});
