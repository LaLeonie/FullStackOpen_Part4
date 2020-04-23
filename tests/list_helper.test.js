const { dummy, totalLikes, favoriteBlog } = require("../utils/list_helper");

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
