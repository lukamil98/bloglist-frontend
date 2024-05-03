const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null // Return null for empty list
  }

  // Find the blog with the most likes
  const maxLikesBlog = blogs.reduce((prev, current) =>
    prev.likes > current.likes ? prev : current
  )

  return {
    title: maxLikesBlog.title,
    author: maxLikesBlog.author,
    likes: maxLikesBlog.likes,
  }
}

module.exports = {
  favoriteBlog,
}
