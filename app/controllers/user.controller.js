exports.allAccess = (req, res) => {
  res.status(200).send({ message: "Access granted" })
}

exports.userBoard = (req, res) => {
  res.status(200).send({ message: "Access granted to user" })
}

exports.adminBoard = (req, res) => {
  res.status(200).send({ message: "Access granted to admin" })
}

exports.moderatorBoard = (req, res) => {
  res.status(200).send({ message: "Access granted to mod" })
}
