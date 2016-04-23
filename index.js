var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var url = require('url');
var ejs = require('ejs');
var bodyParser = require("body-parser");
var config = config = require("./includes/config");
var chatRoom = require("./modules/chatroom");
var mongoose = require('mongoose');
var session = 'n0tchatt1ng';
var url_parts, nsp;
var data = { base_url: config.base_url };

//connect to db
mongoose.connect(config.db.url);

app.set('strict routing', true);

// redirect if with trailing slash
app.use(function(req, res, next) {
   if(req.url.substr(-1) == '/' && req.url.length > 1) {
       res.redirect(301, req.url.slice(0, -1));
   } else {
       next();
   }
});
app.use(express.static("css"));
app.use(bodyParser.json());
// to support URL-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');

http.listen(3000, function () {
	console.log('Chat app listening on port 3000!');
});

app.get('/', function (req, res) {
	res.render(__dirname + '/view/index', data);
});

app.get('/chat', function (req, res) {
	// sendFile (capital F) does not work with socket.io
	//res.sendfile(__dirname + '/view/chat.ejs');
	url_parts = url.parse(req.url, true);
	chatRoom.verify(url_parts.query, function (ret) {
		if (ret === 'success') {
			// set session for this chat.
			session = url_parts.query.room; 
			res.render(__dirname + '/view/chat', data);
		} else {
			res.render(__dirname + '/view/chatfail', data);
		}
	});
});

/*
// get and verify user id (nickname) and return back the user id if valid or
// send an error message if invalid user
app.get('/getUser', function (req, res) {
	url_parts = url.parse(req.url, true);
	res.end(url_parts.query.id);
})
*/

// accept user-submitted post data to create a new chat room
app.post('/createchat', function (req, res) {
  	var params = req.body;
  	chatRoom.createRoom(params, function (ret) {
	  	data.urls = chatRoom.getUrls();
	  	data.members = chatRoom.getMembers();
	  	data.status = ret;

	  	if (ret === 'success') {
	  		data.cla = 'bg-primary';
	  		data.message = "Chatroom has been successfully created!";
	  	} else {
	  		data.cla = 'bg-danger';
	  		data.message = "Chatroom was not successfully created. Try again."
	  	};

	 	res.render(__dirname + '/view/createchat', data);
	});
});

io.on('connection', function(socket) {
	socket.on('disconnect', function(){
	    console.log('user disconnected');
	});

	socket.on('chat message', function(msg){
	    io.emit(msg.room + ' chat message', msg);
	});

	socket.on('typing a message', function(data) {
		io.emit(data.room + ' typing a message', data);
	});

	/*
	socket.on('log user', function (user) {
		io.emit('log user', user);
	})
	*/
});