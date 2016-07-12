"use strict";
var schemas = require("../modules/database/schemas/");
var models = require("../modules/database/models/");
var mongoose =require('mongoose');


var User = mongoose.model('User', models.User);
var userDao = {};
userDao.add = function(){

}
userDao.findById = function(){};

//返回用户列表里的第一个。
/*userDao.findByUserName = function(username){*/
	userDao.findByUserName = (username) => {
	return new Promise(function(resolve,reject){
		User.find({ username: username }, function(err,users){
			console.log(users);
			if(!users){
				console.log("用户名不存在！！");
				reject(users);
			}else{
				console.log(users[0].password);
				resolve(users[0]);
			}
		})
	})
};
module.exports = userDao;