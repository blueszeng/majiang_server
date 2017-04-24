'use strict';
var pomelo = require('pomelo');
var route = require('./app/utils/route');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'majiang_server');

app.configure('production|development', function() {
  app.enable('systemMonitor');
  var onlineUser = require('./app/modules/onlineUser');
	if (typeof app.registerAdmin === 'function') {
		app.registerAdmin(onlineUser, {app: app});
	}
  app.route('chat', route.chat);
  app.before(pomelo.filters.toobusy());
  app.filter(pomelo.filters.timeout());
  app.loadConfig('mysql', app.getBase() + '/shared/config/mysql.json');
  app.loadConfig('redis', app.getBase() + '/shared/config/redis.json');

});

// app configuration
app.configure('production|development', 'connector', function(){
  app.set('connectorConfig',
    {
      connector : pomelo.connectors.hybridconnector,
      heartbeat : 3,
      useDict : true,
      useProtobuf : true
    });
});


app.configure('production|development', 'auth', function() {
	// load session congfigures
	app.set('session', require('./config/session.json'));
});

// Configure database
app.configure('production|development', 'char|auth|connector|master', function() {
  //mysql
	var mysqlDb = require('./app/daos/mysql/mysql').init(app);
	app.set('mysqlDb', mysqlDb);
  // redis
  var redisCache = require('./app/daos/redis/redis').init(app);
  app.set('redisCache', redisCache);
  // app.use(sync, {sync: {path:__dirname + '/app/dao/mapping', dbclient: dbclient}});
});


// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
