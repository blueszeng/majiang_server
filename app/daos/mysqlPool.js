"use strict";
var mysql = require('mysql');
var genericPool = require('generic-pool');
var Promise = require("bluebird");
var createPool = function (app) {
    var mysqlConfig = app.get('mysql').development;
    return genericPool.createPool({
      create: function() {
    	 return new Promise(function(resolve) {
          var client = mysql.createConnection({
    				host: mysqlConfig.host,
    				user: mysqlConfig.user,
    				password: mysqlConfig.password,
    				database: mysqlConfig.database
    			});
          client.connect(function(err) {
            if (err) {
              return console.error(err);
            }
            console.log('connect--->');
          });
          resolve(client);
        });
      },
      destroy: function(client) {
          return new Promise(function(resolve) {
              console.log('destroy--->');
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
