var mongoose = require('mongoose');

var chatSchema = mongoose.Schema({
  id: {  
  	type: String, 
  	index: true
  },
  num_members: {type: Number, min: 0},
  members_list: Array,
  date_created: String,
  members_url: Object
}, { 
  autoIndex: true // set to false in production
});

module.exports = mongoose.model('chatrooms', chatSchema);