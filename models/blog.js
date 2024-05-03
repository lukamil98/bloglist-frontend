const mongoose = require("mongoose")

// Define the schema for the Blog model
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
  },
})

// Create the Blog model using the schema
const Blog = mongoose.model("Blog", blogSchema)

// Export the Blog model
module.exports = Blog
