"use strict";
var express = require('express');
var schemas = require("../modules/database/schemas/");
var models = require("../modules/database/models/");
var mongoose =require('mongoose');
var session = require('express-session');
var fs = require("fs");
var multiparty = require('multiparty');
var fileLogs = require("../logs/index");
var EventProxy = require('eventproxy');
var ep = new EventProxy();
require('../modules/self/dateFormat.js');
var jqueryTool = require('./jqueryTool');
var fileLogs = require("../logs/index");
var Global_Index = 0;

var userService = require("../service/userService");
var noteService = require("../service/noteService");
/*var getNoteTypes = function(){
	console.log("getNoteTypes");
	var type = mongoose.model('Type',models.Type);
	var typeList = [];
	type.find({},function(err,result){

		if(result.length == 0)
			return typeList;
		else{
			for(var i=0,len=result.length;i<len;i++){
				typeList.push(result[i].type);
			}
		}

		ep.emit("getType", typeList);
//		return typeList;
		
	});
};
var	getNoteTags = function(){
	console.log("getNoteTags");
	var tag = mongoose.model('Tag',models.Tag);
	var tagList = [];
	tag.find({},function(err,result){

		if(result.length == 0)
			return tagList;
		else{
			for(var i=0,len=result.length;i<len;i++){
				tagList.push(result[i].tag);
			}
		}
		ep.emit("getTag", tagList);
//		return tagList;
		
	});

};
*/

// 根据笔记类型统计所有类型及相应类型笔记数量
var getNoteTypes = function(eventProxyIndex){
//	console.log("enter getNoteTypes");
	var note = mongoose.model('Note',models.Note);
//	var type = mongoose.model('Type',models.Type);
//	var typeList = [];
	var types={};
	note.find({deleted:false},function(err,result){

		if(result.length != 0){
			for(var i in result){
				let tps =  result[i].type;
				for(var j=0,len=tps.length;j<len;j++){    //for(var j in tps){}  会出现很多隐藏的属性
					if(!types[tps[j]]){
						types[tps[j]] = 1;
					}else{
						types[tps[j]] ++;
					}
				}
				
			}  //end for result
		} //end if
//		console.log("getNoteTypes:");
//		console.log(types);
		ep.emit(eventProxyIndex,types);
	});
};



// 根据笔记标签统计所有标签及相应类型笔记数量
var	getNoteTags = function(eventProxyIndex){
//	console.log("enter getNoteTags");
	var note = mongoose.model('Note',models.Note);
//	var typeList = [];
	var tags = {};
	note.find({deleted:false},function(err,result){
		if(result.length != 0){
			for(var i in result){
				var tgs =  result[i].tags;
				for(var j=0,len=tgs.length;j<len;j++){    //for(var j in tps){}  会出现很多隐藏的属性
					if(!tags[tgs[j]]){
						tags[tgs[j]] = 1;

					}else{
						tags[tgs[j]] ++;
					}
				}
				
			}  //end for result
		} //end if
//		console.log("getNoteTags:");
//		console.log(tags);
		ep.emit(eventProxyIndex,tags);
	});
};

