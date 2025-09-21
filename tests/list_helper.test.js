const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

test("dummy returns one", () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  test("of empty list is zero", () => {
    const blogs = [];

    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 0);
  });

  test("when list has only one blog equals the likes of that", () => {
    const listWithOneBlog = [
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
        likes: 5,
        __v: 0,
      },
    ];
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 36);
  });

  describe("favorite blog with most likes", () => {
    test("returns 0 if the list is empty", () => {
      const blogWithNoItems = [];
      const result = listHelper.favoriteBlog(blogWithNoItems);
      assert.strictEqual(result, 0);
    });

    test("returns the only blog if the list has one blog", () => {
      const blogWithOneItem = [
        {
          _id: "5a422aa71b54a676234d17f8",
          title: "Go To Statement Considered Harmful",
          author: "Edsger W. Dijkstra",
          url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
          likes: 5,
          __v: 0,
        },
      ];

      const result = listHelper.favoriteBlog(blogWithOneItem);
      assert.deepEqual(result, blogWithOneItem[0]);
    });

    test("return one of the blogs with the highest likes when multiple blogs are tied", () => {
      const result = listHelper.favoriteBlog(blogs);
      const validResult = {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0,
      };
      assert.deepEqual(result, validResult);
    });
  });

  describe("author with the most blogs", () => {
    test("returns one author if list only has one blog", () => {
      const blogWithOneItem = [
        {
          _id: "5a422a851b54a676234d17f7",
          title: "React patterns",
          author: "Michael Chan",
          url: "https://reactpatterns.com/",
          likes: 7,
          __v: 0,
        },
      ];
      const result = listHelper.mostBlogs(blogWithOneItem);
      const validResult = {
        author: blogWithOneItem[0].author,
        blogs: blogWithOneItem.length,
      };
      assert.deepEqual(result, validResult);
    });
    test("returns the author with most amount of blogs", () => {
      const result = listHelper.mostBlogs(blogs);
      const validResult = {
        author: "Robert C. Martin",
        blogs: 3,
      };
      assert.deepEqual(result, validResult);
    });
  });

  describe("author with the most likes", () => {
    test("returns the author with the most likes", () => {
      const result = listHelper.mostLikes(blogs);
      const validResult = {
        author: "Edsger W. Dijkstra",
        likes: 17,
      };
      assert.deepEqual(result, validResult);
    });
  });
});
