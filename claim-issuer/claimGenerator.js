
//This script produces a signed Identity-claim in form of a JSON-document and stores it locally

const uuidv4 = require('uuid/v4')
const fs = require('fs')

exports.generateClaim = function (devicePubKey,issuerAdress,issuer,deviceOwner,deviceModel,expirationDate) {
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

        fs.writeFile(`../device/claim_${UUID}.json`, JSON.stringify(jsonClaim), function (err) {
            if (err) throw err
            console.log(`File claim_${UUID}.json created successfully.`)
        })
    
    } catch(err) {
        
        console.log('Error: ', err)
    }
}