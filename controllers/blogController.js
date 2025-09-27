const router = require("express").Router();
const Blog = require("../models/blogModel");

router.get("/", async (req, res, next) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

router.post("/", async (req, res, next) => {
  const blog = new Blog(req.body);

  const savedBlog = await blog.save();
  res.status(201).json(savedBlog);
});

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  await Blog.findByIdAndDelete(id);
  res.status(204).json({ message: "Deleted blog" });
});

router.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        $set: { likes: body.likes },
      },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).end();
    }
    res.json(updatedBlog);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
