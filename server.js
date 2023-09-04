const http = require('http');
//import http from "http"
const app = require('./app.js')
const port = 3040;
const server = http.createServer(app)
server.listen(port, () => {
    console.log('listening on port = '+port)
})

