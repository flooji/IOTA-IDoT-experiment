
//sign the claim and convert it to a JSON-web token
const jwt = require('jsonwebtoken')
const fs = require('fs')

exports.signClaim = (payload) => {
    const privateKey = fs.readFileSync('./privateKey.pem')

    let token = jwt.sign(payload, privateKey,{ algorithm: 'RS256' })
    return token
}

exports.verifySignature = jsonWebToken =>  {

    //load RSA256 public Key
    const publicKey = fs.readFileSync('./publicKey.pem')

    //verify token
    jwt.verify(jsonWebToken, publicKey, { algorithms: ['RS256'] }, function(error, decoded) {
        if(error) {
            // err = {
            //     name: 'JsonWebTokenError',
            //     message: 'jwt malformed'
            //   }
            return `Unvalid signature.\nError name: ${error.name}\nError message: ${error.message}`

        } else {
            return `The signature is valid.\nDecoded claim: ${decoded}`
        }
      })
    }

