const Mam = require('@iota/mam')
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')
const jwt = require('jsonwebtoken')

const mode = 'public'
const provider = 'https://nodes.devnet.iota.org'

const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&root=`

// Initialise MAM State
let mamState = Mam.init(provider)

//token from raspberry pi
let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoiYWM3NjNlOTQtNzFlNi00Yzk1LTllYjItZGYyMDYxZGNjMTAwIiwicm9vdCI6MiwiaXNzdWVyQWRkcmVzcyI6MiwiaXNzdWVyIjoiaHR0cHM6Ly9zdHJhc3NlbnZlcmtlaHJzYWVtdGVyLmNoLyIsImRhdGEiOnsiZGV2aWNlT3duZXIiOiJUcmFuc3BvcnQgR21iSCIsImRldmljZU1vZGVsIjoiUmFzcGJlcnJ5IFBpIDNCKyJ9LCJleHBpcmF0aW9uRGF0ZSI6IjAxLzAxLzIwMjUiLCJpYXQiOjE1NzE1MDYwNzF9.VbdE0ITSVKMCXpNsjAiQp181dMhVmCLAFmKKBQ4gnbc'


const getRoot = async () => {
    let rootAddress = "FIORYRCHDI9INGL9NSGU9ACALOPDDVVLERCMXLAUFHIQPVGKDIXBIKBFCWZPPFKXOKCGMWHEYBWWHDFJX"
    return rootAddress
}

// Callback used to pass data out of the fetch
const verifyClaim = data => {

    jsonObj = JSON.parse(trytesToAscii(data))
    message = jsonObj.message

    console.log('Fetched and parsed', jsonObj, '\n')

    //check token provided by raspberry pi
    if(token == message) {

        console.log('The token do match: Valid claim\n\n')
    } else console.log('Wrong token provided\n\n')
}

getRoot()
  .then(async root => {

    // Output asyncronously using "logData" callback function
    await Mam.fetch(root, mode, null, verifyClaim)

  })
