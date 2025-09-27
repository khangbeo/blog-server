const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blogModel");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

describe("when making a get request", () => {
  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test('all blogs have the property "id"', async () => {
    const response = await api
      .get(`/api/blogs/`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(Object.hasOwn(response.body[0], "id"), true);
  });
});

describe("when making a post request", () => {
  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "New Blog",
      author: "Anthony Duong",
      url: "https://youtube.com/",
      likes: 22,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
  });

  test("a blog without likes will have likes default to 0", async () => {
    const newBlog = {
      title: "New Blog",
      author: "Anthony Duong",
      url: "https://youtube.com/",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogAdded = await helper.blogsInDb();
    // console.log(blogAdded);
    assert.strictEqual(blogAdded.at(-1).likes, 0);
  });

  test("a blog without title or url will not be added", async () => {
    const newBlog = {
      author: "Booty Juicez",
      likes: 2,
    };

    await api.post("/api/blogs").send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });
});

describe("deletion of a blog", () => {
  test("succeeds with a status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    const titles = blogsAtEnd.map((b) => b.title);
    assert(!titles.includes(blogToDelete.title));

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
  });
});

describe("update of a blog likes", () => {
  test("succeeds with a valid id", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    };
    const result = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(result.body.likes, blogToUpdate.likes + 1);
    const blogInDb = await Blog.findById(blogToUpdate.id);
    assert.strictEqual(blogInDb.likes, blogToUpdate.likes + 1);
  });

  test("fails with status code 400 if id is invalid", async () => {
    const invalidId = "5a3d5da59070081a82a3445";
    await api.put(`/api/blogs/${invalidId}`).send({ likes: 10 }).expect(400);
  });
});

after(async () => {
  mongoose.connection.close();
});
