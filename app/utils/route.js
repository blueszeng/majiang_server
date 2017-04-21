"use strict";
var dispatcher = require('./dispatcher');
module.exports.chatRoute = function(session, msg, app, cb) {
  var chatServers = app.getServersByType('chat');

    if(!chatServers || chatServers.length === 0) {
        cb(new Error('can not find chat servers.'));
        return;
    }
    var res = dispatcher.dispatch(session.get('rid'), chatServers);

    cb(null, res.id);
};
