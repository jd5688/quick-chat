var Cmod = require('../model/chatroom_m');
var config = require('../includes/config');

// create the chatroom class
var ChatRoom = function () {
	this.room;
	this.members_url = {};
	this.num_members = 0;
	this.members = [];
};

/*
params = { num_people: '4',
  person1: 'aaron',
  person2: 'aaric',
  person3: 'aadrin',
  person4: 'aaliyah' }
*/
ChatRoom.prototype.createRoom = function (params, callback) {
	var cmod = new Cmod();
	this.room = new Date().getTime();

	this.num_members = params.num_people;

	for (var i = 1; i <= this.num_members; i += 1) {
		this.members.push(params['person' + i]);
		this.members_url[params['person' + i]] = config.base_url + "/chat?room=" + this.room + "&name=" + params['person' + i];
	}

	cmod.id = this.room;
	cmod.num_members = this.num_members;
	cmod.members_list = this.members;
	cmod.date_created = new Date().toLocaleDateString();
	cmod.members_url = this.members_url;

	cmod.save(function(err) {
	    if (err) {
		 	callback('failed');
	    } else {
	    	callback('success');
	    }
	});
};

ChatRoom.prototype.getUrls = function () {
	return this.members_url;
};

ChatRoom.prototype.getMembers = function () {
	return this.members;
};

// params = { room : 1461220853754, name: 'me' };
ChatRoom.prototype.verify = function (params, callback) {
	var dat = Cmod.find({
	  	id : params.room,
	  }).select({ members_list: 1, id: 1});
	
	dat.exec(function (err, data) {
	  if (err) {
	  	throw err;
	  };

	  // check if user is on the members_list array
	  if (data[0].members_list.indexOf(params.name) !== -1) {
	  	callback('success');
	  } else {
	  	callback('fail');
	  }
	});
};



module.exports = new ChatRoom();

