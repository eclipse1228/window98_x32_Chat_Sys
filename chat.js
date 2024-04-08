const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

/* Create an HTTP server // -ByeongSuGo 24/04/08*/
const server = http.createServer((req, res) => {                // Serve index.html file (localhost://8080)

  let filePath = '.' + req.url;                                 // File Path Configuration 
  if (filePath == './') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase(); // file's extension (ex file.txt -> extname is 'txt') 
  let contentType = 'text/html';                                // Default is html 
  switch (extname) {                                            // Browser autoMatically jenerate Request for additional files (javascripts , css files ..) but We have to set ContentType.
    case '.css':
      contentType = 'text/css';                                 
      break;
  }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading file');
      }
      res.writeHead(200, {'Content-Type':contentType});         
      res.end(data, 'utf-8');                                   // using data(index.html's data) // response body 
      });
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket connection established');
  ws.on('message', (message) => {                   // Once message comes to server,
    console.log('received: %s', message);
    // Broadcast incoming message to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
  ws.send('Welcome to the chat server!');
});

// listen.. to client's call
server.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});
