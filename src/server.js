const http = require('node:http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'storeops-api'
    }));
    return;
  }

  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200);
    res.end(JSON.stringify({
      message: 'Welcome to StoreOps API',
      version: '1.0.0'
    }));
    return;
  }

  if (req.method === 'GET' && req.url === '/version') {
    res.writeHead(200);
    res.end(JSON.stringify({
      service: 'storeops-api',
      version: '1.0.0'
    }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({
    error: 'Not Found'
  }));
});

server.listen(PORT, () => {
  console.log(`StoreOps API listening on port ${PORT}`);
});

module.exports = server;
