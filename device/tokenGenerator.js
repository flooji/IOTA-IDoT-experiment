const jwt = require('jsonwebtoken')
const fs = require('fs')

const payload =  fs.readFileSync('./claim_24ba85fd-ba3c-4cac-92a3-1d4e7ec69bcf.json')
const privateKey = fs.readFileSync('./privateKey.pem')


//sign claim -> generate JSON web token
exports.token = jwt.sign(payload, privateKey,{ algorithm: 'RS256' })

