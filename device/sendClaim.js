

//Second step: sign claim -> generate JSON web token
let token = Signature.signClaim(claim)
console.log('Signed Claim - JWT:\n',token,'\n')