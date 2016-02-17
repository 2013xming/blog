var FileStreamRotator = require('file-stream-rotator');
var fs = require("fs");
var jqueryTool = require('../routes/jqueryTool');
var logDirectory = __dirname +'/logs';

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

//var accessLogFile = fs.createWriteStream(logDirectory + "/access.log",{flags:'a'});
//var errorLogFile = fs.createWriteStream(logDirectory + "/error.log",{flags:'a'});
var accessLogFile = FileStreamRotator.getStream({
	filename : logDirectory + '/access-%DATE%.log',
	frequency :'daily',
	verbose : false,
	date_format : "YYYYMMDD"
});
var errorLogFile = FileStreamRotator.getStream({
	filename : logDirectory + '/error-%DATE%.log',
	frequency :'daily',
	verbose : false,
	date_format : "YYYYMMDD"
});
var fileDir = "./logs/logs/filelog.log";

//fs.write(fd,buffer,offset,length,position,
//[callback(err, bytesWritten, buffer)])
function writeToFileInDepth(data,isAdded){
	if(!isAdded){
		fs.writeFileSync(fileDir,'\n');
	}
	if(jqueryTool.type(data)==='object' || jqueryTool.type(data)==='array'){
		if(jqueryTool.type(data)==='object'){
			fs.appendFileSync(fileDir,'{');
		}else if(jqueryTool.type(data)==='array'){
			fs.appendFileSync(fileDir,'[');
		}
		jqueryTool.each(data,function(index,item){
			if(jqueryTool.type(data)==='object'){
				fs.appendFileSync(fileDir,index+':');
			}
			if(jqueryTool.type(item)==='object' || jqueryTool.type(item)==='array')
				writeToFileInDepth(item,false);
			else{
				fs.appendFileSync(fileDir,item);
				fs.appendFileSync(fileDir,',');
				fs.appendFileSync(fileDir,'\n');	
			}
		});
		if(jqueryTool.type(data)==='object'){
			fs.appendFileSync(fileDir,'},');
		}else if(jqueryTool.type(data)==='array'){
			fs.appendFileSync(fileDir,'],');
		}
	}else{
		fs.appendFileSync(fileDir,data);
		fs.appendFileSync(fileDir,'\n');
	}
	
}
function fileLog(data,isAdded){
//	fs.open(fileDir, 'a', function(err, fd) {
//		if (err) {
//		console.error(err);
//		return;
//		}

		writeToFileInDepth(data,isAdded);
//	});
}
var exports = module.exports ={
	accessLogFile : accessLogFile,
	errorLogFile : errorLogFile,
	fileLog : fileLog
}
