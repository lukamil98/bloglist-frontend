const express = require("express")
const router = express.Router()
const User = require("./models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// Route to handle user registration
router.post("/api/users", async (req, res) => {
  const { username, password, name } = req.body

  // Check if username, password, and name are provided
  if (!username || !password || !name) {
    return res
      .status(400)
      .json({ error: "Username, password, and name are required" })
  }

  // Check if username and password meet length requirements
  if (username.length < 3 || password.length < 3) {
    return res.status(400).json({
      error: "Username and password must be at least 3 characters long",
    })
  }

  try {
    // Check if the username is already taken
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" })
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create a new user
    const newUser = new User({ username, passwordHash, name })
    const savedUser = await newUser.save()
    res.status(201).json({
      username: savedUser.username,
      name: savedUser.name,
      _id: savedUser._id,
    })
  } catch (error) {
    console.error("Error creating user:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Route to handle user login
router.post("/api/login", async (req, res) => {
  const { username, password } = req.body

  try {
    // Find the user by username
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" })
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
    if (!passwordCorrect) {
      return res.status(401).json({ error: "Invalid username or password" })
    }

    // If username and password are correct, generate a JWT token
    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWT_SECRET
    )

    // Send the token along with user information in the response
    res.status(200).json({
      token,
      username: user.username,
      name: user.name,
    })
  } catch (error) {
    console.error("Error logging in:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Route to get details of all users
router.get("/api/users", async (req, res) => {
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