// 根据笔记时间统计所有归档及相应归档笔记数量
var	getArchives = function(eventProxyIndex){
//	console.log("enter getArchives");
	var note = mongoose.model('Note',models.Note);
//	var monthList = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var monthList = ["01","02","03","04","05","06","07","08","09","10","11","12"];
	var archives = {};
	note.find({deleted:false}).sort({publishDate:'desc'}).exec(function(err,result){
		if(result.length != 0){
			for(var i in result){
				var pDate =  result[i].publishDate;
				var arc = pDate.getFullYear() + "/" +monthList[pDate.getMonth()];
				if(!archives[arc])
					archives[arc] = 1;
				else archives[arc] ++;
			}  //end for result
		} //end if
//		console.log("getNoteTags:");
//		console.log(tags);
		ep.emit(eventProxyIndex,archives);
	});
};
function getLatestNotes(eventProxyIndex){
	var note = mongoose.model('Note',models.Note);
//	var latestNotes = {};
	note.find({deleted:false}).sort({publishDate:'desc'}).exec(function(err,result){
		if(result.length != 0){
			var res = result.slice(0,5);
			var rs = [];
			for(var i in res){
				rs.push({_id:res[i]._id,title:res[i].title});
			}
		} //end if
//		console.log("getNoteTags:");
//		console.log(tags);
console.log(rs);
		ep.emit(eventProxyIndex,rs);
	});
};
var manageNote = function(req,res){
	res.render('admin/manageNote');
};
/*  var getNote = function(queryname,queryvalue,pageNum,pageSize){
	var note = getNotes(queryname,queryvalue,pageNum,pageSize);
	ep.emit("getNote",note);
};  */
module.exports = {
	admin:{
		index : function(req,res){
			res.render('admin/index',{title:"管理页"});
		},
		addNoteType : function(req,res){
			var types = req.body.types || [];
			var type = mongoose.model('Type',models.Type);
			//使用闭包函数将索引值 t 正确传入。 
			var callback = function(types,t){
				return function(err,result){
					if(!result){
						models.Type({type:types[t]}).save(function(err){
							if(err) return console.error(err);
							console.log("save type success.");
						});
					}
				}
				
			}; 
			for(var t in types){
				type.findOne({type:types[t]},callback(types,t));
			}
		},
		addNoteTags : function(req,res){
			var tags = req.body.tags || [];
			var tag = mongoose.model('Tag',models.Tag);
			//使用闭包函数将索引值 t 正确传入。 
			var callback = function(tags,t){
				return function(err,result){
					if(!result){
						models.Tag({tag:tags[t]}).save(function(err){
							if(err) return console.error(err);
							console.log("save type success.");
						});
					}
				}
				
			}; 
			for(var t in tags){
				//需要使用闭包
				tag.findOne({tag:tags[t]},callback(tags,t));
			}
			res.send({success:"ture"}); 
		},
/*		getNoteTypes : getNoteTypes,
		getNoteTags :getNoteTags,
		getTypeTags : function(req,res){
			var test = [];
			ep.all('getType','getTags',function (typeList,tagList) {
			  // TODO 
			  	console.log("eventproxy");
			  	test = test.concat(typeList);
				test = test.concat(tagList);
			 	res.send({data:test}); 
			});
			getNoteTypes();
			getNoteTags(); 
		},*/
		getNoteTypes : getNoteTypes,
		getNoteTags :getNoteTags,
		newNote : function(req,res){
			console.log("newNote!");
			res.render('admin/newNote');
		},
		manageNote : manageNote,
 	},

};
module.exports.admin.logout = function(req,res){
	req.session.user = null;
	res.redirect('/admin/index');
}
module.exports.admin.editNote = function(req,res){
	var _id = req.query._id;
	var url = 'admin/editNote';
	res.render(url,{_id:_id});
};
module.exports.admin.updateNote = function(req,res){
	var _id = req.body._id ;
	var title = req.body.noteTitle ;
	var content = req.body.noteContent;
	var types = req.body.types;
	var tags = req.body.tags;
	var author = req.body.author;
	var introduction = req.body.introduction;
	var introImage = req.body.introImage;
	var update = {
		title : title,
		type : types,
		tags  : tags,
		author : author,
		content : content,
		introduction : introduction,
		introImage : introImage
	}
	var note = mongoose.model('Note',models.Note);
	note.findByIdAndUpdate(_id,update,function(err,result){
		console.log("findByIdAndUpdate");
		console.log(result);
		if(!err)
			res.send({status:'success'});
	});

 //res.send({status:'success'});
};
module.exports.admin.indexNew = function(req,res){
	console.log("index_new");
	res.render('admin/index_new');
}
module.exports.admin.newNoteNew = function(req,res){
	res.render('admin/newNoteNew');
}
module.exports.admin.welcome = function(req,res){
	res.render('admin/welcome');
}
module.exports.admin.noteList = function(req,res){
	res.render('admin/note-list');
}
//笔记删除操作只是把删除标记置为true,并不真正删除记录 
module.exports.admin.deleteNote = function(req,res){
	var _id = req.query._id;
	var note = mongoose.model('Note',models.Note);
	note.findByIdAndUpdate(_id, {deleted:true},function(err,result){
		console.log("findByIdDelete");
		console.log(result);
		if(!err)
			res.send({status:'success'});
	});
}
module.exports.note={};
module.exports.note.index = function(req,res){
	var eventProxyIndex1 = getEventProxyIndex();
	var eventProxyIndex2 = getEventProxyIndex();
	var eventProxyIndex3 = getEventProxyIndex();
	var eventProxyIndex4 = getEventProxyIndex();
	ep.all(eventProxyIndex1,eventProxyIndex2,eventProxyIndex3,eventProxyIndex4,function (types,tags,archives,latestNotes){
		var nav_head = "index";
		var SEO_description = '钰溪笔谈,yuxiblog,yuxiblog.cn,前端随笔,前端博客,yuxi';
		res.render('index',{nav_head:nav_head,types:types,tags:tags,archives:archives,latestNotes:latestNotes,SEO_description:SEO_description});
	});
	getNoteTypes(eventProxyIndex1);
	getNoteTags(eventProxyIndex2);
	getArchives(eventProxyIndex3);
	getLatestNotes(eventProxyIndex4);
};

