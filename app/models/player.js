var exp = module.exports;
var users = {};

exp.getUsers = function () {
  return users;
}

exp.addUser = function (user) {
  if (!(user && user.uid)) {
    return false
  }
  if (users[user.uid]) {
    return false;

  }
  user[user.uid] = user;
  return true;
}


exp.removeUser = function (uid) {
  var user = users[uid];
  if (user) {
    return false;
  }
  delete users[uid];
  return true;
}

exp.updateUser = function (e) {
  if (!(user && user.uid)) {
    return false;
  }
  if (users[user.uid]) {
    users[user.uid] = user;
    return true;
  }
  return false;
}
