const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (req, res) => {
  const allUsers = await User.find({}).populate("posts", {
    title: 1,
    author: 1,
    url: 1,
  });
  res.json(allUsers.map((user) => user.toJSON()));
});

usersRouter.post("/", async (req, res) => {
  const body = req.body;
  const passwordArr = body.passwordHash.split("");
  if (passwordArr.length < 3) {
    return res.status(400).json({ error: "password not long enough" });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.passwordHash, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();
  res.json(await savedUser.toJSON());
});

module.exports = usersRouter;
