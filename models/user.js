const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
})

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash)
}

// Create the User model using the schema
const User = mongoose.model("User", userSchema)

// Export the User model
module.exports = User
