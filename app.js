require("dotenv").config()

const express = require("express")
const jwt = require("jsonwebtoken")
const bodyParser = require("body-parser")
const logger = require("./utils/logger")
const config = require("./utils/config")
const mongoose = require("mongoose")
const Blog = require("./models/blog")
const userRoutes = require("./controllers/userRoutes")
const loginRouter = require("./controllers/login") 
const blogsRouter = require("./controllers/blogs") 
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
    process.exit(1)
  })

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).json({ error: "Token missing" })
  }

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" })
    }
    req.user = user
    next()
  })
}

// Define the route handler for POST /api/blogs
app.post("/api/blogs", authenticateToken, async (req, res) => {
  try {
    const { title, author, url, likes } = req.body
    const userId = req.user.id // Extract the user ID from the token
    const newBlog = new Blog({
      title,
      author,
      url,
      likes,
      user: userId, // Assign the user ID as the creator of the blog
    })
    const savedBlog = await newBlog.save()
    res.status(201).json(savedBlog)
  } catch (error) {
    console.error("Error creating blog:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Use the loginRouter with the specified endpoint
app.use("/api/login", loginRouter)

// Use the userRoutes with the specified endpoint
app.use(userRoutes)

// Use the blogsRouter with the specified endpoint
app.use("/api/blogs", blogsRouter)

// Define custom error handling middleware
const errorHandler = (err, req, res, next) => {
  // Your error handling logic
}

// Register the custom error handling middleware
app.use(errorHandler)

module.exports = app
