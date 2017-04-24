'use strict';
var mysql = require('mysql');
var genericPool = require('generic-pool');
var Promise = require("bluebird");
var createPool = function (app) {
    var mysqlConfig = app.get('mysql');
    return genericPool.createPool({
      create: function () {
    	 return new Promise(function (resolve) {
          var client = mysql.createConnection({
    				host: mysqlConfig.host,
    				user: mysqlConfig.user,
    				password: mysqlConfig.password,
    				database: mysqlConfig.database
    			});
          client.connect(function (err) {
            if (err) {
              return console.error(err);
            }
            console.log('connect mysql ...');
          });
          resolve(client);
        });
      },
      destroy: function (client) {
          return new Promise(function(resolve) {
              console.log('destroy mysql connect...');
              resolve(client.end());
          });
      }
    },
    {
      max: 10,
      idleTimeoutMillis : 30000,
		  log : true,
      // min: 2
    });
};

exports.createMysqlPool = createPool;
