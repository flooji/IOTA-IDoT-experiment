

const CryptoJS = require('crypto-js') 

//Require Mam package from iota.js
const Mam = require('@iota/mam')
const { asciiToTrytes } = require('@iota/converter')

const { generateClaim } = require('./claimGenerator')

//Change this information to your own
const pubKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCTOdA8wN524+wb5gqaU5uiliT1S5LoNqDIA2SI5P7VgGsYaH6zByB5jA7+muYCFUWHnWupU4DtEB6D59XgGRLfstxuyOIb7lwW1stsHaQW1UmZ5d04OlwQW2bMHvm1CwEEaOkVij+d6hsMhPTuFnbu1C3KQlGbCTEe5OClvN8DPQIDAQAB"
const signingAddress = "WWOTSUHSMXGELOPMDAHFSYXUGEHNIMGVUOSUHISVVUZYPQAQMSOXCWTIEKKYBCNVCBNBS9EWE9IVLDNAW"
const issuer = "https://publicRoadsAdministration.com/"
const owner = "Transport GmbH"
const model = "Raspberry Pi 3B+"
const validUntil = "01/01/2025"

//Mam setup
const mode = 'public'
const provider = 'https://nodes.devnet.iota.org'
const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&root=`

//Replace with your own seed, generated (on Linux terminal) with: cat /dev/urandom |tr -dc A-Z9|head -c${1:-81}
const seed = 'PUEOTSEITFEVEWCWBTSIZM9NKRGJEIMXTULBACGFRQK9IMGICLBKW9TTEVSDQMGWKBXPVCBMMCXWMNPDX'

//Initialise MAM state object
let mamState = Mam.init(provider,seed)

//Generate and store claim
let claim = generateClaim(pubKey,signingAddress,issuer,owner,model,validUntil)

//Hash claim for publishing to tangle
let hashedClaim = CryptoJS.SHA256(JSON.stringify(claim))
    .toString(CryptoJS.enc.Hex)

console.log('Hash of claim: ', hashedClaim)


//Publishes Identity-claim to tangle
const registerIdentity = async hash => {
    
    //Packet to be published
    const packet = {
        message: hash,
        timestamp: (new Date()).toLocaleString()
    }

    // Create MAM Payload - STRING OF TRYTES
    const trytes = asciiToTrytes(JSON.stringify(packet))
    const message = Mam.create(mamState,trytes)

    // Save new mamState
    mamState = message.state

    // Attach the payload
    await Mam.attach(message.payload, message.address, 3, 9)

    console.log('Published', packet, '\n');
    console.log(`Root: ${message.root}\n`)
    console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`)
    
    return message.root
}


registerIdentity(hashedClaim)
