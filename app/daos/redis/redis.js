'use strict';
var redis = require('redis');
var bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
var client;
var init = function(app) {
  if (!!client) {
    return client;
  }
  var redisConfig = app.get('redis');
  client = redis.createClient(redisConfig, {});
  client.on('error', function (err) {
    console.log('Error ' + err);
  });
  client.on('connect', function () {
    console.log('connect redis ...');
  });
  return client;
};
module.exports = {
  init: init
};
