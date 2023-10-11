const db = require("../models")
const User = db.user

const cleanTestDocuments = async () => {
  try {

  await User.deleteOne({ username: 'tiagopg' })
  console.log("Documents created by tests cleaned up")
  } catch(err) {
    console.error("Connection error", err)
    process.exit()
  }
}

module.exports = {
  cleanTestDocuments
}
