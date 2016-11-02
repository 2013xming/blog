;(function(win){
	if(!jQuery){
		console.log("this plug need jQuery!");
		return;
	}

	/**
	// 参数说明：
	fixedDiff : 整数，保留的页码间隔，例如5，会有 1-5页，4-8页的显示，默认为5。
	start : 整数,从1开始，显示的开始页码，不是第一页开始时前面显示 ...
	end ： 整数，显示的结束页码，不是最后一页时后面显示 ...
	currentPage：从1开始，当前页码
	totalPage：总页码数
	showPageSlector : 是否显示跳转页面功能,默认为true
	click:页面跳转的回调函数，执行页面跳转功能的回调函数，自动传入页码参数
	submit:确定按钮的回调函数，自动传入页码参数
	*/
	var pagingPlugin = function(options,elementId){
		this.options = {
			elementId:null,
			fixedDiff : 5, 
			currentPage : 0,
			totalPage : 10,
			showPageSlector : true,
			prePageText:"<上一页",
			nextPageText:"下一页>",
			pageClick : function(e){},
			submit: function(e){}
		}
		this.init(options,elementId);
	};
	
	pagingPlugin.prototype.setPagination = function(currentpage){
		var currentPage = currentpage;
		var start,end;
		var totalPage = this.options.totalPage;
		var fixedDiff = this.options.fixedDiff;


		var preSpotShow = false,nextSpotShow = false;
		if(currentPage == 1){
			$("ol.pagination #prePage").addClass("disable");
		}else{
			$("ol.pagination #prePage").removeClass("disable");
			$("ol.pagination #prePage").removeClass("cbDone");
		} 
		if(currentPage == totalPage){
			$("ol.pagination #nextPage").addClass("disable");
		}else{
			$("ol.pagination #nextPage").removeClass("disable");
			$("ol.pagination #nextPage").removeClass("cbDone");
		}
		if(this.options.showPageSlector){
			$("ol.pagination").find("span.pageSlector").find("#total-page").text(this.options.totalPage);
			$("ol.pagination").find("span.pageSlector").find("#inputPage").attr("max",this.options.totalPage);
			$("ol.pagination").find("span.pageSlector").find("#inputPage").attr("placeholder",this.options.totalPage);
		}
		if(fixedDiff>=totalPage){
			start = 1;
			end = totalPage;
		}else{
			if(currentPage - Math.floor(fixedDiff/2)>0){
				start = currentPage - Math.floor(fixedDiff/2);
				end = start + fixedDiff - 1;
			}else if(currentPage - Math.floor(fixedDiff/2)<=0){
				start = 1;
				end = start + fixedDiff - 1;
			}
			if(currentPage + Math.floor(fixedDiff/2)>totalPage){
				end = totalPage;
				start = end - fixedDiff +1;
			}
		}

		if(start>1){
			$("ol.pagination #preSpot").show();
		}else{
			$("ol.pagination #preSpot").hide();
		}
		if(end<totalPage){
			$("ol.pagination #nextSpot").show();
		}else{
			$("ol.pagination #nextSpot").hide();
		}
		var liStr = "";
		for(var i= start;i<=end;i++){
			liStr = liStr + '<li class="page" data-index="'+ i +'"><a href="javascript:void(0);" data-index="'+ i +'">'+ i +'</a></li>' ;
		}
		$("ol.pagination li.page").remove();
		$(liStr).insertAfter("ol.pagination #preSpot");
		$("ol.pagination li[data-index='"+ Number(currentPage)+"']").addClass("active");
	};
	pagingPlugin.prototype.init = function(options,elementId) {
		// body...
		this.options.totalPage = options.totalPage || this.options.totalPage;
		this.options.currentPage = options.currentPage || this.options.currentPage;
		this.options.fixedDiff = options.fixedDiff || this.options.fixedDiff;
		this.options.elementId = elementId;
		this.options.showPageSlector = (options.showPageSlector==false) ? options.showPageSlector : this.options.showPageSlector;
		this.options.prePageText = options.prePageText || this.options.prePageText;
		this.options.nextPageText = options.nextPageText || this.options.nextPageText;
		var currentPage = this.options.currentPage;
		var start,end;
		var totalPage = this.options.totalPage;
		var fixedDiff = this.options.fixedDiff;

		var jQueryEle = $('#'+this.options.elementId);
		var htmlstr = '<ol class="pagination">'
				+'<li id="prePage" data-index="0"><a href="javascript:void(0);" data-index="0">&lt;上一页</a></li>'
				+'<span id="preSpot" >&nbsp;&#183;&#183;&#183;&nbsp;</span>'
				+'<span id="nextSpot" >&nbsp;&#183;&#183;&#183;&nbsp;</span>'
				+'<li id="nextPage" data-index="-1"><a href="javascript:void(0);" data-index="-1">下一页&gt;</a></li>'
				+'<span class="pageSlector">&nbsp;&nbsp;<span class="page-text">共<span id="total-page"></span>页,'
				+'到第</span> <input id="inputPage" type="number" name="points" min="1" max="10" placeholder="10"/>'
				+'<span class="page-text">页</span>'
				+'&nbsp;&nbsp;<button id="pageSubmit">确定</button></span>'
				+'</ol>';
		var domfrag = jQuery(htmlstr);
		domfrag.find("#prePage a").text(this.options.prePageText);
		domfrag.find("#nextPage a").text(this.options.nextPageText);
		if(!this.options.showPageSlector){
			domfrag.find("span.pageSlector").remove();
		}else{
			domfrag.find("span.pageSlector").find("#total-page").text(this.options.totalPage);
			domfrag.find("span.pageSlector").find("#inputPage").attr("max",this.options.totalPage);
			domfrag.find("span.pageSlector").find("#inputPage").attr("placeholder",this.options.totalPage);
		}
		jQueryEle.empty().append(domfrag);

		this.setPagination(this.options.currentPage);
		var that = this;
		$("#"+elementId).on("click","li",function(e){
			e.preventDefault();
			if($(this).hasClass("disable")){
				if(!$(this).hasClass("cbDone")){
					$(this).addClass("cbDone");
				}
				return;
			}
				
			var currentPage = that.options.currentPage;
			var totalPage = that.options.totalPage;
			var selectPage = Number($(this).attr("data-index"));
			if(selectPage == 0){
				if(currentPage != 1){
					currentPage--;
				}
			}else if(selectPage == -1){
				if(currentPage !=totalPage){
					currentPage++;
				}
			}else{
				currentPage = selectPage;
			}
			that.options.currentPage = currentPage;
			that.setPagination(currentPage);
		});
		if(jQuery.isFunction(options.pageClick)){
			this.options.pageClick = function(e){
				if($(this).hasClass("cbDone"))
					return;
				options.pageClick(e,that.options.currentPage);
			}
			$("#"+elementId).on("click","li",this.options.pageClick);
		}
		
		if(this.options.showPageSlector){
			$(".pageSlector").on("click","#pageSubmit",function(event){
				var page;
				if($("#inputPage").val() == ""){
					//阻止事件传播，不让回调函数相应事件。
					return false;
				}else{
					if(isNaN(Number($("#inputPage").val()))){
						alert("输入页码非法,请输入数字!");
						return;
					}else{
						page = Number($("#inputPage").val());
					}
				}
				if(page<1 ||page > that.options.totalPage){
					alert("输入页码超出范围,请重新输入!");
					return;
				}
				var currentPage = Number(page);
				that.options.currentPage = currentPage;
				that.setPagination(currentPage);
			});
		}
		if(jQuery.isFunction(options.submit)){
			this.options.submit = function(e){
				options.submit(e,that.options.currentPage);
			}
			$("#"+elementId).on("click","#pageSubmit",this.options.submit);
		}

	};
	pagingPlugin.prototype.currentPage = function(){
		return this.options.currentPage;
	};
	pagingPlugin.prototype.setTotalPage = function(totalpage){
		this.options.totalPage = totalpage || this.options.totalPage;
		this.setPagination(this.options.currentPage);
	};
	pagingPlugin.prototype.getTotalPage = function(){
		return this.options.totalPage;
	};
	win.pagingPlugin = pagingPlugin;
})(window);
