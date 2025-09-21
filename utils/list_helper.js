const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes;
  };
  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return 0;
  if (blogs.length === 1) return blogs[0];

  const mostLiked = Math.max(...blogs.map((b) => b.likes));
  return blogs.find((b) => b.likes === mostLiked);
};

const mostBlogs = (blogs) => {
  if (blogs.length === 1) {
    return {
      author: blogs[0].author,
      blogs: blogs.length,
    };
  }
  const counts = blogs.reduce((acc, b) => {
    acc[b.author] = (acc[b.author] || 0) + 1;
    return acc;
  }, {});

  const authorsEntries = Object.entries(counts).map(([author, blogs]) => ({
    author,
    blogs,
  }));

  const mostBlogs = Math.max(...authorsEntries.map((a) => a.blogs));
  return authorsEntries.find((b) => b.blogs === mostBlogs);
};

/**
 * func mostLikes(blogs) {
 *  result = []
 *    for each blog, get the author and likes
 *      store in result
 *  create an object that stores the author and likes
 *    loop thru result and add author and likes if doesn't exist
 *      otherwise add the like to the current author's like
 *  get the max like from author
 *  return author and like
 * }
 */

const mostLikes = (blogs) => {
  const counts = blogs.reduce((acc, b) => {
    acc[b.author] = (acc[b.author] || 0) + b.likes;
    return acc;
  }, {});

  const authorsEntries = Object.entries(counts).map(([author, likes]) => ({
    author,
    likes,
  }));

  return _.maxBy(authorsEntries, "likes");
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
