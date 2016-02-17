var express = require("express");
var fs = require("fs");
var models = require("../modules/database/models/");
var routerFilter = {};
var _rootDir;
var jqueryTool = require('./jqueryTool');
var http = require('http');
var fileLogs = require("../logs/index");

var pageRouter = {
/*	"GET" : ['/','/index','/note','/getNotes','/admin/login','/admin/index',
			'/admin/newNote','/admin/manageNote','/admin/editNote'],
	"POST" : ['/admin/login','/uploadnote'], */
	"GET" : [],
	"POST" :[],
	"PUT" : [],
	"DELETE" : []
};
var staticResourceRouter = {
	"GET" : ['/public/'],
	"POST" : [],
	"PUT" : [],
	"DELETE" : []
};
var getClientIP = function(req){
	return req.headers['x-real-ip']
	||req.ip
    || req._remoteAddress
    || (req.connection && req.connection.remoteAddress)
    || undefined;
}


/*var singleton = (function(){
	var uniqueInstance;
	function constructor(){
		function initPageRouters(routes,rootDir){
			var stacks = routes.stack || [];
			_rootDir = rootDir;
			stacks.forEach(function(item,index,array_self){
				var method = item.route.stack[0].method.toUpperCase();
				var pathRegExp = item.regexp;
				pageRouter[method].push(pathRegExp);
			});
			return pageRouter;
		};
		return {
			initPageRouters : initPageRouters
		}
	}
	return {
		getInstance:function(){
			if(!uniqueInstance){
				uniqueInstance = constructor();
			}
			return uniqueInstance;
		}
	}
})();*/

function isStaticSourceExist(req,res,next){
	var method = req.method;
//	console.log(req.baseUrl);
//	console.log(_rootDir);
//	console.log("exists:"+fs.existsSync(_rootDir +req.baseUrl));
	/*忽略对某些第三方文件的检查,包括ueditor*/
	var ignore = ['^\/?public\/ueditor\/'];
	for(var i=0,len = ignore.length;i<len;i++){
		if(new RegExp(ignore[i]).test(req.originalUrl))
			return true;
	}
	return (req.originalUrl == '/') ? false : fs.existsSync(_rootDir +req.baseUrl);
/*	ep.all(eventProxyIndex,function (isExist){
		if(isExist) 
			return true;
		else return false;
	});
	console.log(req.baseUrl);
	fs.exists("/viewCheck.js",function(exists){console.log("exists:"+exists);})
	fs.exists(req.baseUrl,fsExistCallBack(eventProxyIndex));
/*	if(staticResourceRouter[method] && staticResourceRouter[method].length>0){
		var resourceRouter = staticResourceRouter[method];
		for(var i=0,len=resourceRouter.length;i<len;i++){
			var pa = new RegExp('^'+resourceRouter[i]);
			if(pa.test(req.baseUrl)){
				return true;
			}
		}
	}*/
}
function isPageOrIntefaceRouter(req,res,next){
	var method = req.method;
	if(pageRouter[method] && pageRouter[method].length>0){
		var prs = pageRouter[method];
		for(var i=0,len=prs.length;i<len;i++){
			var pa = prs[i];
			if(pa.test(req.baseUrl)){
				return true;
			}
		}
	}
};

function isExampleRouter(req,res,next){
	var method = req.method;
	var pa = /^\/public\/example\/?$/i;
	if(pa.test(req.baseUrl)){
		return true;
	}
};

var recordPageView = function(req,res,next){
//		console.log(req.ip);
	var dt = new Date();
	var viewDt = dt.getFullYear()+'/' + (dt.getMonth()+1) + '/' + dt.getDate();
	var url = "http://api.map.baidu.com/location/ip?ak=B9a89bf41779d0dbf59ceb0a6694bcb0&coor=bd09ll&ip=";
	url +=  getClientIP(req);
//	url += "119.127.44.24";
//	fileLogs.fileLog(url);
	var recMethod =  req.method;
	var recIP = getClientIP(req);
	var recPath = req.path;
	var recBaseUrl = req.baseUrl;
	var recOriginalUrl = req.originalUrl;
	http.get(url, function(response) {
		response.setEncoding('utf8');
		response.on("data",function(d){
			var data= JSON.parse(d); 
//			console.log(data.address.substring(3,5));
			var province = "";
			if(data && data.status==0){
				province = data.address.substring(3,5);
//				fileLogs.fileLog(province,true);
			}
			var record = new models.PageView({
				method : recMethod,
		//		IP:req.ip,
				IP : recIP,
				path : recPath,     // /
				baseUrl : recBaseUrl,   //  /getnotes
				originalUrl : recOriginalUrl,    // /getnotes?queryType=_id&value=555be85708a56d501d7d8d80
				viewDay : viewDt,
				province : province
			});
			record.save(function(err){
				if (err) return console.error(err);
			});

		});
//	  console.log("Got response: " + res.address.substring(3,5));
	  
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	});
	/*var record = new models.PageView({
		method : req.method,
//		IP:req.ip,
		IP : getClientIP(req),
		path : req.path,     // /
		baseUrl:req.baseUrl,   //  /getnotes
		originalUrl : req.originalUrl,    // /getnotes?queryType=_id&value=555be85708a56d501d7d8d80
		viewDay : viewDt,
		province : province
	});
	record.save(function(err){
		if (err) return console.error(err);
	});*/
};
//初始化页面请求路径，罗列所有能注册的页面路径
routerFilter.initPageRouters = function(routes,rootDir){
	console.log("initPageRouters!!!!");
	var stacks = routes.stack || [];
	_rootDir = rootDir;
	stacks.forEach(function(item,index,array_self){
		var method = item.route.stack[0].method.toUpperCase();
		var pathRegExp = item.regexp;
//		console.log(pathRegExp);
		pageRouter[method].push(pathRegExp);
	});
	//给ueditor 特别记录一条。
//	pageRouter['GET'].push(new RegExp(/^\/?public\/ueditor\/ueditor\/?$/i));

};

routerFilter.routerFilter = function(req,res,next){	

/*	console.log("req.path:" + req.path);
	console.log("req.baseUrl:" + req.baseUrl);
	console.log("req.originalUrl:" + req.originalUrl);   */


	if(isStaticSourceExist(req,res,next)){
		next();
	}else if(isPageOrIntefaceRouter(req,res,next)){
//		console.log(req.baseUrl);
//		console.log(pageRouter);
	//去掉ajax请求，其余记录访问量
		if(!req.xhr)
			recordPageView(req,res,next);
		next();
	}else{
		var staticResourceReg = /(\.css|\.js|\.jpg|\.png)$/i;
		if(staticResourceReg.test(req.baseUrl)){
			res.send("Resource not found!");
		}
		else{
			res.status(404);
			res.render('404');
		}

	}
};
exports = module.exports = routerFilter;
// router 对象上可以查找到已有的路径
/*
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
 
// error handlers
 
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
 
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
*/