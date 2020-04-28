const blogPostsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const BlogPost = require("../models/blogpost");
const User = require("../models/user");

blogPostsRouter.get("/", async (req, res) => {
  const posts = await BlogPost.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  res.json(posts.map((post) => post.toJSON()));
});

blogPostsRouter.post("/", async (req, res, next) => {
  const body = req.body;
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ error: "token missing or invalid" });
  }
  const user = await User.findById(decodedToken.id);

  const post = new BlogPost({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  const savedPost = await post.save();

  user.posts = user.posts.concat(savedPost._id);
  await user.save();
  res.json(await savedPost.toJSON());
});

blogPostsRouter.put("/:id", async (req, res, next) => {
  const body = req.body;

  const post = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedPost = await BlogPost.findByIdAndUpdate(req.params.id, post, {
    new: true,
  });
  res.json(updatedPost.toJSON());
});

blogPostsRouter.delete("/:id", async (req, res, next) => {
  await BlogPost.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

blogPostsRouter.get("/:id", async (req, res, next) => {
  const post = await BlogPost.findById(req.params.id);
  if (post) {
    res.json(post.toJSON());
  } else {
    res.status(404).end();
  }
});

module.exports = blogPostsRouter;
