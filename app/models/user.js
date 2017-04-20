var exp = module.exports;
var pomelo = require('pomelo');

var userPool = {}


exp.addUserInNormal  = function (uid) {

}

exp.getUserByUid = (uid) {
  return userPool[uid]
}