module.exports.note.show = function(req,res){
//	var id = req.query.id;
/*	ep.all('getTypes','getTags','getArchives','getNotes',function (types,tags,archives,data){

		res.render('note',{types:types,tags:tags,archives:archives,note:data.notes});
	});*/
var pageNum = req.query.pageNum;
	var pageSize = req.query.pageSize;
	var queryname = decodeURIComponent(req.query.type);
	var queryvalue = decodeURIComponent(req.query.queryStr);
	var eventProxyIndex5 = getEventProxyIndex();
/*	ep.all(eventProxyIndex,function(data){
		res.send({status:"success",notes:data.notes,totalSize:data.size,end:data.end});
	});
	*/
	
	var eventProxyIndex1 = getEventProxyIndex();
	var eventProxyIndex2 = getEventProxyIndex();
	var eventProxyIndex3 = getEventProxyIndex();
	var eventProxyIndex4 = getEventProxyIndex();
	ep.all(eventProxyIndex1,eventProxyIndex2,eventProxyIndex3,eventProxyIndex4,eventProxyIndex5,function (types,tags,archives,latestNotes,data){
		var nav_head = "index";
		var title = data.notes[0].title;
		var SEO_description = title + ',' + data.notes[0].introduction;
		res.render('note',{nav_head:nav_head,types:types,tags:tags,archives:archives,latestNotes:latestNotes,SEO_description:SEO_description});
	});
	getNoteTypes(eventProxyIndex1);
	getNoteTags(eventProxyIndex2);
	getArchives(eventProxyIndex3);
	getLatestNotes(eventProxyIndex4);
	getNotes(queryname,queryvalue,pageNum,pageSize,eventProxyIndex5);
//	getNotes("_id",id);
};

module.exports.note.webDescription = function(req,res){
	var eventProxyIndex1 = getEventProxyIndex();
	var eventProxyIndex2 = getEventProxyIndex();
	var eventProxyIndex3 = getEventProxyIndex();
	var eventProxyIndex4 = getEventProxyIndex();
	ep.all(eventProxyIndex1,eventProxyIndex2,eventProxyIndex3,eventProxyIndex4,function (types,tags,archives,latestNotes){
		var nav_head = "nav_des";
		var SEO_description = '钰溪笔谈,yuxiblog,yuxiblog.cn,前端随笔,前端博客,yuxi';
		res.render('webDescription',{nav_head:nav_head,types:types,tags:tags,archives:archives,latestNotes:latestNotes,SEO_description:SEO_description});
	});
	getNoteTypes(eventProxyIndex1);
	getNoteTags(eventProxyIndex2);
	getArchives(eventProxyIndex3);
	getLatestNotes(eventProxyIndex4);
};
module.exports.note.aboutAuthor = function(req,res){
	var eventProxyIndex1 = getEventProxyIndex();
	var eventProxyIndex2 = getEventProxyIndex();
	var eventProxyIndex3 = getEventProxyIndex();
	var eventProxyIndex4 = getEventProxyIndex();
	ep.all(eventProxyIndex1,eventProxyIndex2,eventProxyIndex3,eventProxyIndex4,function (types,tags,archives,latestNotes){
		var nav_head = "nav_author";
		var SEO_description = '钰溪笔谈,yuxiblog,yuxiblog.cn,前端随笔,前端博客,yuxi';
		res.render('aboutAuthor',{nav_head:nav_head,types:types,tags:tags,archives:archives,latestNotes:latestNotes,SEO_description:SEO_description});
	});
	getNoteTypes(eventProxyIndex1);
	getNoteTags(eventProxyIndex2);
	getArchives(eventProxyIndex3);
	getLatestNotes(eventProxyIndex4);
};
/*module.exports.note.aboutAuthor = function(req,res){
	var eventProxyIndex1 = getEventProxyIndex();
	var eventProxyIndex2 = getEventProxyIndex();
	var eventProxyIndex3 = getEventProxyIndex();
	var eventProxyIndex4 = getEventProxyIndex();
	ep.all(eventProxyIndex1,eventProxyIndex2,eventProxyIndex3,eventProxyIndex4,function (types,tags,archives,latestNotes){
		var nav_head = "nav_author";
		res.render('aboutAuthor',{nav_head:nav_head,types:types,tags:tags,archives:archives,latestNotes:latestNotes});
	});
	getNoteTypes(eventProxyIndex1);
	getNoteTags(eventProxyIndex2);
	getArchives(eventProxyIndex3);
	getLatestNotes(eventProxyIndex4);
};*/
module.exports.note.moblieExample = function(req,res){
	res.render('moblieExample');
};

