const BlogPost = require("../models/blogpost");

const initialBlog = [
  {
    author: "Harry",
    title: "How to be the best in quidditch",
    url: "blablabla",
  },
  {
    author: "Hermione",
    title: "What you can learn from muggles",
    url: "hehehehe",
  },
  {
    author: "Ron",
    title: "My life as a sibling",
    url: "uiuiuiuiuiui",
  },
];

const postsInDb = async () => {
  const posts = await BlogPost.find({});
  return posts.map((p) => p.toJSON());
};

module.exports = {
  initialBlog,
  postsInDb,
};