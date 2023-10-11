const db = require("../models")
const ROLES = db.ROLES
const User = db.user

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const userByUsername = await User.findOne({ username: req.body.username }).exec()
    if (userByUsername) {
      return res.status(400).send({ message: "Failed! Username is already in use!" })
    }

    const userByEmail = await User.findOne({ email: req.body.email }).exec()
    if (userByEmail) {
      return res.status(400).send({ message: "Failed! Email is already in use!" })
    }

    next()
  } catch (err) {
    console.error("Error:", err)
    res.status(500).send({ message: err })
  }
}

const checkRolesExisted = (req, res, next) => {
  if(req.body.roles) {
    for(let i = 0; i < req.body.roles.length; i++) {
      if(!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist.`
        })
      return
      }
    }
  }
  
  next()
}

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
}

module.exports = verifySignUp
