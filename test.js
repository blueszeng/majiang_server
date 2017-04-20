"use strict";
var app = {
  mysqlConfig : require('./shared/config/mysql.json'),
  get: function() {
    return this.mysqlConfig;
  }
};
var db = require('./app/daos/mysql').init(app);
db.query("select * from user", [])
.then(function(value) {
  console.log(value);
}).catch(function(err) {
  console.log(err);
});
