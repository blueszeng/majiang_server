'use strict';
var dispatcher = require('./dispatcher');
var exp = module.exports;
exp.chat = function(session, msg, app, cb) {
  var chatServers = app.getServersByType('chat');

    if(!chatServers || chatServers.length === 0) {
        cb(new Error('can not find chat servers.'));
        return;
    }
    var res = dispatcher.dispatch(session.get('rid'), chatServers);

    cb(null, res.id);
};

exp.connector = function(session, msg, app, cb) {
	if(!session) {
		cb(new Error('fail to route to connector server for session is empty'));
		return;
	}

	if(!session.frontendId) {
		cb(new Error('fail to find frontend id in session'));
		return;
	}

	cb(null, session.frontendId);
};
