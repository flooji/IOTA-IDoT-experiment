const http = require('http').createServer(handler) //require http server, and create server with function handler()
const fs = require('fs')
const io = require('socket.io')(http) //require socket.io module and pass the http object (server)
const tokenGenerator = require('./tokenGenerator') //gets tokenGenerator.js

const port = 8080
http.listen(port, () => {
  console.log(`Server running at on port ${port}.`)
})

function handler (req, res) { //create server
  fs.readFile(__dirname + '/public/index.html', function(err, data) { //read file index.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}) //display 404 on error
      return res.end("404 Not Found")
    }
    res.writeHead(200, {'Content-Type': 'text/html'}) //write HTML
    res.write(data) //write data from index.html
    return res.end()
  });
}

io.sockets.on('connection', function (socket) {// WebSocket Connection

  socket.on('request', function() { //get authentication request from claim verifier
    try {
      let token = 'Hello'
      //let token = tokenGenerator.token; //get JSON Web Token
      socket.emit('response','Request successful', token)
    } catch(err) {
      console.log('Error:\n',err)
      socket.emit('response',`Request failed with ${err}`) 
    }
})
})
