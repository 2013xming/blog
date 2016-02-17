jQuery(document).ready(function(){
		function getNotes(queryType,value,pagesize,pagenum){
			var pageSize = pagesize || 10;
			var pageNum = pagenum || 0;
			var qt = queryType || "time";
			qt = encodeURIComponent(qt);
			var qValue = value || "";
			value = encodeURIComponent(value);
			var qts = ["type","tags","title","_id","time"];
//			console.log("enter getNotes");
			if(queryType && jQuery.inArray(queryType,qts)>=0){
				$.ajax({
					type:"GET",
					url:"/getnotes",
					data:{queryType:qt,value:value},
					success:function(data){
						var content = $("#content");
						var note = data.notes[0];
						content.empty();
						var monthList = ["01","02","03","04","05","06","07","08","09","10","11","12"];
						var dateList = ["00","01","02","03","04","05","06","07","08","09","10"];
						var temp = $("#dis-noteblock").clone();
						temp.attr("data-id",note._id);
//						console.log(note.publishDate);
						var tempDate = new Date(note.publishDate);
						//IE8 不能正常转成Date 类，特殊处理
						if(tempDate == "NaN"){
							tempDate = jQuery.ISODateToGMTDate(note.publishDate);
						}
						var dd = parseInt(tempDate.getDate()) > 10 ? tempDate.getDate() : dateList[parseInt(tempDate.getDate())];
						var pDate = tempDate.getFullYear() + "." + monthList[tempDate.getMonth()] + "." + dd;
						temp.find("span.note-time").html(pDate);
						temp.find(".title").html(note.title);
						temp.find(".note-content").html(note.content);
						temp.find(".note-type").html(note.type.join(";"));
						temp.find(".note-tags").html(note.tags.join(";"));
						temp.css('display','block');
						content.append(temp);
					}
				});
			}
			
		};

		var getUrlParamByName = function(paramName){
			var args = {};
			var query = location.search.substring(1);
			var pairs = query.split('&');
			for(var i=0;i<pairs.length;i++){
				var pos = pairs[i].indexOf('=');
				if(pos ==-1) continue;
				var name = pairs[i].substring(0,pos);
				var value = pairs[i].substring(pos+1);
				value = decodeURIComponent(value);
				args[name] = value;			
			}
			return args[paramName];
		};
		var init = function(){
			queryType = getUrlParamByName("type") || queryType;
//			console.log(getUrlParamByName("queryStr"));
			queryStr = getUrlParamByName("queryStr") || queryStr;
			getNotes(queryType,queryStr,pagesize,currentPageNum-1);
		};


		function shareBind(){
		var title = jQuery("#content .title").text();
		var desc = jQuery("#content .note-content p").text().slice(0,50)+'...';
		var bdPic = window.location.origin + jQuery("header img").attr("src");
		if(title==""){
			setTimeout(arguments.callee,2000);
		}else{
			title = jQuery("title").text() + "-" + jQuery("#content .title").text();
			window._bd_share_config = {
				common : {
					bdText : title,	
					bdDesc : desc,	
					bdUrl : location.href, 	
					bdPic : bdPic
				},
				share : [{
					"bdSize" : 16
				}],
				slide : [{	   
					bdImg : 0,
					bdPos : "right",
					bdTop : 100
				}],
				image : [{
					viewType : 'list',
					viewPos : 'top',
					viewColor : 'black',
					viewSize : '16',
					viewList : ['qzone','tsina','tqq']
				}],
				selectShare : [{
					"bdselectMiniList" : ['tsina','qzone','tqq']
				}]
			}
			with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion='+~(-new Date()/36e5)];
		}
	};

		// 初始化默认参数值
		var totalPageNum = 0;
		var currentPageNum = 1;
		var pagesize = 10;
		var queryType = "time";
		var queryStr = "";

		init();
		shareBind();
	});