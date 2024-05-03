const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const loginRouter = require("express").Router()
const User = require("../models/user")

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body

  try {
    // Find the user by username
    const user = await User.findOne({ username })
    if (!user) {
      return response.status(401).json({
        error: "Invalid username or password",
      })
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
    if (!passwordCorrect) {
      return response.status(401).json({
        error: "Invalid username or password",
      })
    }

    // If username and password are correct, generate a JWT token
    const userForToken = {
      username: user.username,
      id: user._id,
    }
    const token = jwt.sign(userForToken, process.env.JWT_SECRET)

    // Send the token and user information in the response
    response
      .status(200)
      .json({ token, username: user.username, name: user.name })
  } catch (error) {
    console.error("Error logging in:", error)
    response.status(500).json({ error: "Internal server error" })
  }
})

module.exports = loginRouter
