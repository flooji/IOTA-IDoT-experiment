const jwt = require('jsonwebtoken')
const fs = require('fs')

const payload = fs.readFileSync('./claim_24ba85fd-ba3c-4cac-92a3-1d4e7ec69bcf.json')
const privateKey = fs.readFileSync('./privateKey.pem')

//First step: sign claim -> generate JSON web token
let token = jwt.sign(payload, privateKey,{ algorithm: 'RS256' })

console.log('Signed Claim - JWT:\n',token,'\n')

//Second step: store it to claim verifier - You could as well send it over internet
fs.writeFile(`../claim-verifier/token.txt`, token, function (err) {
    if (err) throw err
    console.log(`Token sent successfully`)
})