// Simple HTTP server to serve the PWA
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const WWW_DIR = path.join(__dirname, 'www');

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    let filePath = path.join(WWW_DIR, req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Serve index.html for SPA routing
                fs.readFile(path.join(WWW_DIR, 'index.html'), (err, content) => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content);
                });
            } else {
                res.writeHead(500);
                res.end('Server Error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 NIFTY AI Trader PWA Server running!`);
    console.log(`\n📱 To install on your phone:`);
    console.log(`   1. Connect phone to same WiFi as this computer`);
    console.log(`   2. Open Chrome on your phone`);
    console.log(`   3. Go to: http://<YOUR-PC-IP>:${PORT}`);
    console.log(`   4. Tap menu (⋮) → "Add to Home screen"`);
    console.log(`\n💻 On this PC: http://localhost:${PORT}`);
    console.log(`\nPress Ctrl+C to stop the server\n`);
});
