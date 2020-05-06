const router = require("express").Router();
const Blogpost = require("../models/blogpost");
const User = require("../models/user");

router.post("/reset", async (req, res) => {
  await Blogpost.deleteMany({});
  await User.deleteMany({});

  res.status(204).end();
});

module.exports = router;
