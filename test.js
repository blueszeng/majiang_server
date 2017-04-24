"use strict";
var util = require('./app/utils/util')
// var app = {
//   mysql : require('./shared/config/mysql.json').development,
//   redis : require('./shared/config/redis.json').development,
//   get: function(config) {
//     return this[config];
//   }
// };
// var db = require('./app/daos/mysql/mysql').init(app);
// // 普通查询
// db.query("select * from user", [])
// .then(function(value) {
//   console.log(value);
// }).catch(function(err) {
//   console.log(err);
// });
//
// // 事务
// var search = function(query) {
//   return query("select * from user where name = 2234234234 ", [])
//         .then(function (value) {
//           console.log(value);
//           return query("select * from user", []);
//         });
// };
//
// db.beginTransaction(search)
// .then(function(v) {
//   console.log(v);
// }).catch(function (err) {
//   console.error(err);
// });
//
// /////redis
// var cache = require('./app/daos/redis/redis').init(app);
// cache.getAsync('foo')
// .then(function(res){
//   console.log(res);
// });

var t = {
  c : 1234,
  acs : function (a, b, cb) {
    cb(null, 2);
  }
}
var acs = util.rpcFuncPromisify(t.acs, t);
// console.log(acs(1, 2))
acs(1, 2).then(function(value){
  console.log("vvv", value);
}).catch(function(err) {
  console.log('err:' + err);
});
// t.acs(1, 3, function (value) {
//   console.log(value);
// });
