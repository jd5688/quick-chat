var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var url = require('url');
var ejs = require('ejs');
var bodyParser = require("body-parser");
var config = config = require("./includes/config");
var url_parts;
var data = { base_url: config.base_url };

app.set('strict routing', true);

// redirect if with trailing slash
app.use(function(req, res, next) {
   if(req.url.substr(-1) == '/' && req.url.length > 1)
       res.redirect(301, req.url.slice(0, -1));
   else
       next();
});
app.use(express.static("css"));
app.use(bodyParser.json());
// to support URL-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');

http.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});

app.get('/', function (req, res) {
	res.render(__dirname + '/view/index', data);
});

app.get('/chat', function (req, res) {
	// sendFile (capital F) does not work with socket.io
	//res.sendfile(__dirname + '/view/chat.ejs');
	res.render(__dirname + '/view/chat', data);
});

// get and verify user id (nickname) and return back the user id if valid or
// send an error message if invalid user
app.get('/getUser', function (req, res) {
	url_parts = url.parse(req.url, true);
	res.end(url_parts.query.id);
})

// accept user-submitted post data to create a new chat room
app.post('/createchat', function (req, res) {
  	var params = req.body;
	//console.log(params);
	res.render(__dirname + '/view/createchat', data);
});

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