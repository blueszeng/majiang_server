'use strict';
var util = module.exports;
var Promise = require('bluebird');


// control variable of func "myPrint"
var isPrintFlag = false;
// var isPrintFlag = true;

/**
 * Check and invoke callback function
 */
util.invokeCallback = function(cb) {
  if(!!cb && typeof cb === 'function') {
    cb.apply(null, Array.prototype.slice.call(arguments, 1));
  }
};

/**
 * clone an object
 */
util.clone = function(origin) {
  if(!origin) {
    return;
  }

  var obj = {};
  for(var f in origin) {
    if(origin.hasOwnProperty(f)) {
      obj[f] = origin[f];
    }
  }
  return obj;
};

util.size = function(obj) {
  if(!obj) {
    return 0;
  }

  var size = 0;
  for(var f in obj) {
    if(obj.hasOwnProperty(f)) {
      size++;
    }
  }

  return size;
};

// print the file name and the line number ~ begin
function getStack() {
  var orig = Error.prepareStackTrace;
  Error.prepareStackTrace = function(_, stack) {
    return stack;
  };
  var err = new Error();
  Error.captureStackTrace(err, arguments.callee);
  var stack = err.stack;
  Error.prepareStackTrace = orig;
  return stack;
}

function getFileName(stack) {
  return stack[1].getFileName();
}

function getLineNumber(stack){
  return stack[1].getLineNumber();
}

util.rpcFuncPromisify = function (func, self) {
   return function () {
    var args = [];
    var len = arguments.length;
    for(var i = 0; i < len; i++) {
      args.push(arguments[i]);
    }
    return new Promise (function (resolve, reject) {
      var onCallBack = function(err, result) {
        if (!!err) {
          return reject(err);
        }
        if (arguments.length >= 3) {  //RPC 回调返回参数超过 3个 就返回一个数组
          var arryRes = [];
          for(var i = 1; i < arguments.length; i++) {
            arryRes.push(arguments[i]);
          }
          return resolve(arryRes);
        }
        resolve(result);
      };
      args.push(onCallBack);
      func.apply(self, args);
    });
  };
};

util.myPrint = function() {
  if (isPrintFlag) {
    var len = arguments.length;
    if(len <= 0) {
      return;
    }
    var stack = getStack();
    var aimStr = '\'' + getFileName(stack) + '\' @' + getLineNumber(stack) + ' :\n';
    for(var i = 0; i < len; ++i) {
      aimStr += arguments[i] + ' ';
    }
    console.log('\n' + aimStr);
  }
};
