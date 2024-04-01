const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');

// Create an HTTP server // 
const server = http.createServer((req, res) => {
  // Serve index.html file (localhost://8080)
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile('index.html', (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }
      res.writeHead(200);
      res.end(data); // using data(index.html's data) // response body 
    });
  }
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket connection established');
  ws.on('message', (message) => {                   // once message comes to server,
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
