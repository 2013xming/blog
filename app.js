var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var mongoose = require('mongoose');
require("./modules/database/");
var serverLogs = require("./logs/index");

var routerFilter = require("./routes/routerFilter");

/*var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');   */



var app = module.exports = express();    //新的API 创建方式，与之前的书上写法已经不同
//app.set('env','production');   //设置当前环境为生产环境（或者为开发环境,development）

//log normal responses
app.use(morgan('combined',{
  skip:function(req,res){return res.statusCode>400},
  stream:serverLogs.accessLogFile
}));

//log error responses
app.use(morgan('combined',{
  skip:function(req,res){return res.statusCode<400},
  stream:serverLogs.errorLogFile
}));

var rootDir = __dirname　+ "/";
app.set('rootDir',rootDir);

routerFilter.initPageRouters(routes,app.get('rootDir'));
app.use('*',routerFilter.routerFilter);

//console.log(routes);
//console.log(routes.stack[0].route);
//console.log(routes.stack[0].route.stack[0].method);
/*app.get('*',function(req,res,next){
   console.log("enter 404.");
  res.sendStatus(404);
})*/


// Register ejs as .html. If we did
// not call this, we would need to
// name our views foo.ejs instead
// of foo.html. The __express method
// is simply a function that engines
// use to hook into the Express view
// system by default, so if we want
// to change "foo.ejs" to "foo.html"
// we simply pass _any_ function, in this
// case `ejs.__express`.
app.engine('.html', require('ejs').__express);

// Optional since express defaults to CWD/views

app.set('views', __dirname + '/views');

// Without this you would need to
// supply the extension to res.render()
// ex: res.render('users.html').
app.set('view engine', 'html');

// added for ueditor
var ueditor = require("ueditor");
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use("/public/ueditor/ueditor", ueditor(path.join(__dirname, ''), function(req, res, next) {
    // ueditor 客户发起上传图片请求
    if (req.query.action === 'uploadimage') {
        var foo = req.ueditor;
        var imgname = req.ueditor.filename;
        var img_url = '/public/images/ueditor/' + new Date().getTime() + imgname;  //需要完整的保存路径包括文件名，但是不能重复，需要哈希掉
        //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.ue_up(img_url); 
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/public/images/ueditor/';
        // 客户端会列出 dir_url 目录下的所有图片
        res.ue_list(dir_url); 
    }
    // 客户端发起其它请求
    else {
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/public/ueditor/nodejs/config.json');
    }
}));


//add by myself,set static dir
app.use('/public',express.static(__dirname + '/public'));



app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'keyboard cat'
}));

app.use(routes);
/*app.use(function(err,req,res,next){
  console.log(err);
//
//  { [ReferenceError: E:\TEST\nodejs\Web Note\views\index.html:11
//      9|          <div class="content-wrap" style="width:100%;margin-right:-240px;
//  float:left;">
//      10|                         <div id="content">
//   >> 11|
//      12|                         </div>
//      13|                          <div class="pagination pagination-large" id="pa
//  gination">
//      14|                         </div><!--pagination-->
//
//  aac is not defined] path: 'E:\\TEST\\nodejs\\Web Note\\views\\index.html' }
//
  console.log(app.get('env'));
  if(app.get('env')==="development"){
    res.status(500);
    var errStatus = 500;
    var errTitle = "服务器内部错误!";
    errMessage = err;
    res.render('error',{
      error:{status:errStatus,title:errTitle,message:errMessage}
    }); 
  }else if(app.get('env')==="production"){
    res.status(500);
    var errStatus = 500;
    var errTitle = "服务器内部错误!";
    errMessage = "抱歉,服务器肚子不舒服,工作人员正在手术处理,请耐心等待^☺^";
    res.render('error',{
      error:{status:errStatus,title:errTitle,message:errMessage}
    }); 
  }
});*/
/*app.use(function(req,res,next){

}); */
//
/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}

