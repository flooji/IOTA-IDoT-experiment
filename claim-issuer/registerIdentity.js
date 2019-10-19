

//This script uploads a JWT of an Identity Claim up to the tangle
const jwt = require('jsonwebtoken')

const claimGenerator = require('./claimGenerator')

//key for signing
const privateKey = 'myVerySecretKey'

//change these variables
const pubKey = 2
const issuerPubKey = 2
const issuerName = "https://strassenverkehrsaemter.ch/"
const owner = "Transport GmbH"
const model = "Raspberry Pi 3B+"
const validUntil = "01/01/2025"

//generate the claim
generatedClaim = claimGenerator.generateClaim(pubKey,issuerPubKey,issuerName,owner,model,validUntil)

//sign Claim to JSON Web Token
JWT = signClaim(generatedClaim,privateKey)

//upload JWT to tangle







function signClaim(claim,secret) {

    var token = jwt.sign(claim, secret);

    console.log('JWT - signed Claim:\n',token)
    return token
}