
const jwt = require('jsonwebtoken')

//verify a JSON web token with public Key provided
exports.verifyJWT = (jsonWebToken, publicKey) =>  {

    //verify token
    jwt.verify(jsonWebToken, publicKey, { algorithms: ['RS256'] }, function(error, decoded) {
        if(error) {
            // err = {
            //     name: 'JsonWebTokenError',
            //     message: 'jwt malformed'
            //   }
            console.log(`Invalid signature.\nError name: ${error.name}\nError message: ${error.message}`)
        } else {
            console.log(`The signature is valid.\nDecoded claim: ${decoded}`)
            return decoded
        }
      })
    }
