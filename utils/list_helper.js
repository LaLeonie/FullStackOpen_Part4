const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((a, b) => {
    return a + b.likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return "No post found";
  const sortedBlog = blogs.sort((a, b) => b.likes - a.likes);
  return sortedBlog[0];
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
