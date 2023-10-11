const express = require("express")
const cors = require("cors")
const app = express()
const script = require("./app/config/scriptTest")
require('dotenv').config()

const PORT = process.env.PORT
const DB_URL = process.env.NODE_ENV === "test" ? process.env.DATABASE_TEST_URL : process.env.DATABASE_URL

var corsOptions = {
  origin: `http://localhost:${PORT}`
}

app.use(cors(corsOptions))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

const db = require("./app/models")
const Role = db.role

try {
  db.mongoose
    .connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
 
    if(process.env.NODE_ENV === "test") {
      script.cleanTestDocuments()
    }

    setRoles()
} catch(err) {
  console.error("Connection error", err)
  process.exit()
}

require('./app/routes/auth.routes')(app)
require('./app/routes/user.routes')(app)

app.listen(PORT, () => {
  if(process.env.NODE_ENV !== "test") {
    console.log(`Server is running on port ${PORT}.`)
  }
})

async function setRoles() {
  try {
    const count = await Role.estimatedDocumentCount()

    if (count === 0) {
      await new Role({ name: "user" }).save()
      console.log("added 'user' to roles collection")

      await new Role({ name: "moderator" }).save()
      console.log("added 'moderator' to roles collection")

      await new Role({ name: "admin" }).save()
      console.log("added 'admin' to roles collection")
    }
  } catch (err) {
    console.error("Error:", err)
  }
}

module.exports = {
  app
}
