"use strict";
var pomelo = require('pomelo');
var route = require('./app/utils/route');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'majiang_server');

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


// Configure database
app.configure('production|development', 'char|auth|connector|master', function() {
	var dbclient = require('./app/daos/mysql').init(app);
	app.set('dbclient', dbclient);
  // app.use(sync, {sync: {path:__dirname + '/app/dao/mapping', dbclient: dbclient}});
});

app.configure('production|development', function() {
  app.route('chat', route.chatRoute);
  app.loadConfig('mysql', app.getBase() + '/../shared/config/mysql.json');
  app.filter(pomelo.filter.timeout());
});
// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
