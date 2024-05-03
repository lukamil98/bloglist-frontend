function test(description, callback) {
  console.log(`Testing: ${description}`)
  callback()
}

module.exports = test
