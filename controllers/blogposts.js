const blogPostsRouter = require("express").Router();
const BlogPost = require("../models/blogpost");

blogPostsRouter.get("/", async (req, res) => {
  await BlogPost.find({}).then((posts) =>
    res.json(posts.map((post) => post.toJSON()))
  );
});

blogPostsRouter.post("/", async (req, res, next) => {
  const body = req.body;

  const post = new BlogPost({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  const savedPost = await post.save();
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
