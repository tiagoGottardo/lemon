const request = require('supertest')
const { app } = require('../server')
require('dotenv').config()


describe("Post /api/auth/signup", () => {
  const data = {
    username: "tiagovsk",
    email: "tiagovsk@gmail.com",
    password: "123123",
    roles: [
      "king",
    ]
  }

  it("should return username is already in use", async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send(data)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({ message: "Failed! Username is already in use!" })
  })

  it("should return email is already in use", async () => {
    data.username = "tiagopg"
    const response = await request(app)
      .post("/api/auth/signup")
      .send(data)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({ message: "Failed! Email is already in use!" })
  })


  it("should return role: king does not exist.", async () => {
    data.email = "tiago@hotmail.com"
    const response = await request(app)
      .post("/api/auth/signup")
      .send(data)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({ message: `Failed! Role ${data.roles[0]} does not exist.` })
  })

  it("should return user registered.", async () => {
    data.roles[0] = "user"
    const response = await request(app)
      .post("/api/auth/signup")
      .send(data)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({ message: "User was registered successfully!" })
  })
})


describe("Post /auth/api/signin", () => {
  data = {
    username: "tiagovsk",
    email: "tiagovsk@gmail.com",
    password: "123123"
  }

  it("should return the same data and status 200.", async () => {
    const response = await request(app)
      .post("/api/auth/signin")
      .send(data)
    expect(response.statusCode).toBe(200)
    expect(response.body.username).toEqual(data.username)
  })

  it("should return 'invalid email or password.', accessToken: null and status 401.", async () => {
    data.email = "tiagovskiano@gmail.com"

    const response = await request(app)
      .post("/api/auth/signin")
      .send(data)
    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual({ accessToken: null, message: "Invalid email or password." })
  })

  it("should return 'invalid email or password.', accessToken: null and status 401.", async () => {
    data.email = "tiagovsk@gmail.com"
    data.password = "123321"

    const response = await request(app)
      .post("/api/auth/signin")
      .send(data)
    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual({ accessToken: null, message: "Invalid email or password." })
  })

})
