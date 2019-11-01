
// Function:   generateClaim
// Desc:       creates claim object and stores this object in a File
// Returns:    claim object

const uuidv4 = require('uuid/v4')
const fs = require('fs')

exports.generateClaim = function (devicePubKey,issuerAdress,issuer,deviceOwner,deviceModel,expirationDate) {

        const UUID = uuidv4();
    
        let claim = {
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
    
        console.log('Claim: ',claim)

        fs.writeFile(`../device/claim_${UUID}.json`, JSON.stringify(claim), function (err) {
            if (err) throw err
            console.log(`File claim_${UUID}.json created successfully.`)
        })

        return claim
}