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
ChatRoom.prototype.createRoom = function (params) {
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
		  throw err;	
	    };

	    return { status : 'success' };
	});
}

module.exports = new ChatRoom();

