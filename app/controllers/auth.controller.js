const db = require("../models")
const User = db.user
const Role = db.role

require('dotenv').config()

const SECRET = process.env.SECRET

var jwt = require("jsonwebtoken")
var bcrypt = require("bcryptjs")

exports.signup = async (req, res) => {
  try {

    const hashedPassword = bcrypt.hashSync(req.body.password, 8)

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    })

    if (req.body.roles[0]) {
      const foundRoles = await Role.find({ name: { $in: req.body.roles } }).exec()
      user.roles = foundRoles.map(role => role._id)
      await user.save()
    } else {
      const foundRoles = await Role.find({ name: "user" }).exec()

      user.roles = [foundRoles._id]
      await user.save()
    }

    res.status(200).send({ message: "User was registered successfully!" })

  } catch (err) {
    console.error("Error:", err)
    res.status(500).send({ message: err })
  }
}

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).populate("roles", "-__v")


    if (!user) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid email or password."
      })
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password)

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid email or password."
      })
    }

    const token = jwt.sign({ id: user._id }, SECRET, {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
      expiresIn: 86400, // 24 hours
    })

    const authorities = user.roles.map(role => "ROLE_" + role.name.toUpperCase())

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token
    })
  } catch (err) {
    res.status(500).send({ message: err.message || "An error occurred while signing in." })
  }
}
