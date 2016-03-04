var express = require('express');
var router = express.Router();
var schemas = require("../modules/database/schemas/");
var models = require("../modules/database/models/");
var mongoose =require('mongoose');
var session = require('express-session');
var controller = require("./controller");
var http = require('http') ;
var maxAge = 1000*60*30;
/* GET home page. */
/* router.get('/admin/login',function(req,res){
	res.render('login', { title: 'web note' ,tips:""});
}); */
/*router.use(function(err,res,req,next){
	 console.log("enter 404.")
  res.sendStatus(404);
}) */
router.get('/admin/login',function(req,res){
	console.log("login,error");
	var tips = ["","用户名密码错误"];
	var i = 0;
	var errorId = req.query.error;
//	if(errorId && Number(errorId) != "NaN"){
	if(errorId && !isNaN(errorId)){
		i = errorId;
	}
	console.log(tips[i]);
	res.render('admin/login', { title: 'web note' ,tips:tips[i]});
});
/*router.get('/login',function(req,res){
	res.render('login', { title: 'web note' ,tips:null});
});  */
router.get('/admin/:action',function(req, res, next){
	if(!req.session.user){
		res.redirect('/admin/login');
	}else{
		req.session.cookie.maxAge = maxAge;
		next();
	}
});
router.get('/admin/',function(req, res, next){
	if(!req.session.user){
		res.redirect('/admin/login');
	}else{
		req.session.cookie.maxAge = maxAge;
		next();
	}
});
router.get('/', controller.note.index);
router.get('/index', controller.note.index);
router.get('/note',controller.note.show);
router.get('/chartShow', controller.note.chartShow);
router.get('/webDescription', controller.note.webDescription);
router.get('/moblieExample', controller.note.moblieExample);
router.get('/aboutAuthor', controller.note.aboutAuthor);
router.get('/baidu_verify_0b7LFFaOU4.html',controller.note.baidu_verify);
// 百度站点验证文件
router.get('/getnotes',controller.note.ajaxGetNotes);
router.post('/admin/login',function(req,res){
	console.log("admin/login");
	var username = req.body.username;
	var password = req.body.password;
	console.log(username +"!!!" + password);
	var User = mongoose.model('User', models.User);

	User.find({ username: username }, function(err,users){
		console.log(users);
		if(!users){
			console.log("用户名不存在！！");
			res.redirect('/admin/login?error=1');
		}else{
			console.log(users[0].password);
			if(users[0].password === password){
				req.session.user = username;
				res.redirect('/admin/index');
			}else{
				res.redirect('/admin/login?error=1');
			}
		}
	})
});
router.get('/admin/logout',controller.admin.logout);
router.post('/uploadnote', function(req, res){

	var title = req.body.noteTitle ;
	var content = req.body.noteContent;
	var types = req.body.types;
	var tags = req.body.tags;
	var author = req.body.author;
	var introduction = req.body.introduction;
	var introImageId = req.body.introImageId;
	var note = new models.Note({ 
	   title:title,
	   content:content,
	   author:author,
	   type : types,
	   tags : tags,
	   introduction : introduction,
	   introImage : introImageId
	});
	note.save(function (err) {
		if (err) return console.error(err);
//	console.log("save success!");
	});  
 res.send({status:'success'});
});
router.get('/admin/index',controller.admin.index);

router.post('/admin/addNoteType',controller.admin.addNoteType);
router.post('/admin/addNoteTags',controller.admin.addNoteTags);
router.get('/admin/getNoteTypes',controller.admin.getNoteTypes);

router.get('/admin/newNote',controller.admin.newNote);
router.get('/admin/manageNote',controller.admin.manageNote);
router.get('/admin/editNote',controller.admin.editNote);
router.post('/admin/updateNote',controller.admin.updateNote);
router.get('/admin/deleteNote',controller.admin.deleteNote);
router.get('/getPageViewByDate',controller.note.ajaxGetPageViewByDate);
router.get('/getPageViewByIP',controller.note.ajaxGetPageViewByIP);
router.get('/getPageViewRecord',controller.note.ajaxGetPageViewRecord);
router.get('/index_new',controller.note.index_new);
router.get('/chartShow',controller.note.chartShow);
/*router.get('/index-new',controller.admin.indexNew);
router.get('/newNote-new',controller.admin.newNoteNew);
router.get('/welcome',controller.admin.welcome);
router.get('/noteList',controller.admin.noteList);*/

/*var multipartMiddleware = multipart();
router.post('/uploadImage',multipartMiddleware,function(req,res){
	console.log(req.files);
});*/
router.post('/uploadImage',controller.admin.uploadImage);
router.get('/getImage',controller.note.getImage);
/*router.get('/middlewareTest',function(req,res){
	var tempdata = "";
	 http.get({
            host: 'yuxiblog.cn',
            port: 80,
            path: 'http://yuxiblog.cn/getPageViewRecord?startDate=Mon+Feb+01+2016+00%3A00%3A00+GMT%2B0800+(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)&endDate=Tue+Mar+01+2016+00%3A00%3A00+GMT%2B0800+(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)',
            method: 'GET',
        }, function(response) {
        	response.setEncoding('utf8');
			response.on("data",function(d){
				tempdata +=d;
//				var data= JSON.parse(encodeURIComponent(d)); 
//				res.send(d);
			})
			response.on("end",function(){
//				console.log(tempdata);
				var data= JSON.parse(tempdata); 
				res.send(data);
			});
            
        }).on('error', function(err) {
            logger.error(err);
            res.send(404);
        });
});*/
router.get('/downloadTestApp',controller.note.downloadTestApp);
module.exports = router;
