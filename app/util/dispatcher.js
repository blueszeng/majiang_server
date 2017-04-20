"use strict";
var crc = require('crc');
module.exports.dispatch = function(key, list) {
	var index = Math.abs(parseInt(crc.crc32(key)), 16) % list.length;
	return list[index];
};
