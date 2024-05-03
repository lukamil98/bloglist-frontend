const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const Blog = require("./models/blog")

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token is required" })
  }

  const token = authHeader.split(" ")[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    console.error("Error verifying token:", error)
    return res.status(401).json({ error: "Invalid token" })
  }
}

// Route handler for adding new blogs
router.post("/api/blogs", authenticateToken, async (req, res) => {
  const { title, author, url, likes } = req.body

  try {
    // Create a new blog with the user as the creator
    const newBlog = new Blog({
      title,
      author,
      url,
      likes,
      user: req.user.id, // Set the user ID as the creator of the blog
    })

    // Save the new blog to the database
    const savedBlog = await newBlog.save()

    // Return the newly created blog
    res.status(201).json(savedBlog)
  } catch (error) {
    console.error("Error creating blog:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Route to get details of all users (protected route)
router.get("/api/users", authenticateToken, async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find()
    res.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

module.exports = router
