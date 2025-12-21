const http = require('http');
const https = require('https');

const PORT = 3000;
const API_URL = 'https://www.asrar.app/api/v1/istikhara';

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/istikhara') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      console.log('📥 Received request:', body);
      
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      };

      const apiReq = https.request(API_URL, options, (apiRes) => {
        let data = '';

        apiRes.on('data', chunk => {
          data += chunk;
        });

        apiRes.on('end', () => {
          console.log('📤 API Response:', data.substring(0, 100) + '...');
          res.writeHead(apiRes.statusCode, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(data);
        });
      });

      apiReq.on('error', (error) => {
        console.error('❌ API Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Proxy error', message: error.message }));
      });

      apiReq.write(body);
      apiReq.end();
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`🔄 Proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Forwarding requests to ${API_URL}`);
});
