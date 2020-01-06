# IOTA-IDoT-experiment
Register, manage and verify an identity credential for a RaspberryPi over the IOTA tangle 

:warning: This code was written by a beginner. 

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

### 1. Register an identity

**Generate an identity credential**
**Make a MAM transaction on the tangle containing the hash of the credential**

### 2. Verify an identity

**Receive the credential from the device and verify its integrity**

**Fetch the corresponding hash from the tangle and compare it to the hashed credential from the device**

### 3. Update identity 

### 4. Resolve an identity

## Support

Please [open an issue](https://github.com/flooji/IOTA-Raspberry-API/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/flooji/IOTA-Raspberry-API/compare/).

## Credits

Credits to the IOTA foundation whose [tutorials](https://docs.iota.org/docs/client-libraries/0.1/mam/js/create-restricted-channel) helped me to realize this project.

