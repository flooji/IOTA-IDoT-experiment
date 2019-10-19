
//generates a RSA-private-key and stores it
const NodeRSA = require('node-rsa')

const Key = new NodeRSA({b: 512})

// const publicDer = Key.exportKey('pkcs8-public-der')
// const privateDer = Key.exportKey('pkcs8-private')

// console.log(publicDer)

// public = Key.importKey(publicDer,'pkcs8')

const privateKey =Key.importKey('./privateKey','pkcs8');
console.log(privateKey)
