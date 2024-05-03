const supertest = require("supertest")
const app = require("../app")
const request = supertest(app)
const User = require("../models/user")
const assert = require("assert")

// Custom test runner function
function test(description, callback) {
  console.log(`Testing: ${description}`)
  callback()
}

// Test to verify user creation with missing username
async function testMissingUsername() {
  const response = await request
    .post("/api/users")
    .send({ password: "password", name: "John" })
  assert.strictEqual(response.status, 400)
  assert.strictEqual(
    response.body.error,
    "Username, password, and name are required"
  )
  console.log(
    "Test passed: Responded with status code 400 for missing username"
  )
}

// Test to verify user creation with missing password
async function testMissingPassword() {
  const response = await request
    .post("/api/users")
    .send({ username: "john", name: "John" })
  assert.strictEqual(response.status, 400)
  assert.strictEqual(
    response.body.error,
    "Username, password, and name are required"
  )
  console.log(
    "Test passed: Responded with status code 400 for missing password"
  )
}

// Test to verify user creation with missing name
async function testMissingName() {
  const response = await request
    .post("/api/users")
    .send({ username: "john", password: "password" })
  assert.strictEqual(response.status, 400)
  assert.strictEqual(
    response.body.error,
    "Username, password, and name are required"
  )
  console.log("Test passed: Responded with status code 400 for missing name")
}

// Test user creation with valid data
async function testValidUserCreation() {
  const response = await request
    .post("/api/users")
    .send({ username: "testuser", password: "password", name: "Test User" })
  assert.strictEqual(response.status, 201)
  assert.strictEqual(response.body.username, "testuser")
  console.log("Test passed: User created successfully with valid data")
}

// Add more tests for other scenarios...

// Run the tests
test("User creation with missing username", testMissingUsername)
test("User creation with missing password", testMissingPassword)
test("User creation with missing name", testMissingName)
test("User creation with valid data", testValidUserCreation)
