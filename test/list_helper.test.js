const assert = require("assert")
const listHelper = require("../utils/list_helper")

// Test favoriteBlog function
console.log("Testing favoriteBlog function:")

// Test case: favorite blog of an empty list should be null
const emptyListResult = listHelper.favoriteBlog([])
assert.strictEqual(emptyListResult, null)
console.log("Test passed: Favorite blog of empty list is null")

// Test case: favorite blog when list has only one blog should return that blog
const listWithOneBlog = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 5,
    __v: 0,
  },
]
const oneBlogListResult = listHelper.favoriteBlog(listWithOneBlog)
assert.deepStrictEqual(oneBlogListResult, {
  title: "Go To Statement Considered Harmful",
  author: "Edsger W. Dijkstra",
  likes: 5,
})
console.log("Test passed: Favorite blog of list with one blog is correct")

// Test case: favorite blog of multiple blogs should return the one with the most likes
const multipleBlogsList = [
  {
    _id: "1",
    title: "Blog 1",
    author: "Author 1",
    likes: 10,
  },
  {
    _id: "2",
    title: "Blog 2",
    author: "Author 2",
    likes: 5,
  },
  {
    _id: "3",
    title: "Blog 3",
    author: "Author 3",
    likes: 8,
  },
]
const multipleBlogsResult = listHelper.favoriteBlog(multipleBlogsList)
assert.deepStrictEqual(multipleBlogsResult, {
  title: "Blog 1",
  author: "Author 1",
  likes: 10,
})
console.log("Test passed: Favorite blog of list with multiple blogs is correct")

// End of test cases
