const blogPostsRouter = require("express").Router();
const BlogPost = require("../models/blogpost");

blogPostsRouter.get("/", (req, res) => {
  BlogPost.find({}).then((posts) =>
    res.json(posts.map((post) => post.toJSON()))
  );
});

blogPostsRouter.post("/", (req, res, next) => {
  const body = req.body;
  console.log(body);

  const post = new BlogPost({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  post
    .save()
    .then((savedPost) => savedPost.toJSON())
    .then((savedAndFormattedPost) => res.json(savedAndFormattedPost))
    .catch((error) => next(error));
});

blogPostsRouter.put("/:id", (req, res, next) => {
  const body = req.body;

  const post = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  BlogPost.findByIdAndUpdate(req.params.id, post, {
    new: true,
  })
    .then((updatedPerson) => res.json(updatedPerson.toJSON()))
    .catch((error) => next(error));
});

blogPostsRouter.delete("/:id", (req, res, next) => {
  BlogPost.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

blogPostsRouter.get("/:id", (req, res, next) => {
  BlogPost.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.json(post.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = blogPostsRouter;
