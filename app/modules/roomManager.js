var module.exports;
var pomelo = require('pomelo');

var rooms = {}
exp.getRooms = function () {

}

// 2、如何进入房间
// 在同一局游戏中，我们要求所有人都在同一个房间中，
// 我们可以规定在同一个房间中的用户，必须登陆到同一台物理服务器上面。
// 在创建房间完成之后，其他人根据房间号查找房间的时候，
// 可以根据房间号，获取这个房间所在的服务器ip和端口，
// 判断一个当前用户登陆的服务器ip与房间所在的服务器ip是否相同，
// 如果相同，就不做切换，如果不一样，客户端就使用ip和端口，
// 连接到房间所在的服务器上面。

/**
 * [通过用户创建一个房间]
 * @param  {[object]} user [description]
 * @return {[undefined]}      [description]
 */
exp.createRoomByUser = function (user) {
  var room = {};
  room.createUser = user.uid;
  room.id = user.rid;
  // room add user
  room.users = {}
  room.users[user.uid] = user;
  room.number = 1;

  // add room
  rooms[room.id] = room;

  var channelService = pomelo.app.get('channelService');
  var channel = channelService.getChannel(room.id, true);
  if (!!channel) {
    channel.add(user.uid, user.sid);
  }
}

/**
 * [删除房间，当此房间人数为零的时候，需要删除此房间]
 * @param  {[int]} rid [房间id]
 * @return {[bool]}     [description]
 */
exp.removeRoom = function (rid) {
  var room = rooms[rid];
  if (!room) {
    return false;
  }
  delete rooms[rid];
  return true;
}

/**
 * [新用户 加入到一个已经存在的房间中]
 * @param  {[object]} user [description]
 * @return {[type]}      [description]
 */
exp.addUserToRoom = function (user) {
  var room = rooms[user.rid];
  if (!room) {
    return false;
  }
  // room add user
  rooms[user.rid].users[user.uid] = user;
  rooms[user.rid].number = rooms[user.rid] = rooms[user.rid].number + 1;

  var channelService = pomelo.app.get('channelService');
  // 取得一个channel
  var channel = channelService.getChannel(rooms[user.rid].id, false);
  if (!!channel) {
    channel.add(user.uid, user.sid);
  }
}

/**
 * [删除房间中的一用户]
 * @param  {[object]} user [description]
 * @return {[type]}      [description]
 */
exp.removeUserFromRoom = function (user) {
  var room = rooms[user.rid];
  if (!room) {
    return false;
  }
  //删除该用户
  delete rooms[user.rid].users[user.uid];
  rooms[user.rid].number = rooms[user.rid].number - 1;

  var channelService = pomelo.app.get('channelService');
  var channel = channelService.getChannel(rooms[user.rid].id, false);
  if (!!channel) {
    channel.leave(user.uid, user.sid);
  }
}

/**
 * [删除某一个房间]
 * @param  {[int]} rid [description]
 * @return {[type]}     [description]
 */
exp.removeRoomByRid = function (rid) {
  var room = rooms[rid];
  if (!room) {
    return false;
  }
  delete rooms[rid];
  return true;
}
