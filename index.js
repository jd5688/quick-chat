var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var url = require('url');
var ejs = require('ejs');
var url_parts;

app.set('strict routing', true);

// redirect if with trailing slash
app.use(function(req, res, next) {
   if(req.url.substr(-1) == '/' && req.url.length > 1)
       res.redirect(301, req.url.slice(0, -1));
   else
       next();
});
app.use(express.static("css"));
app.set('view engine', 'ejs');

http.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});

app.get('/', function (req, res) {
	//res.sendfile(__dirname + '/view/index.ejs');
	res.render(__dirname + '/view/index');
});

app.get('/chat', function (req, res) {
	// sendFile (capital F) does not work with socket.io
	//res.sendfile(__dirname + '/view/chat.ejs');
	res.render(__dirname + '/view/chat');
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