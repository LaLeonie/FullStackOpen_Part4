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

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return "No post found";
  const authors = blogs.map((post) => post.author);
  const collection = [];
  for (let i = 0; i < authors.length; i++) {
    const author = authors[i];
    const object = collection.filter((el) => el.author === author);
    if (object.length > 0) {
      const index = collection.indexOf(object[0]);
      collection[index].blogs++;
    } else {
      collection.push({ author, blogs: 1 });
    }
  }
  const sortedCollection = collection.sort((a, b) => b.blogs - a.blogs);
  return sortedCollection[0];
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return "No post found";
  const collection = [];
  for (let i = 0; i < blogs.length; i++) {
    const author = blogs[i].author;
    const object = collection.filter((el) => el.author === author);
    if (object.length > 0) {
      const index = collection.indexOf(object[0]);
      collection[index].likes += blogs[i].likes;
    } else {
      collection.push(blogs[i]);
    }
  }
  const sortedCollection = collection.sort((a, b) => b.likes - a.likes);
  return {
    author: sortedCollection[0].author,
    likes: sortedCollection[0].likes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
