const jwt = require("jsonwebtoken")
const db = require("../models")
const User = db.user
const Role = db.role

const SECRET = process.env.SECRET

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"]

  if(!token) {
    return res.status(403).send({ message: "No token provided!"})
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if(err) {
      return res.status(401).send({
        message: "Unauthorized!",
      })
    }
    req.userId = decoded.id
    next()
  })
}

verifyUserExists = async (req, res, next) => {
  const user = await User.findById(req.userId) 

  if (!user) {
    return res.status(404).send({ message: "User not found" })
  }

  req.user = user
  
  next()
}

isAdmin = async (req, res, next) => {
  try {
    const user = req.user 


    const roles = await Role.find({ _id: { $in: user.roles } })

    if (!roles || roles.length === 0) {
      return res.status(403).send({ message: "User has no roles" })
    }

    const isAdmin = roles.some((role) => role.name === "admin")

    if (!isAdmin) {
      return res.status(403).send({ message: "Require Admin Role!" })
    }

    next()
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: err.message || "Internal Server Error" })
  }
}

isModerator = async (req, res, next) => {
  try {
    const user = req.user 

    const roles = await Role.find({ _id: { $in: user.roles } })

    if (!roles || roles.length === 0) {
      return res.status(403).send({ message: "User has no roles" })
    }

    const isModerator = roles.some((role) => role.name === "moderator")

    if (!isModerator) {
      return res.status(403).send({ message: "Require Moderator Role!" })
    }

    next()
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: err.message || "Internal Server Error" })
  }
}

const authJwt = {
  verifyUserExists,
  verifyToken,
  isAdmin,
  isModerator
}

module.exports = authJwt
