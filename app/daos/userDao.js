'use strict';
var Promise = require('bluebird');
var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var userDao = module.exports;

userDao.getPlayer = function (playerId) {
  return new Promise(function (resolve, reject) {
    var sql = 'select * from Player where id = ?';
  	var args = [playerId];
  	pomelo.app.get('mysqlDb').query(sql, args)
    .then(function (res) {
      if (!res || res.length <= 0) {
        resolve([]);
  		} else {
        resolve(new Player(res[0]));
  		}
    }).then(function (err) {
      logger('search player' + err.message);
      reject(err.message);
    });
  });
};
