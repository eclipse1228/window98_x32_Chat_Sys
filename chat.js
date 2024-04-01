// 중요! 소스코드의 경로에 한글이 있으면 안 됨
// npm init -y
// npm install ws 웹 소켓

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

    // 받은 메시지를 모든 클라이언트에게 보냄
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.send('Welcome to the chat server!');
});

console.log('Chat server is running on ws://localhost:8080');
