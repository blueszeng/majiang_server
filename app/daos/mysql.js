"use strict";
var sqlClient = module.exports;
var Promise = require('bluebird');
var pool;
var Mysql = {};
Mysql.init = function (app) {
  pool = require('./mysqlPool').createMysqlPool(app);
};

Mysql.query = function(sql, args){
  return new Promise(function(resolve, reject) {
    pool.acquire().then(function(client) {
      client.query(sql, args, function(err, res) {
       pool.release(client);
       if (err) {
         return reject(err);
       }
       resolve(res);
     });
    });
  });
};

Mysql.shutdown = function () {
  pool.destroyAllNow();
};


/**
 * init database
 */
sqlClient.init = function(app) {
	if (!!pool) {
		return sqlClient;
	} else {
		Mysql.init(app);
		sqlClient.insert = Mysql.query;
		sqlClient.update = Mysql.query;
		sqlClient.delete = Mysql.query;
		sqlClient.query = Mysql.query;
		return sqlClient;
	}
};

/**
 * shutdown database
 */
sqlClient.shutdown = function(app) {
	sqlClient.shutdown(app);
};