module.exports.note.ajaxGetNotes = function(req,res){
	//当前仅用来处理单一query，不适用多query
//	console.log("enter noteshow");
	var pageNum = req.query.pageNum;
	var pageSize = req.query.pageSize;
	var queryname = decodeURIComponent(req.query.queryType);
	var queryvalue = decodeURIComponent(req.query.value);
	var eventProxyIndex = getEventProxyIndex();
	ep.all(eventProxyIndex,function(data){
		res.send({status:"success",notes:data.notes,totalSize:data.size,end:data.end});
	});
	
	getNotes(queryname,queryvalue,pageNum,pageSize,eventProxyIndex);
//	res.send({status:"success",notes:result,totalSize:size,end:end});
/*	for(var q in reqQuery){
		var queryname = q;
		var queryvalue = decodeURIComponent(reqQuery[q]);
	} */
/*	var note = mongoose.model('Note',models.Note);
	note.find({$queryname:"nodejs"},function(err,result){
		console.log(result);
		res.send({status:"success"});
	}); */
/*	if(queryname=="time"){
		note.find().sort({publishDate:'desc'}).exec(function(err,result){
			console.log(result);
			var rs = result || [];
			var size = rs.length;
			var start = pageNum*pageSize,end = ((pageNum+1)*pageSize)>size ? size : (pageNum+1)*pageSize;
			rs = rs.slice(start,end);
			res.send({status:"success",notes:rs,totalSize:size,end:end});
		});
	}else{
		note.find().$where("this."+queryname+".indexOf('"+ queryvalue +"')>=0").sort({publishDate:'desc'}).exec(function(err,result){
			console.log(result);

			var rs = result ||[];
			var size = rs.length;
			var start = pageNum*pageSize,end = ((pageNum+1)*pageSize)>size ? size : (pageNum+1)*pageSize;
			rs = rs.slice(start,end);
			res.send({status:"success",notes:rs,totalSize:size,end:end});
		});*/
};
module.exports.note.save = function(req,res){

}
/*百度站点验证文件*/
module.exports.note.baidu_verify = function(req,res){
	res.render('baidu_verify_0b7LFFaOU4');
}
module.exports.note.ajaxGetPageViewByDate = function(req,res){
	var startTime = req.query.startDate ? new Date(req.query.startDate) : new Date("1990-01-01");
	var endTime = req.query.endDate ? new Date(req.query.endDate) : new Date();
	var pvs = [];
	var pageView = mongoose.model('PageView',models.PageView);
	pageView.aggregate(
				{$match:{viewDate:{$gte: startTime, $lte: endTime}}},
				{ $project:{ _id: 1,IP:1,viewDay:1,viewDate:1}},
//				{ $unwind : "$viewDay" },
				{$group:{_id:"$viewDay",viewDates:{ $addToSet : "$viewDate"}}},
				function(err, result){console.log(result);
					jqueryTool.each(result,function(index,item){
						pvs.push([item._id,item.viewDates.length]);
					});
					fileLogs.fileLog(result);
					pvs = pvs.sort(function(a,b){return (new Date(a[0])-new Date(b[0]))});
					res.send({status:'success',pvs:pvs});
			})
/*	var eventProxyIndex = getEventProxyIndex();
	ep.all(eventProxyIndex,function(data){
		res.send({status:"success",pvs:data});
	});
 	asyncGetPageViews(eventProxyIndex);*/
};
module.exports.note.ajaxGetPageViewByIP = function(req,res){
	var startTime = req.query.startDate ? new Date(req.query.startDate) : new Date("1990-01-01");
	var endTime = req.query.endDate ? new Date(req.query.endDate) : new Date();
	var pvs = [];
	var pageView = mongoose.model('PageView',models.PageView);
	pageView.aggregate(
				{$match:{viewDate:{$gte: startTime, $lte: endTime}}},
				{ $project:{ _id: 1,IP:1,viewDay:1,viewDate:1}},
//				{ $unwind : "$viewDay" },
				{$group:{_id:"$IP",viewDates:{ $addToSet : "$viewDate"}}},
				function(err, result){console.log(result);
					jqueryTool.each(result,function(index,item){
						pvs.push([item._id,item.viewDates.length]);
					});
					fileLogs.fileLog(result);
					pvs = pvs.sort(function(a,b){return (new Date(a[0])-new Date(b[0]))});
					res.send({status:'success',pvs:pvs});
			})
}
module.exports.note.ajaxGetPageViewRecord = function(req,res){
	var startTime = req.query.startDate ? new Date(req.query.startDate) : new Date("1990-01-01");
	var endTime = req.query.endDate ? new Date(req.query.endDate) : new Date();
	var pvs = [];
	var pageView = mongoose.model('PageView',models.PageView);
	pageView.find({viewDate:{$gte: startTime, $lte: endTime}}).select("-_id IP baseUrl viewDay province").sort({viewDate:"asc"}).exec(function(err, result){
		if(err){
			res.send({status:'false',pvs:pvs});
		}
		pvs = result;
		res.send({status:'success',pvs:pvs});
//		setTimeout(function(){res.send({status:'success',pvs:pvs});},4000);
	});
/*	pageView.aggregate(
				{$match:{viewDate:{$gte: startTime, $lte: endTime}}},
				{ $project:{ _id: 1,IP:1,viewDay:1,viewDate:1}},
//				{ $unwind : "$viewDay" },
				{$group:{_id:"$IP",viewDates:{ $addToSet : "$viewDate"}}},
				function(err, result){console.log(result);
					jqueryTool.each(result,function(index,item){
						pvs.push([item._id,item.viewDates.length]);
					});
					fileLogs.fileLog(result);
					pvs = pvs.sort(function(a,b){return (new Date(a[0])-new Date(b[0]))});
					res.send({status:'success',pvs:pvs});
			})*/
}
/*function asyncGetPageViews(eventProxyIndex){
	var pvs = {};
	var pageView = mongoose.model('PageView',models.PageView);
	pageView.aggregate().group({_id:"$viewDay",sum:{$add}}).exec(function (err, result) {
	    console.log(result); // [ { maxBalance: 98 } ]
	    for(var i=0,len=result.length;i<len;i++){
	    	var re = result[i];
			if (re._id!=null){
				pageView.count({viewDay:re._id}).count(function(er,resu){
		    		console.log(resu);
		    		pvs[re._id] = resu;
	    		});
			}
	    }
	    console.log(pvs);
	    ep.emit(eventProxyIndex,pvs);
	});
//	pageView.find({deleted:'false'}).distinct('originalUrl',getPageViewCallback);
};	*/
function getPageViewCallback(err,res){
	console.log(res);
};
/*	note.find().$where("this."+queryname+".indexOf("+ queryvalue +")>=0").exec(function(err,result){
		console.log(result);
		var rs = result ||[];
		res.send({status:"success",notes:result});
	})
};*/
var getEventProxyIndex = function(){
	if(Global_Index>1000000)
		Global_Index = 0;
	return new Date().getTime().toString() + (Global_Index++);
};
var getNotesCallback = function(pageNum,pageSize,eventProxyIndex){
	return function(err,result){
//		console.log(result);
		var rs = [];
		// result 为非数组对象时，构造数组结果
		if(result && jqueryTool.type(result)==='object'){
			rs.push(result);
		}else{
			rs = result || [];
		}
//		var rs = result || [];
		var size = rs.length;
		var start = 0,end=size;
		if(pageNum && pageSize){
			start = Number(pageNum)*Number(pageSize);
			end = ((Number(pageNum)+1)*Number(pageSize))>size ? size : (Number(pageNum)+1)*Number(pageSize);
			console.log("....pageNum:"+pageNum +"end:"+end);
		}
		console.log("pageNum:"+pageNum +"end:"+end);
		rs = rs.slice(start,end);
		var data = {notes:rs,size:size,end:end};
		ep.emit(eventProxyIndex,data);
	}
};
var getNotesByMonth = function(pageNum,pageSize,eventProxyIndex,order,month){
	var note = mongoose.model('Note',models.Note);
	var startTime = new Date(month),endTime = new Date(month);
	endTime = new Date(end.setMonth(end.getMonth()+1));
	var od = order || "desc";
	note.find({publishDate:{$gte: startTime, $lte: endTime}}).sort({publishDate:order}).exec(getNotesCallback(pageNum,pageSize,eventProxyIndex));
};
var getNotesByTime = function(pageNum,pageSize,eventProxyIndex,order,startTime,endTime){
	var note = mongoose.model('Note',models.Note);
	var start = startTime ? new Date(startTime) : new Date(0);
	var end = endTime ? new Date(endTime) : new Date();
	var od = order || "desc";
	note.find({publishDate:{$gte: start, $lte: end}}).sort({publishDate:order}).exec(getNotesCallback(pageNum,pageSize,eventProxyIndex));
};
var getNotesById = function(pageNum,pageSize,eventProxyIndex,order,id){
	var note = mongoose.model('Note',models.Note);
	note.findById({'_id':id}).exec(getNotesCallback(pageNum,pageSize,eventProxyIndex));
};

