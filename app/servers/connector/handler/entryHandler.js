'use strict';
var Code = require('../../../../shared/code');
var userDao = require('../../../dao/userDao');
var utils = require('../../utils/util');
var logger = require('pomelo-logger').getLogger(__filename);
module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */

Handler.prototype.entry = function(msg, session, next) {
  var token = msg.token;
  var self = this;
  var app = self.app;
  if (!token) {
    next(new Error('invalid entry request: empty token'), {code: Code.FAIL});
    return;
	}
  var uid, players, player;
  var auth = utils.rpcFuncPromisify(app.rpc.auth.authRemote.auth, app.rpc.auth.authRemote);
  auth(session, token)
  .then(function (result) {
    if(result.code !== Code.OK) {
      next(null, { code : result.code });
      return;
    }
    if(!result.code) {
			next(null, {code: Code.ENTRY.FA_USER_NOT_EXIST});
			return;
		}
    var user = result.user;
    uid = user.id;
    return userDao.getPlayersByUid(user.id);
  }).then(function (res) {
    players = res;
    var kick = utils.rpcFuncPromisify(app.get('sessionService').kick, app.get('sessionService'));
    return kick(uid);
  }).then(function () {
    var bind = utils.rpcFuncPromisify(session.bind, session);
    return bind(uid);
  }).then(function () {
    if(!players || players.length === 0) {
				next(null, {code: Code.OK});
				return;
		}
    player = players[0];
		session.set('serverId', self.app.get('areaIdMap')[player.areaId]);
		session.set('playername', player.name);
		session.set('playerId', player.id);
		session.on('closed', onUserLeave.bind(null, self.app));
    var pushAll = utils.rpcFuncPromisify(session.bind, session);
		return pushAll();
  }).then(function () {
    var add = utils.rpcFuncPromisify(app.rpc.chat.chatRemote.add, app.rpc.chat.chatRemote);
    return add(session, player.userId, player.name, 'zzzzz');
  }).then(function () {
    next(null, {code: Code.OK, player: players ? players[0] : null});
  }).catch(function (err) {
    next(err, {code: Code.FAIL});
  });
};


var onUserLeave = function (app, session, reason) {
	if(!session || !session.uid) {
		return;
	}

	// utils.myPrint('1 ~ OnUserLeave is running ...');
	// app.rpc.area.playerRemote.playerLeave(session, {playerId: session.get('playerId'), instanceId: session.get('instanceId')}, function(err){
	// 	if(!!err){
	// 		logger.error('user leave error! %j', err);
	// 	}
	// });
	// app.rpc.chat.chatRemote.kick(session, session.uid, null);
};

/**
 * Publish route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.publish = function(msg, session, next) {
	var result = {
		topic: 'publish',
		payload: JSON.stringify({code: 200, msg: 'publish message is ok.'})
	};
  next(null, result);
};

/**
 * Subscribe route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.subscribe = function(msg, session, next) {
	var result = {
		topic: 'subscribe',
		payload: JSON.stringify({code: 200, msg: 'subscribe message is ok.'})
	};
  next(null, result);
};
