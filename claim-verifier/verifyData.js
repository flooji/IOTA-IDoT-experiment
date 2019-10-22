const Mam = require('@iota/mam')
const { trytesToAscii } = require('@iota/converter')
const CryptoJS = require('crypto-js')
const fs = require('fs')

const Signature = require('../signature')

const mode = 'public'
const provider = 'https://nodes.devnet.iota.org'

const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&root=`

// Initialise MAM State
let mamState = Mam.init(provider)

//Get token from raspberry pi
let token = fs.readFileSync('token.txt').toString('utf8')

//Load RSA256 public Key
const publicKey = fs.readFileSync('publicKey.pem')

//Check signature is valid
//only continue if signature is valid
const isValid = Signature.verifyJWT(token,publicKey)

if(isValid) {
  
  //Hash decoded claim
  const hashDecoded = CryptoJS.SHA256(JSON.stringify(isValid))
    .toString(CryptoJS.enc.Hex)
  console.log('Hashed claim: ',hashDecoded)
    
    
  //get the root 
  const getRoot = async () => {
    let rootAddress = "FIORYRCHDI9INGL9NSGU9ACALOPDDVVLERCMXLAUFHIQPVGKDIXBIKBFCWZPPFKXOKCGMWHEYBWWHDFJX"
    return rootAddress
  }

  // Callback used to pass data out of the fetch
  const verifyClaim = (data) => {

      jsonObj = JSON.parse(trytesToAscii(data))
      message = jsonObj.message

      console.log('Fetched and parsed', jsonObj, '\n')

      //Check token provided by raspberry pi
      if(hashDecoded == message) {

          console.log('The hashes do match.\n')

    } else console.log('Wrong claim provided\n\n')
  }

  //Get the message from the tangle
  getRoot()
  .then(async root => {

    // Output asyncronously using "verifyClaim" callback function
    await Mam.fetch(root, mode, null, verifyClaim)

  })


} else console.log('Program aborted')
 

 


