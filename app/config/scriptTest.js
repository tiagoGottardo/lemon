var bcrypt = require("bcryptjs")
const db = require("../models")
const User = db.user
const Role = db.role

const setUsersTestCase = async () => {
  try {
    const count = await User.estimatedDocumentCount()
    if (count < 4) {
      const hashedPassword = bcrypt.hashSync('123123', 8)
      
      await new User({
        username: 'tiagovsk',
        email: 'tiagovsk@gmail.com',
        password: hashedPassword,
        roles: [],
      }).save()
      console.log("added 'tiagovsk' to users collection")

      var roles = await Role.find({ name: { $in: ["user"] } }).exec()
      await new User({
        username: 'userRole',
        email: 'userRole@gmail.com',
        password: hashedPassword,
        roles: roles,
      }).save()
      console.log("added 'userRole' to users collection")

      roles = await Role.find({ name: { $in: ["user", "admin"] } }).exec()
      await new User({
        username: 'userAdminRole',
        email: 'userAdminRole@gmail.com',
        password: hashedPassword,
        roles: roles,
      }).save()
      console.log("added 'userAdminRole' to users collection")
    
      roles = await Role.find({ name: { $in: ["user", "moderator"] } }).exec()
      await new User({
        username: 'userModRole',
        email: 'userModRole@gmail.com',
        password: hashedPassword,
        roles: roles,
      }).save()
      console.log("added 'userModRole' to users collection")
    }
  } catch (err) {
    console.error("Error:", err)
    process.exit()
  }
}

const cleanTestDocuments = async () => {
  try {

  await User.deleteOne({ username: 'tiagopg' })
  // console.log("Documents created by tests cleaned up")
  } catch(err) {
    console.error("Connection error", err)
    process.exit()
  }
}

module.exports = {
  cleanTestDocuments,
  setUsersTestCase
}
