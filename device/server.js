const http = require('http').createServer(handler) 
const io = require('socket.io')(http) 
const fs = require('fs')

//Import generated JSON Web Token
const { token } = require('./tokenGenerator') 

const port = 8080
http.listen(port, () => {
  console.log(`Server running on port ${port}.`)
})

//Create server - see https://www.w3schools.com/nodejs/nodejs_raspberrypi_webserver_websocket.asp
function handler (req, res) { 
  
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

// WebSocket Connection
io.sockets.on('connection', function (socket) {
  
  //get authentication request from claim verifier
  socket.on('request', function() { 
    
    try {
      let JWT = token //get JSON Web Token
      socket.emit('response','Request successful', JWT)   
    
    } catch(err) {
      console.log('Error:\n',err)
      socket.emit('response',`Request failed with ${err}`) 
    }
  })
})
