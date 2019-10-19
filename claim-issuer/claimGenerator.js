
//This script produces a signed Identity-claim in form of a JSON-document and stores it on the raspberry pi

//uncommment these variables if you would like to execute the script itself (node make-ID-claim.js):
// const pubKey = 2
// const issuerPubKey = 2
// const issuerName = "https://strassenverkehrsaemter.ch/"
// const owner = "Transport GmbH"
// const model = "Raspberry Pi 3B+"
// const validUntil = "01/01/2025"

const uuidv4 = require('uuid/v4')

exports.generateClaim = function (root,issuerAddress,issuer,deviceOwner,deviceModel,expirationDate) {
    try {
        const UUID = uuidv4();
    
        jsonClaim = {
            "subject": UUID,
            "root": root,
            "issuerAddress": issuerAddress,
            "issuer": issuer,
            "data": {
                "deviceOwner": deviceOwner,
                "deviceModel": deviceModel
            },
            "expirationDate": expirationDate
        }
    
        console.log('Claim: ',jsonClaim)
        return jsonClaim
    
    } catch(error) {
        
        console.log('Error: ', error)
    }
}

//uncomment the function if you would like to execute the script itself:

// generateClaim(pubKey,issuerPubKey,issuerName,owner,model,validUntil)