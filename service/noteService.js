"use strict";
var noteDao = require("../dao/noteDao");
var noteService = {}
noteService.findNoteById = (id) =>
	new Promise(function(resolve,reject){
		resolve(noteDao.findNoteById(id));
	});
module.exports = noteService;