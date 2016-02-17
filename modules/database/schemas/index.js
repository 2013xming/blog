var mongoose = require('mongoose');
var moduleExports = module.exports = {
	userSchema : mongoose.Schema({
		userName:String,
		password:String,
		deleted: { type:Boolean,default:false},

	}),
	noteSchema :mongoose.Schema({
		title : String,
		publishDate : { type: Date, default: Date.now },
		updated: { type: Date, default: Date.now },
		content:String,
		author:String,
		comment:String,
		introduction:String,
		introImage:String,
		deleted: { type:Boolean,default:false},
		type:[String],
		tags:[String],
	}),
	typeSchema :mongoose.Schema({
		type:String,
	}),
	tagSchema :mongoose.Schema({
		tag:String,
	}),
	pageViewSchema :mongoose.Schema({
		pageViewName:{ type:String,default:""},
		method : String,
		IP:String,
		path : String,     // /
		baseUrl:String,   //  /getnotes
		originalUrl : String,    // /getnotes?queryType=_id&value=555be85708a56d501d7d8d80
		deleted: { type:Boolean,default:false},
		viewDate : { type: Date, default: Date.now },
		viewDay : { type: String},
		province : {type:String},
	}),
	fileSchema : mongoose.Schema({
		fileId : String,
		originalFilename : String,
		savedFilename : String,
		uploadTime : { type: Date, default: Date.now },
		deleted: { type:Boolean,default:false}
	})
};
