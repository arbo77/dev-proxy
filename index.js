// @arbo77
const express = require('express');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');
const configFile = './config.json';

const port = process.argv[2] || 3000;
const app = express();
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
        pathRewrite: (path, req) => { return path.replace(c.path, '/') }
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