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
  if (req.url === '/favicon.ico') {
    res.writeHead(204); // No Content
    return res.end();
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
  ws.on('message', (data) => {
    let message = data;
    // 메시지가 문자열이 아니면 문자열로 변환
    if (!(typeof message === 'string' || message instanceof String)) {
      message = message.toString();
    }
    // 닉네임 유무 분기
    if (message.startsWith('nickname:')) {
      //TODO implement 입장 메시지 추가
      const nickname = message.split(':')[1];
      const entryMessage = `${nickname}님께서 입장하셨습니다.`;
      console.log(entryMessage);
      // 모든 클라이언트에게 입장 메시지 방송
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(entryMessage);
        }
      });
    } else {
      //TODO implement 타임스탬프 메세지 추가
      const timestamp = new Date().toLocaleTimeString(); // 현재 시간을 "hh:mm:ss" 포맷으로 획득
      const messageWithTimestamp = `[${timestamp}] ${message}`; // 메시지에 시간 추가
      // 모든 클라이언트에게 메시지 방송
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(messageWithTimestamp);
        }
      });
    }
  });
  ws.send('Welcome to the chat server!');
});




// listen.. to client's call
server.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
  });
