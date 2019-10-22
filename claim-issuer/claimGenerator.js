
//This script produces a signed Identity-claim in form of a JSON-document and stores it locally

//uncommment these variables if you would like to execute the script itself (node make-ID-claim.js):
const pubKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCTOdA8wN524+wb5gqaU5uiliT1S5LoNqDIA2SI5P7VgGsYaH6zByB5jA7+muYCFUWHnWupU4DtEB6D59XgGRLfstxuyOIb7lwW1stsHaQW1UmZ5d04OlwQW2bMHvm1CwEEaOkVij+d6hsMhPTuFnbu1C3KQlGbCTEe5OClvN8DPQIDAQAB"
const signingAddress = "WWOTSUHSMXGELOPMDAHFSYXUGEHNIMGVUOSUHISVVUZYPQAQMSOXCWTIEKKYBCNVCBNBS9EWE9IVLDNAW"
const issuerName = "https://publicRoadsAdministration.com/"
const owner = "Transport GmbH"
const model = "Raspberry Pi 3B+"
const validUntil = "01/01/2025"

const uuidv4 = require('uuid/v4')
const fs = require('fs')

generateClaim = function (devicePubKey,issuerAdress,issuer,deviceOwner,deviceModel,expirationDate) {
    try {
        const UUID = uuidv4();
    
        jsonClaim = {
            "subject": UUID,
            "devicePubKey": devicePubKey,
            "issuerAddress": issuerAdress,
            "issuer": issuer,
            "data": {
                "deviceOwner": deviceOwner,
                "deviceModel": deviceModel
            },
            "expirationDate": expirationDate
        }
    
        console.log('Claim: ',jsonClaim)

        fs.writeFile(`claim_${UUID}.json`, JSON.stringify(jsonClaim), function (err) {
            if (err) throw err
            console.log(`File claim_${UUID}.json created successfully.`)
        })
    
    } catch(err) {
        
        console.log('Error: ', err)
    }
}

//uncomment the function if you would like to execute the script itself:
generateClaim(pubKey,signingAddress,issuerName,owner,model,validUntil)