var getNotes = function(queryname,queryvalue,pageNum,pageSize,eventProxyIndex){
	var note = mongoose.model('Note',models.Note);
	if(queryname=="time"){       //按时间查询,包括默认查询和归档查询
		if(queryvalue){			//归档查询
			var start =new Date(queryvalue),end = new Date(queryvalue);
			end = new Date(end.setMonth(end.getMonth()+1));
			console.log(start);
			console.log(end);
			note.find({publishDate:{$gte: start, $lte: end},deleted:'false'}).select("-content").sort({publishDate:'desc'}).exec(getNotesCallback(pageNum,pageSize,eventProxyIndex));
		}else{			//默认时间查询，查询所有
			note.find({deleted:'false'}).select("-content").sort({publishDate:'desc'}).exec(getNotesCallback(pageNum,pageSize,eventProxyIndex));
		}
		
	}else if(queryname == "_id"){   //id或者title等的准确查询
			console.log("queryname:"+queryname);
			console.log("queryvalue:"+queryvalue);
			note.findById({'_id':queryvalue,deleted:'false'}).exec(getNotesCallback(pageNum,pageSize,eventProxyIndex));
	}else{				//分类、标签等包含类查询
		note.find().$where("this."+queryname+".indexOf('"+ queryvalue +"')>=0 && this.deleted ==false").select("-content").sort({publishDate:'desc'}).exec(getNotesCallback(pageNum,pageSize,eventProxyIndex));
	}
};

