const request = require('supertest')
const { app } = require('../server')
const jwt = require("jsonwebtoken")
require('dotenv').config()

describe("Get /api/test/all", () => {
  it("should return public content, status 200.", async () => {
    await request(app)
    .get("/api/test/all")
    .expect('Content-Type', "text/html; charset=utf-8")
    .expect(200)
    .expect("Public Content.")
  })
})

describe("Get /api/test/user", () => {
  it("should return no token provided, status 403.", async () => {
    const response = await request(app)
    .get("/api/test/user")
    expect(response.statusCode).toBe(403)
    expect(response.body).toEqual({ message: "No token provided!" })
  })

  it("should return token unauthorized, status 401.", async () => {
    const response = await request(app)
    .get("/api/test/user")
    .set('x-access-token', '3141592653589793238462643383279502')
    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual({ message: "Unauthorized!" })
  })
 
  it("should return user not found, status 404.", async () => {
    const token = jwt.sign({ id: "6527519717979ccc42ec6a1c" }, process.env.SECRET, {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
      expiresIn: 86400, // 24 hours
    })
    const response = await request(app)
    .get("/api/test/user")
    .set('x-access-token', token)
    expect(response.statusCode).toBe(404)
    expect(response.body).toEqual({ message: "User not found" })
  })

  it("should return user content, status 200.", async () => {
    token = jwt.sign({ id: "6525ec5ea937ea3b1f3bd18c" }, process.env.SECRET, {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
      expiresIn: 86400, // 24 hours
    })
    const response = await request(app)
    .get("/api/test/user")
    .set('x-access-token', token)
    expect(response.statusCode).toBe(200)
    expect("User Content.")
  }) 

})

describe("Get /api/test/mod", () => {
  it("should return user not found, status 404.", async () => {
    token = jwt.sign({ id: "6527519717979ccc42ec6a1c" }, process.env.SECRET, {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
      expiresIn: 86400, // 24 hours
    })
    const response = await request(app)
    .get("/api/test/user")
    .set('x-access-token', token)
    expect(response.statusCode).toBe(404)
    expect(response.body).toEqual({ message: "User not found" })
  })

})
