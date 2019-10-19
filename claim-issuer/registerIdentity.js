//register Identity claim
const jwt = require('jsonwebtoken')

const Mam = require('@iota/mam')
const { asciiToTrytes } = require('@iota/converter')

const claimGenerator = require('./claimGenerator')

//Change these variables
const pubKey = 2
const issuerPubKey = 2
const issuerName = "https://strassenverkehrsaemter.ch/"
const owner = "Transport GmbH"
const model = "Raspberry Pi 3B+"
const validUntil = "01/01/2025"

const mode = 'public'
const provider = 'https://nodes.devnet.iota.org'
const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&root=`
const seed = 'PUEOTSEITFEVEWCWBTSIZM9NKRGJEIMXTULBACGFRQK9IMGICLBKW9TTEVSDQMGWKBXPVCBMMCXWMNPDX'

// Initialise MAM State
let mamState = Mam.init(provider,seed)

//First step: generate the claim
generatedClaim = claimGenerator.generateClaim(pubKey,issuerPubKey,issuerName,owner,model,validUntil)

//Second step: sign claim
secret = 'verySecretKey'
let token = jwt.sign(generatedClaim, secret)


//Third step: publish to tangle
const publish = async packet => {
    // Create MAM Payload - STRING OF TRYTES
    const trytes = asciiToTrytes(JSON.stringify(packet))
    const message = Mam.create(mamState, trytes)

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
