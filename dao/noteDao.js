"use strict";
var schemas = require("../modules/database/schemas/");
var models = require("../modules/database/models/");
var mongoose = require("mongoose");
var Note = mongoose.model('Note', models.Note);
var noteDao = {};



//返回用户列表里的第一个。

noteDao.findNoteById = (id) => {
	return new Promise(function(resolve,reject){
		Note.find({ _id: id }, function(err,notes){
			console.log(notes);
			if(!notes){
				console.log("用户名不存在！！");
				reject(notes);
			}else{
				console.log(notes[0]);
				resolve(notes[0]);
			}
		})
	})
};
module.exports = noteDao;