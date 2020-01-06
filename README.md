# IOTA-IDoT-experiment
Register, manage and verify an identity credential for a RaspberryPi over the IOTA tangle 

***
:warning: This code was written by a beginner. 
***

## Table of Contents

- [Getting started](#getting-started)
- [Tutorial](#tutorial)
- [Support](#support)
- [Contributing](#contributing)
- [Credits](#credits)

## Getting started

**Prerequisites**

- Raspberry Pi (I used the model 3B+) with internet connection
- [NodeJS](https://nodejs.org/en/) installed on your Raspi

If no Raspberry Pi is available you can as well use your laptop with NodeJS installed.

**Installation**

You can download this repo and then run ```npm install``` to install all dependencies automatically. 

Used npm-modules (also visible in package.json-file):
- @iota/mam v.0.7.3
- crypto-js v.3.1.9-1
- jsonwebtoken v.8.5.1
- uuid v.3.3.3

To install a npm module run ```npm install module_name```.

## Tutorial

In this tutorial, you will learn more about the Identity of Things with the Distributed Ledger Technology IOTA. 
We will go through a series of scripts that shows how an identity document can be created and secured by uploading it on the IOTA tangle. Finally, we will check for the validity of the identity document. 

Before we get started let's quickly look at how an authentification process works.
We usually have three players in Identity of Things: 
* The device to be authenticated
* The one that wants to authenticate the device called **Claim verifier**
* The one that provides the device with an identity called **Claim issuer**

![architecture](https://github.com/flooji/IOTA-IDoT-experiment/blob/master/hashed.png)

The identity credential (also called verifiable claim sometimes) is the document that contains information about the device to uniquely identify it. The benefit of securing this claim with a ledger is that it makes it difficult to tamper the identity even without having a trusted third party (TTP) present at each authentication process.

If you would like to do more research on the topic use the following keywords: Verifiable claims, Self-sovereign identity, decentralized identity management, IOTA

Also, you should check out DIDs (Decentralized Identifiers). The DID infrastructure uses methods that simplify the process of creating, updating and deleting Identity Documents with specific Distributed Ledger Technologies. 

DIDs introduction:
> [Official introduction on DIDs of W3C](https://w3c-ccg.github.io/did-primer/)

Unified Identity Protocol (to come): 
> [The First Step Towards a Unified Identity Protocol](https://blog.iota.org/the-first-step-towards-a-unified-identity-protocol-7dc3988c8b0e)

**This tutorial contains the following steps:**

### 1. Register an identity

**Generate an identity credential**

Take a look at [claimGenerator.js](https://github.com/flooji/IOTA-IDoT-experiment/blob/master/claim-issuer/claimGenerator.js) in this repository in the directory **claim-issuer**.
As you can see it is a simple function creating a JSON object and storing this JSON object into a file.
As identifier we use an UUID. 
 
The returned claim should look something like this:

![console output registerIdentity.js](https://github.com/flooji/IOTA-IDoT-experiment/blob/master/published.PNG)

Next step is to hash the claim and publish it to the IOTA tangle:

**Make a MAM transaction on the tangle containing the hash of the credential**

Take a look at [registerIdentity.js](https://github.com/flooji/IOTA-IDoT-experiment/blob/master/claim-issuer/registerIdentity.js).
The previous function is now imported at the beginning of the script. The resulting claim is hashed with 
```javascript
const hashedClaim = CryptoJS.SHA256(JSON.stringify(claim))
    .toString(CryptoJS.enc.Hex)
```
Replace the existing seed with your own [seed](https://docs.iota.org/docs/dev-essentials/0.1/concepts/addresses-and-signatures#how-seeds-are-used-in-iota):
```javascript
const seed = 'PUEOTSEITFEVEWCWBTSIZM9NKRGJEIMXTULBACGFRQK9IMGICLBKW9TTEVSDQMGWKBXPVCBMMCXWMNPDX
```
You can generate a seed by executing `cat /dev/urandom |tr -dc A-Z9|head -c${1:-81}` on your console.

:warning: This is not a safe way how to operate with a seed. Don't use this seed to deal with actual cryptocurrency! Here we only use the [devnet](https://devnet.thetangle.org/).

In the beginning, we also establish the MAM state object (tracks the progress of channel and channels you are following) `let mamState = Mam.init(provider,seed)`, define the mode of the MAM channel (public, restricted or private):
`const mode = 'public'`. As well we define a provider that is used as connection to the IOTA tangle:
`const provider = 'https://nodes.devnet.iota.org'`.

Now we can publish the hash by passing it to the function _publish_ from the official IOTA tutorial [docs.iota.org/iota-js](https://docs.iota.org/docs/iota-js/0.1/mam/introduction/overview):
```javascript
registerIdentity = async (hash) => {

    const root = await publish({
        message: hash,
        timestamp: (new Date()).toLocaleString()
    })
    console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`)
}
```
```javascript 
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
```
With that, a new MAM channel is created with _root_ (the root of Merkle tree in the MAM signature scheme) used as channel ID (in case of public mode) and the hashed credential is published to this channel as a message with timestamp.

Execute `node registerIdentity.js` and check on the [IOTA MAM Explorer](https://mam-explorer.firebaseapp.com/) that you're transaction has been successful. 

### 2. Verify an identity

**Receive the credential from the device and verify its integrity**

In [sendClaim.js](https://github.com/flooji/IOTA-IDoT-experiment/blob/master/device/sendClaim.js) (under _**device**_) you can see that the claim stored on the device is encrypted as JSON Web Token before sending it to the claim verifier.
The example does not actually send the token over the internet. Still, I used JSON Web Token to illustrate how you could sign the claim to prevent Man-in-the-middle-attacks.

Once the claim verifier receives the token it checks with the device's public key that the message is from the device.
The token verification happens in this function (in [signature.js](https://github.com/flooji/IOTA-IDoT-experiment/blob/master/signature.js)
```javascript
const jwt = require('jsonwebtoken')

//verify a JSON web token with public Key provided
exports.verifyJWT = (jsonWebToken, publicKey) =>  {

    //verify token
    jwt.verify(jsonWebToken, publicKey, { algorithms: ['RS256'] }, function(error, decoded) {
        if(error) {
            // err = {
            //     name: 'JsonWebTokenError',
            //     message: 'jwt malformed'
            //   }
            console.log(`Invalid signature.\nError name: ${error.name}\nError message: ${error.message}`)
        } else {
            console.log(`The signature is valid.\nDecoded claim: ${decoded}`)
            return decoded
        }
      })
    }
```

**Fetch the corresponding hash from the tangle and compare it to the hashed credential from the device**

After receiving the credential from the device, verifying and hashing it, the hashed credential is fetched from the tangle:
```javascript
// Output asyncronously using "verifyClaim" callback function
await Mam.fetch(root, mode, null, verifyClaim)
```
The two hashes are then compared to each other. If both hashes are identical the credential should be valid. 

### 3. Update an identity 

Updating an identity could be done by publishing a second revised credential to the already existing MAM channel on the tangle. 
Therefore we need to keep track of the MAM state object. If the MAM state object is re-initialized it will start at address index zero and overwrite the old credential (That's what I noticed on the MAM explorer). The revised credential must be uploaded to the device as well, otherwise the hashes will no longer match. Don't forget that the verifier must receive the new root, otherwise he will fetch the wrong or multiple MAM messages from the tangle.

### 4. Resolve an identity

Resolving an identity is possible by publishing a revised credential containing an old validity date or by uploading a new hash to the tangle but don't change the credential of the device. Here again, the verifier should receive the root of the new MAM transaction for the verification process.

## Support

Please [open an issue](https://github.com/flooji/IOTA-Raspberry-API/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/flooji/IOTA-Raspberry-API/compare/).

## Credits

Credits to the IOTA foundation whose [tutorials](https://docs.iota.org/docs/client-libraries/0.1/mam/js/create-restricted-channel) helped me to realize this project.

