var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var url = require('url');
var url_parts;

app.use(express.static("css"));

http.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});

app.get('/', function (req, res) {
	res.sendfile('view/index.html');
});

app.get('/getUser', function (req, res) {
	url_parts = url.parse(req.url, true);
	res.end(url_parts.query.id);
})

io.on('connection', function(socket) {
	console.log('a user connected');

	socket.on('disconnect', function(){
	    console.log('user disconnected');
	});

	socket.on('chat message', function(msg){
	    io.emit('chat message', msg);
	});

	socket.on('typing a message', function(data) {
		io.emit('typing a message', data);
	});

	socket.on('log user', function (user) {
		io.emit('log user', user);
	})
});