jQuery(document).ready(function(){
		function getNotes(queryType,value,pagesize,pagenum){
			var pageSize = pagesize || 10;
			var pageNum = pagenum || 0;
			var qt = queryType || "time";
			qt = encodeURIComponent(qt);
			var qValue = value || "";
			value = encodeURIComponent(value);
			var qts = ["type","tags","title","id","time"];
			if(queryType && jQuery.inArray(queryType,qts)>=0){
				jQuery.ajax({
					type:"GET",
					url:"/getnotes",
					data:{pageNum:pageNum,pageSize:pageSize,queryType:qt,value:value},
					dataType:"json",
					success:function(data){
						var content = $("#content");
						var notes = data.notes;
						content.empty();
						for(var i=0,len=notes.length;i<len;i++){
							var note = notes[i];
							var monthList = ["01","02","03","04","05","06","07","08","09","10","11","12"];
							var dateList = ["00","01","02","03","04","05","06","07","08","09","10"];   // 10号以内的凑成两位
/*							var contentText = $('#disnone').html(note.content).text();
							//if(contentText.length>600){
							//	contentText = contentText.slice(0,600)+"...";
							// }
							contentText = contentText.length>200 ? contentText.slice(0,200)+"..." : contentText;*/
							var introduction = note.introduction;
							var temp = $("#dis-noteblock").clone();
							temp.attr("data-id",note._id);
							var tempDate = new Date(note.publishDate);
							//IE8 不能正常转成Date 类，特殊处理
							if(tempDate == "NaN"){
								tempDate = jQuery.ISODateToGMTDate(note.publishDate);
							}
							var dd = parseInt(tempDate.getDate()) > 10 ? tempDate.getDate() : dateList[parseInt(tempDate.getDate())];
							var pDate = tempDate.getFullYear() + "." + monthList[tempDate.getMonth()] + "." + dd;
							temp.find("span.note-time").html(pDate);
							temp.find(".title").html(note.title);
							if(note.introImage && note.introImage!="defaultImg"){
								var imgSrcUrl = '/getImage?imgId=' + note.introImage;
							}else{
								var imgSrcUrl = '/getImage?imgId=defaultImg';
							}
							temp.find(".article-img").attr('src',imgSrcUrl);
							temp.find(".article-title a").attr("href","/note?type=_id&queryStr="+note._id);
//							temp.find(".note-content").html(contentText);
							temp.find(".note-content").text(introduction || '');
							temp.find(".note-type").html(note.type.join(";"));
							temp.find(".note-tags").html(note.tags.join(";"));
							temp.css('display','inline-block');
							content.append(temp);
//							if(i%2==1){
//								content.append('<hr>');
//							}
						}
						totalPageNum = Math.ceil(data.totalSize/pageSize);
						setPagination("pagination",totalPageNum,pageNum+1);
						$('#disnone').empty();
					}
				});
			}
			
		};
		function setPagination(select,size,current){
//			var size = 5;
			var tar = $("#"+select);
			tar.empty();
			var str = '';
			if(current==1)
				str +='<ul><li class="disabled" ><a data-value="0">&laquo;</a></li>';
			else str +='<ul><li ><a data-value="0">&laquo;</a></li>';
			for(var i=0;i<size;i++){
				if(current==(i+1))
					str +='<li class="active"><a data-value="'+ Number(i+1) +'">'+ Number(i+1) +'</a></li>';
				else str +='<li><a data-value="'+ Number(i+1) +'">'+ Number(i+1) +'</a></li>';
			}
			if(current==size)
				str +='<li class="disabled"><a data-value="-1">&raquo;</a></li></ul>';
			else str +='<li><a data-value="-1">&raquo;</a></li></ul>';
			tar.append(str);
		};

		$("#pagination").on("click",function(event){
//			console.log($(event.target));
			var currentPnum = Number($(event.target).attr("data-value"));
			var paclass =$(event.target).parent().attr("class") 
			if(paclass =="disabled" || paclass=="active")
				return;
			else{
				if(currentPnum == 0){
					currentPageNum--;
					getNotes(queryType,queryStr,pagesize,currentPageNum-1);
				}else if(currentPnum == -1){
					currentPageNum++;
					getNotes(queryType,queryStr,pagesize,currentPageNum-1);
				}else{
					currentPageNum = currentPnum;
					getNotes(queryType,queryStr,pagesize,currentPageNum-1);
				}

			}

		});
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
			queryStr = getUrlParamByName("queryStr") || queryStr;
			getNotes(queryType,queryStr,pagesize,currentPageNum-1);
		};
		// 初始化默认参数值
		var totalPageNum = 0;
		var currentPageNum = 1;
		var pagesize = 10;
		var queryType = "time";
		var queryStr = "";

		init();
	});