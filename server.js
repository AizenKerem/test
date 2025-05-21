const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on('connection', function connection(ws) {
  clients.push(ws);

  ws.on('message', function incoming(message) {
    console.log('Received:', message);

    // Bütün bağlı istemcilere mesajı gönder
    clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    clients = clients.filter(c => c !== ws);
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 8765;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
