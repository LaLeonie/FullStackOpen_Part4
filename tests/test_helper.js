const BlogPost = require("../models/blogpost");
const User = require("../models/user");

const initialBlog = [
  {
    author: "Harry",
    title: "How to be the best in quidditch",
    url: "blablabla",
    likes: 0,
  },
  {
    author: "Hermione",
    title: "What you can learn from muggles",
    url: "hehehehe",
    likes: 0,
  },
  {
    author: "Ron",
    title: "My life as a sibling",
    url: "uiuiuiuiuiui",
  },
];

const initialUsers = [
  { usernam: "Ronny", user: "Ron", passwordHash: "Weasley" },
  { usernam: "The One", user: "Harry", passwordHash: "Potter" },
  { usernam: "Hermy", user: "Hermione", passwordHash: "Granger" },
];

const postsInDb = async () => {
  const posts = await BlogPost.find({});
  return posts.map((p) => p.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlog,
  initialUsers,
  postsInDb,
  usersInDb,
};