/**
var getNotes = function(queryname,queryvalue,pageNum,pageSize){
	var note = mongoose.model('Note',models.Note);
	if(queryname=="time"){       //按时间查询,包括默认查询和归档查询
		if(queryvalue){			//归档查询
			var start =new Date(queryvalue),end = new Date(queryvalue);
			end = new Date(end.setMonth(end.getMonth()+1));
			console.log(start);
			console.log(end);
			note.find({publishDate:{$gte: start, $lte: end}}).sort({publishDate:'desc'}).exec(function(err,result){
			console.log(result);
			var rs = result || [];
			var size = rs.length;
			var start = 0,end=size;
			if(pageNum && pageSize){
				start = pageNum*pageSize,end = ((pageNum+1)*pageSize)>size ? size : (pageNum+1)*pageSize;
			}
			rs = rs.slice(start,end);
			var data = {notes:rs,size:size,end:end};
			ep.emit("getNotes",data);
			});
		}else{			//默认时间查询，查询所有
			note.find().sort({publishDate:'desc'}).exec(function(err,result){
			console.log(result);
			var rs = result || [];
			var size = rs.length;
			var start = 0,end=size;
			if(pageNum && pageSize){
				start = pageNum*pageSize,end = ((pageNum+1)*pageSize)>size ? size : (pageNum+1)*pageSize;
			}
			rs = rs.slice(start,end);
			var data = {notes:rs,size:size,end:end};
			ep.emit("getNotes",data);
			});
		}
		
	}else if(queryname == "_id"){   //id或者title等的准确查询
			console.log("queryname:"+queryname);
			console.log("queryvalue:"+queryvalue);
			note.findById({'_id':queryvalue}).exec(function(err,result){
			console.log(result);
			var rs = result || [];
<!--			var size = rs.length;
			var start = 0,end=size;
			if(pageNum && pageSize){
				start = pageNum*pageSize,end = ((pageNum+1)*pageSize)>size ? size : (pageNum+1)*pageSize;
			}
			rs = rs.slice(start,end);  
-->
			var data = {notes:rs,size:1,end:1};
			ep.emit("getNotes",data);
		});
	}else{				//分类、标签等包含类查询
		note.find().$where("this."+queryname+".indexOf('"+ queryvalue +"')>=0").sort({publishDate:'desc'}).exec(function(err,result){
			console.log(result);

			var rs = result ||[];
			var size = rs.length;
			var start = 0,end=size;
			if(pageNum && pageSize){
				start = pageNum*pageSize,end = ((pageNum+1)*pageSize)>size ? size : (pageNum+1)*pageSize;
			}
			rs = rs.slice(start,end);
			var data = {notes:rs,size:size,end:end};
			ep.emit("getNotes",data);
		});
	}
};
*/

