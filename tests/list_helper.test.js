const {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
} = require("../utils/list_helper");

const listWithNoBlog = [];
const listWithOneBlog = [
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    likes: 5,
  },
];

const listWithMultipleBlogs = [
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    likes: 5,
  },
  {
    title: "Harry Potter",
    author: "Jk Rowling",
    likes: 1,
  },
  {
    title: "Animal Farm",
    author: "Orwell",
    likes: 4,
  },
];

const listWithMultipleAuthorPosts = [
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    likes: 5,
  },
  {
    title: "Harry Potter",
    author: "Jk Rowling",
    likes: 1,
  },
  {
    title: "Champer of Secrets",
    author: "Jk Rowling",
    likes: 1,
  },
  {
    title: "Animal Farm",
    author: "Orwell",
    likes: 4,
  },
  {
    title: "1984",
    author: "Orwell",
    likes: 1,
  },
  {
    title: "Other",
    author: "Orwell",
    likes: 5,
  },
];

test("dummy returns one", () => {
  const blogs = [];
  const result = dummy(blogs);
  expect(result).toBe(1);
});

describe("total likes", () => {
  test("when list has only one element equals the likes of that", () => {
    expect(totalLikes(listWithOneBlog)).toBe(5);
  });

  test("equals zero when list has no entries", () => {
    expect(totalLikes(listWithNoBlog)).toBe(0);
  });

  test("when list has multiple entries equals sum of those", () => {
    expect(totalLikes(listWithMultipleBlogs)).toBe(10);
  });
});

describe("favorite blog", () => {
  test("when list has multiple entries returns blog with most likes ", () => {
    expect(favoriteBlog(listWithMultipleBlogs)).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 5,
    });
  });

  test("when list has one entry returns that enyrt", () => {
    expect(favoriteBlog(listWithOneBlog)).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 5,
    });
  });

  test("returns string when list has no entry", () => {
    expect(favoriteBlog(listWithNoBlog)).toBe("No post found");
  });
});

describe("most blogs", () => {
  test("returns string when no blog posts are in array", () => {
    expect(mostBlogs(listWithNoBlog)).toBe("No post found");
  });

  test("returns only author object when list contains one blog post", () => {
    expect(mostBlogs(listWithOneBlog)).toEqual({
      author: "Edsger W. Dijkstra",
      blogs: 1,
    });
  });

  test("returns object of author with most posts", () => {
    expect(mostBlogs(listWithMultipleAuthorPosts)).toEqual({
      author: "Orwell",
      blogs: 3,
    });
  });
});

describe("most likes", () => {
  test("returns string when list is empty", () => {
    expect(mostLikes(listWithNoBlog)).toBe("No post found");
  });

  test("returns object with likes and author if only one element in list", () => {
    expect(mostLikes(listWithOneBlog)).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 5,
    });
  });
  test("returns object from other with most likes when multiple blog entries", () => {
    expect(mostLikes(listWithMultipleAuthorPosts)).toEqual({
      author: "Orwell",
      likes: 10,
    });
  });
});
