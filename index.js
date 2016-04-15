var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static("css"));

http.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.get('/', function (req, res) {
  res.sendfile('view/index.html');
});

io.on('connection', function(socket) {
	socket.emit('news', { hello: 'world' });
	console.log('a user connected');
});