module.exports.note.chartShow = function(req,res){
	var eventProxyIndex1 = getEventProxyIndex();
	var eventProxyIndex2 = getEventProxyIndex();
	var eventProxyIndex3 = getEventProxyIndex();
	var eventProxyIndex4 = getEventProxyIndex();
	ep.all(eventProxyIndex1,eventProxyIndex2,eventProxyIndex3,eventProxyIndex4,function (types,tags,archives,latestNotes){
		var nav_head = "chartshow";
		res.render('chartShow',{nav_head:nav_head,types:types,tags:tags,archives:archives,latestNotes:latestNotes});
	});
	getNoteTypes(eventProxyIndex1);
	getNoteTags(eventProxyIndex2);
	getArchives(eventProxyIndex3);
	getLatestNotes(eventProxyIndex4);
}
module.exports.note.index_new = function(req,res){
	res.render('index1');
}


module.exports.admin.uploadImage = function(req,res){
	console.log(req.files);
	var form = new multiparty.Form({uploadDir:'./'});
		form.parse(req, function(err, fields, files) {
			console.log(files);
	    var filesTmp = JSON.stringify(files,null,2);
	    	console.log(files);
	    if(err){
	      console.log('parse error: ' + err);
	    } else {
	      console.log('parse files: ' + filesTmp);
	      var inputFile = files.file[0];
	      console.log(inputFile.path);
	      var exg = /\.[a-z]+/i;
	      var uploadedPath = inputFile.path;
	      var extension = exg.exec(inputFile.originalFilename)[0];
	      var fileId = new Date().getTime();
	      var dstPath = './public/images/upload/' + fileId + extension;
	      //重命名为真实文件名
	      fs.rename(uploadedPath, dstPath, function(err) {
	        if(err){
	          console.log('rename error: ' + err);
	        } else {
	          console.log('rename ok');
	        }
	      });
	      var file = new models.File({ 
			    fileId : fileId,
				originalFilename : inputFile.originalFilename,
				savedFilename : dstPath,
			});
			file.save(function (err) {
				if (err) return console.error(err);
			});  
	    }

	    res.send(JSON.stringify({status:'success',id:fileId}));
/*	    res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
	    res.write('received upload:\n\n');
	    res.end(util.inspect({fields: fields, files: filesTmp}));*/
	 });
}
module.exports.note.getImage = function(req,res){
//	console.log(new Date().format("yyyy-M-d"));
	var id = req.query.imgId;
	var file = mongoose.model('File',models.File);
	file.find({fileId:id}).exec(function(err,result){
//		console.log(result);
		if(result.length>0){
			var re = result[0];
			fs.readFile(re.savedFilename, function(error, file) {
				 if(error) { 
		//	      response.writeHead(500, {"Content-Type": "text/plain"}); 
		//	      response.write(error + "\n"); 
		//	      response.end(); 
					console.log(error);
			    } else { 
		//	      res.writeHead(200, {"Content-Type": "image/png"}); 
			      res.write(file, "binary"); 
			      res.end(); 
			    } 
			});
		}else{
			res.writeHead(400, {"Content-Type": "text/plain"}); 
			res.write("error:not found." + "\n"); 
			res.end();
		}
		
	});
//	console.log(__dirname + '/public/images/upload/' + id);
//	var state = fs.existsSync('./public/images/upload/' + id);
	
//	res.send(JSON.stringify({status:'success',state:state}));
};
module.exports.note.downloadTestApp = function(req,res){
	var realpath = "public/apps/android-test.apk";
	var filename = "android-test.apk";
	res.download(realpath,filename,function(err){
		if(err){
			console.log(err);
		}else{
			console.log("success");
		}
	});
};


