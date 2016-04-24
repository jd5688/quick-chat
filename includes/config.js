var conf = {
	base_url: "http://localhost:3000",
	db : {
		url : 'mongodb://localhost/quick-chat'
	}
};

module.exports = conf;

/*
MongoDB 2.4 database added.  Please make note of these credentials:

   Root User:     admin
   Root Password: cmgabvSIGLwn
   Database Name: app

Connection URL: mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/
*/