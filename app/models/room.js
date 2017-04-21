 'use strict';
var exp = module.exports;
var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger(__filename);
var constant = require('./constant');
var User = require('./user');

var rooms = {};

exp.getRooms = function () {
  return rooms;
};

exp.addNewRoom = function (rid) {
  exp.initRoom(rid);
};

exp.initRoom = function (rid, isReload) {
  isReload = isReload ? isReload : false;
  var userList = [];
  if (isReload && rooms[rid].userList) {
    userList = rooms[rid].userlist;
  }
  rooms[rid] = {
    rid : rid,
    sid : 0,
    status : constant.ROOM_STATUS.WAITING,
    userList : []
  };
  if (isReload && userList) {
    rooms[rid].userList = userList;
  }
};

exp.getRoom = function (rid) {
  var room = rooms[rid];
  if (room && room.rid === rid) {
    return room;
  }
};

exp.updateRoomData = function (rid, data) {
  var room = exp.getRoom(rid);
  if (room === undefined) {
    return -1;  //没找到房间
  }
  for (var key in data) {
    if (data[key] !== undefined) {
      room[key] = data[key];
    } else {
      // log data is undefined
      return -2;
    }
  }
  return 0;
};

exp.addUserToRoom = function (sid, rid, uid) {
  var room = exp.getRoom(rid);
  if (room === undefined) {
    return -1;
  }
  var currentUserCnt = room.userList;
  if (currentUserCnt >= constant.ROOM_CONF.maxUserCount) {
    return -2;
  }
  var seatid = exp.getSeatid(room, uid);
  if (seatid > 0) {
    return seatid;
  }
  seatid = 1;
  if (room.userList.length === 1) {
    var otherUser = User.getUserByUid(room.userList[0]);
    if (otherUser) {
      seatid = otherUser.seatid % constant.ROOM_CONF.maxUserCount + 1;
    }
  }
  room.userList.push(uid);

  var channelService = pomelo.app.get('channelService');
  // 取得一个channel
  var channel = channelService.getChannel(room.rid, false);
  if (!!channel) {
    channel.add(uid, sid);
  }
  return seatid;
};

exp.delRoomUser = function (sid, rid, uid) {
  var room = exp.getRoom(rid);
  if (room === undefined) {
    return -1;
  }
  var currentUserCnt = room.userList.length;
  if (currentUserCnt <= 0) {
    return -2;
  }
  var index = 0;
  index = room.userList.indexOf(uid);
  if (index !== -1) {
    room.userList.slice(index, 1);
  }

  var channelService = pomelo.app.get('channelService');
  // 取得一个channel
  var channel = channelService.getChannel(room.rid, false);
  if (!!channel) {
    channel.leave(uid, sid);
  }
  return index;
};

exp.getRoomUserCount = function (rid) {
  var room = exp.getRoom(rid);
  var count = 0;
  if (room === undefined) {
    return count;
  }
  if (room.userList.length > 0) {
    count = room.userList.length;
  }
  return count;
};

exp.getRoomUserReadyCount = function (rid) {
  var room = exp.getRoom(rid);
  var count = 0;
  if (room === undefined) {
    return count;
  }
  if (room.userList.length > 0) {
    for (var i in room.userList) {
      var user = User.getUserByUid(room.userList[i]);
      if (user && user.isReady === constant.READY_STATUS.YES) {
        count = count + 1;
      }
    }
  }
  return count;
};

exp.getRoomStatus = function (rid) {
  var room = exp.getRoom(rid);
  if (room === undefined) {
    return -1;
  }
  return room.status;
};

exp.setRoomStatus = function (rid, status) {
  var room = exp.getRoom(rid);
  if (room === undefined) {
    return false;
  }
  room.status = status;
  return true;
};

exp.getNextUser = function (rid, uid) {
  var nextIndex = 0;
  var nextUser;
  var room = exp.getRoom(rid);
  if (room === undefined) {
    return false;
  }
  var index = room.userList.indexOf(uid);
  if (index !== -1) {
    nextIndex = index % constant.ROOM_CONF.maxUserCount + 1;
    if (room.userList[nextIndex] !== undefined) {
      nextUser = User.getUserByUid(nextIndex);
    }
  }
  return nextUser;
};

exp.getSeatid = function (room, uid) {
  if (room === undefined) {
    return -1;
  }
  var user;
  if (~room.userList.indexOf(uid)) {
    user = User.getUserByUid(uid);
    if (user && user.rid === room.rid) {
      return user.seatid;
    }
  }
  return 0;
};

exp.getUidInSeat = function (room, seatid) {
  if (room === undefined) {
    return -1;
  }
  for (var i in room.userList) {
    var user = User.getUserByUid(room.userList[i]);
    if (user && user.seatid === seatid) {
      return room.userList[i];
    }
  }
  return 0;
};
