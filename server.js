const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on('connection', function connection(ws) {
  clients.push(ws);

  ws.on('message', function incoming(message) {
    const text = message.toString(); // buffer'dan string'e çevir

    console.log('Received:', text);

    // JSON kontrolü
    let parsed;
    try {
      parsed = JSON.parse(text); // {"name":"Ali","message":"Merhaba"}
    } catch (e) {
      console.log("Geçersiz JSON:", text);
      return;
    }

    const name = parsed.name || "Unknown";
    const content = parsed.message || "";

    const fullMessage = JSON.stringify({ name, message: content });

    // Tüm diğer istemcilere gönder
    clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
        client.send(fullMessage); // Göndericiyi hariç tutmadan gönder
    }
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
