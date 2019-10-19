
//sign the claim and convert it to a JSON-web token
const jwt = require('jsonwebtoken')
const secret = 'myVerySecretKey'

exports.signClaim(claim) = function() {
    var token = jwt.sign(claim, secret);
}

