"use strict";
var userDao = require("../dao/userDao");
// var async = require("async");
var userService = {};
userService.findByUserName = (username) =>
	new Promise(function(resolve,reject){
		resolve(userDao.findByUserName(username));
	});

/*userService.findByUserName = function(username){
	return new Promise(function(resolve,reject){
		resolve(userDao.findByUserName(username));
	});
}*/
module.exports = userService;