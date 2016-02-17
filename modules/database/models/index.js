var mongoose = require('mongoose');
var schemas = require("../schemas/");
module.exports = {
	User : mongoose.model("User",schemas.userSchema),
	Note : mongoose.model("Note",schemas.noteSchema),
	Type : mongoose.model("Type",schemas.typeSchema),
	Tag : mongoose.model("Tag",schemas.tagSchema),
	PageView : mongoose.model("PageView",schemas.pageViewSchema),
	File : mongoose.model("File",schemas.fileSchema)
};