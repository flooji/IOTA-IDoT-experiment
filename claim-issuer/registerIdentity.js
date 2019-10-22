//register Identity claim
const jwt = require('jsonwebtoken')

const Mam = require('@iota/mam')
const { asciiToTrytes } = require('@iota/converter')

const ClaimGenerator = require('./claimGenerator')
const Signature = require('../signature')

//Change these variables
const devicePubKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCTOdA8wN524+wb5gqaU5uiliT1S5LoNqDIA2SI5P7VgGsYaH6zByB5jA7+muYCFUWHnWupU4DtEB6D59XgGRLfstxuyOIb7lwW1stsHaQW1UmZ5d04OlwQW2bMHvm1CwEEaOkVij+d6hsMhPTuFnbu1C3KQlGbCTEe5OClvN8DPQIDAQAB"
const channelID = "FIORYRCHDI9INGL9NSGU9ACALOPDDVVLERCMXLAUFHIQPVGKDIXBIKBFCWZPPFKXOKCGMWHEYBWWHDFJXCSKUUDLAB"
const issuerName = "https://strassenverkehrsaemter.ch/"
const owner = "Transport GmbH"
const model = "Raspberry Pi 3B+"
const validUntil = "01/01/2025"

const mode = 'public'
const provider = 'https://nodes.devnet.iota.org'
const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&root=`
const seed = 'PUEOTSEITFEVEWCWBTSIZM9NKRGJEIMXTULBACGFRQK9IMGICLBKW9TTEVSDQMGWKBXPVCBMMCXWMNPDX'

// Initialise MAM state
let mamState = Mam.init(provider,seed)

//First step: generate the claim
const claim = ClaimGenerator.generateClaim(devicePubKey,channelID,issuerName,owner,model,validUntil)


//Second step: sign claim -> generate JSON web token
let token = Signature.signClaim(claim)
console.log('Signed Claim - JWT:\n',token,'\n')

//Third step: publish to tangle
const publish = async packet => {
    // Create MAM Payload - STRING OF TRYTES
    const trytes = asciiToTrytes(JSON.stringify(packet))
    const message = Mam.create(mamState,trytes)

    // Save new mamState
    mamState = message.state

    // Attach the payload
    await Mam.attach(message.payload, message.address, 3, 9)

    console.log('Published', packet, '\n');
    console.log(`Root: ${message.root}\n`)
    return message.root
}

//publish Identity Token to tangle
registerIdentity = async (identityToken) => {

    const root = await publish({
        message: identityToken,
        timestamp: (new Date()).toLocaleString()
    })
    console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`)
}


//Register identity
registerIdentity(token)
