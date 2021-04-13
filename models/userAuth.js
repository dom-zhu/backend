const monk = require('monk')
const MONGO_CONN_STRING = process.env.URI
const sha256 = require('crypto-js/sha256')
const db = monk(MONGO_CONN_STRING)
const users = db.get('users')

// checks if the user exists
async function checkUserExists(username) {
  const result = await users.find({ username: username })
  if (result.length !== 0) return true
}

// gets the hash for the given username
async function getHash(username) {
  const result = await users.findOne({ username: username })
  const hash = result.hash

  return hash
}

async function storeAccessToken(username, accessToken) {
  users.update({ username: username }, { $set: { accessToken: accessToken } })
}

// logs the user in
async function login(user) {
  const username = user.username
  const hash = user.hash

  if (hash === await getHash(username)) {
    // generate session id
    const a = Math.floor(Math.random() * 999999999)
    const accessToken = sha256(a.toString()).toString()

    // store session id in db
    storeAccessToken(username, accessToken)

    return accessToken
    // return username
  }

  return

}

// saves the user's credentials
async function registerUser(user) {
  // console.log(user.username)
  if (await checkUserExists(user.username)) {
    console.log('user exists')
    return
  }
  users.insert(user)
  return true
}

module.exports = { registerUser, checkUserExists, getHash, login }