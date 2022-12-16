// @arbo77
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const configFile = './config.json';

const port = process.argv[2] || 3000;
const app = express();

let cookies = {}

let server;

function RunProxy() {
  server && server.close()

  let rawdata = fs.readFileSync(configFile);
  let config = JSON.parse(rawdata);
  config.forEach(c => {
    app.use(
      c.path,
      createProxyMiddleware({
        target: c.target,
        changeOrigin: true,
        pathRewrite: (path, req) => { return path.replace(c.path, '') },
        onProxyReq: (proxyReq, req) => {
          const cookie = cookies[req.header('Origin')]
          if (cookie) {
            proxyReq.setHeader('Cookie', cookie);
          }
        },
        onProxyRes: (proxyRes, req) => {
          const originHost = proxyRes.headers['access-control-allow-origin']
          const vary = proxyRes.headers['vary']
          proxyRes.headers['x-proxy'] = 'dev-proxy'
          if (req.path.includes('/login')) {
            const cookie = proxyRes.rawHeaders.filter(h => {
              return h.includes('JSESSIONID')
            })
            proxyRes.headers['set-cookie'] = cookie[0]
            cookies[originHost] = cookie[0]
          }
        }

      })
    );
  });

  server = app.listen(port);
}

fs.watchFile(configFile, (curr, prev) => {
  console.log("restart proxy");
  RunProxy();
})

console.log("DevProxy");
console.log("========");
console.log("");
console.log("proxy ini akan otomatis reload ketika file config.json diubah.");
console.log("silakan tentukan path local untuk mengarahkan ke target");
console.log(`
  ....
  {
    "path": "/jsonplaceholder",
    "target": "https://jsonplaceholder.typicode.com"
  }
  ...
`);

console.log(`gunakan url http://localhost:${port}/{path} untuk development`);
console.log("");
RunProxy();