module.exports.note.uploadImage = function(req,res){
	console.log(req.files);
//	res.send(JSON.stringify({status:'success'}));
	var form = new multiparty.Form({uploadDir:'./'});
		form.parse(req, function(err, fields, files) {
			console.log(files);
	    var filesTmp = JSON.stringify(files,null,2);
	    	console.log(files);
	    if(err){
	      console.log('parse error: ' + err);
	    } else {
	      console.log('parse files: ' + filesTmp);
	      var inputFile = files.file[0];
	      console.log(inputFile.path);
	      var exg = /\.[a-z]+/i;
	      var uploadedPath = inputFile.path;
	      var extension = exg.exec(inputFile.originalFilename)[0];
	      var fileId = new Date().getTime();
	      var dstPath = './public/images/upload/' + fileId + extension;
	      //重命名为真实文件名
	      fs.rename(uploadedPath, dstPath, function(err) {
	        if(err){
	          console.log('rename error: ' + err);
	        } else {
	          console.log('rename ok');
	        }
	      });
	      var file = new models.File({ 
			    fileId : fileId,
				originalFilename : inputFile.originalFilename,
				savedFilename : dstPath,
			});
			file.save(function (err) {
				if (err) return console.error(err);
			});  
	    }

	    res.send(JSON.stringify({status:'success',id:fileId}));
	 });
}
module.exports.note.uploadCoverImage = function(req,res){
	console.log(req.files);
//	res.send(JSON.stringify({status:'success'}));
	var form = new multiparty.Form({uploadDir:'./'});
		form.parse(req, function(err, fields, files) {
			console.log(files);
	    var filesTmp = JSON.stringify(files,null,2);
	    	console.log(files);
	    if(err){
	      console.log('parse error: ' + err);
	    } else {
	      console.log('parse files: ' + filesTmp);
	      var inputFile = files.file[0];
	      console.log(inputFile.path);
	      var exg = /\.[a-z]+/i;
	      var uploadedPath = inputFile.path;
	      var extension = exg.exec(inputFile.originalFilename)[0];
	      var fileId = new Date().getTime();
	      var dstPath = './public/images/upload/' + fileId + extension;
	      //重命名为真实文件名
	      fs.rename(uploadedPath, dstPath, function(err) {
	        if(err){
	          console.log('rename error: ' + err);
	        } else {
	          console.log('rename ok');
	        }
	      });
	      var file = new models.File({ 
			    fileId : fileId,
				originalFilename : inputFile.originalFilename,
				savedFilename : dstPath,
			});
			file.save(function (err) {
				if (err) return console.error(err);
			});  
	    }

	    res.send(JSON.stringify({status:'success',id:fileId}));
	 });
};
module.exports.note.getUser = function(req,res){
	let username = "yuxi";
	var user = userService.findByUserName(username).then(function(result){
		res.send(JSON.stringify({status:'success',username:result}));
	});	
}

module.exports.restfull = {
	notes:{}
}
module.exports.restfull.notes.getNoteById = function(req,res){
	let noteId = req.params.id;
	console.log(noteId);
	
	noteService.findNoteById(noteId).then((result)=>{
		res.send(JSON.stringify({status:'success',note:result}));
	});
}