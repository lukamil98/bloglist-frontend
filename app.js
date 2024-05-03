const express = require("express")
const jwt = require("jsonwebtoken")
const bodyParser = require("body-parser") // Import body-parser middleware
const logger = require("./utils/logger")
const config = require("./utils/config")
const mongoose = require("mongoose")
const Blog = require("./models/blog")
const User = require("./models/user")
const userRoutes = require("./userRoutes")
const loginRouter = require("./controllers/login")
require("dotenv").config()

const app = express()

// Middleware for parsing JSON data
app.use(bodyParser.json())

// MongoDB connection
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Connected to MongoDB")
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB:", error)
  })

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).json({ error: "Token missing" })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" })
    }
    req.user = user
    next()
  })
}

// Define the route handler for POST /api/blogs
app.post("/api/blogs", authenticateToken, async (req, res) => {
  const { title, author, url, likes } = req.body

  try {
    // Create a new blog with the user as the creator
    const newBlog = new Blog({
      title,
      author,
      url,
      likes,
      user: req.user.id, // Use the user ID extracted from the token
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

// Define the route handler for GET /api/blogs
app.get("/api/blogs", async (req, res) => {
  try {
    // Fetch the list of blogs from the database
    const blogs = await Blog.find({}).populate("creator", "username")

    res.json(blogs)
  } catch (error) {
    logger.error("Error fetching blogs:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})
// Use the loginRouter with the specified endpoint
app.use("/api/login", loginRouter)

app.use(userRoutes)

module.exports = app
