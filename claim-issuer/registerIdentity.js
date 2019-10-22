//register Identity claim
const CryptoJS = require('crypto-js')

const Mam = require('@iota/mam')
const { asciiToTrytes } = require('@iota/converter')

const ClaimGenerator = require('./claimGenerator')

//Change these variables
//channelID = "FIORYRCHDI9INGL9NSGU9ACALOPDDVVLERCMXLAUFHIQPVGKDIXBIKBFCWZPPFKXOKCGMWHEYBWWHDFJXCSKUUDLAB"
const pubKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCTOdA8wN524+wb5gqaU5uiliT1S5LoNqDIA2SI5P7VgGsYaH6zByB5jA7+muYCFUWHnWupU4DtEB6D59XgGRLfstxuyOIb7lwW1stsHaQW1UmZ5d04OlwQW2bMHvm1CwEEaOkVij+d6hsMhPTuFnbu1C3KQlGbCTEe5OClvN8DPQIDAQAB"
const signingAddress = "WWOTSUHSMXGELOPMDAHFSYXUGEHNIMGVUOSUHISVVUZYPQAQMSOXCWTIEKKYBCNVCBNBS9EWE9IVLDNAW"
const issuerName = "https://publicRoadsAdministration.com/"
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
let claim = ClaimGenerator.generateClaim(pubKey,signingAddress,issuerName,owner,model,validUntil)

//Second step: hash claim
const hashedClaim = CryptoJS.SHA256(JSON.stringify(claim))
    .toString(CryptoJS.enc.Hex)

console.log('Hash of claim: ', hashedClaim)

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

//publish Hash to tangle
registerIdentity = async (hash) => {

    const root = await publish({
        message: hash,
        timestamp: (new Date()).toLocaleString()
    })
    console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`)
}


//Register identity
registerIdentity(hashedClaim)
