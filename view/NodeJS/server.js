console.log('Helloworld');
var http = require('http');
var url = require('url');
var querystring = require('querystring');


var http = require("http");
httpServer = http.createServer()
httpServer.listen(8888);

var io = require('socket.io').listen(httpServer);
io.sockets.on('connection', function (socket) {
   socket.emit('connected', 'Connexion ok');
});