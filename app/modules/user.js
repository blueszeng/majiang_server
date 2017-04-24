 "use strict";
var constant = require('./constant');
var pomelo = require('pomelo');
var exp = module.exports;
var userPool = {};


exp.addUserInRoom  = function (mid, uid) {
  if (exp.getUserByUid(uid) === undefined) {
    userPool[uid] = {
      uid : uid,
      rid : 0,
      sid : 0,
      seatid : 0,
      isReady : 0,
      pais : {},
      activeTime : new Date()
    };
  }
};

exp.initUser  = function (uid) {
  var user = exp.getUserByUid(uid);
  if (user !== undefined) {
    user.isReady = constant.READY_STATUS.NO;
    user.pais = {};
    user.seatid = 0;
    user.activeTime = new Date();
  }
};

exp.updateUserData = function (uid, data) {
  var user = exp.getUserByUid(uid);
  if (user !== undefined) {
    return -1;
  }
  for (var i in data) {
    if (user[i] !== undefined) {
      user[i] = data[i];
    }

    if (i === "rid") {
      //update database
    }
  }
};

exp.deleteUser = function (uid) {
  if (userPool[uid] === undefined) {
    return -1;
  }
  delete userPool[uid];
  // 数据库干掉用户在房间的记录数据
}

exp.getUserByUid = function (uid) {
  return userPool[uid];
};
