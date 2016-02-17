	$('.wechat').on('click',function(){
		$('.wc-img').css('top','0');
		$('.bus-img').css('top','632px');
		$('.media-img').css('top','1264px');
		$('.num-img').css('top','1896px');
		$('.meet-img').css('top','2528px');
		$('.apps-img').css('top','3106px');
	})
	$('.business').on('click',function(){
		$('.wc-img').css('top','-632px');
		$('.bus-img').css('top','0');
		$('.media-img').css('top','1264px');
		$('.num-img').css('top','1896px');
		$('.meet-img').css('top','2528px');
		$('.apps-img').css('top','3106px');
	})
	$('.media').on('click',function(){
		$('.wc-img').css('top','-1264px');
		$('.bus-img').css('top','-632px');
		$('.media-img').css('top','0');
		$('.num-img').css('top','1896px');
		$('.meet-img').css('top','2528px');
		$('.apps-img').css('top','3106px');
	})
	$('.num').on('click',function(){
		$('.wc-img').css('top','-1896px');
		$('.bus-img').css('top','-1264px');
		$('.media-img').css('top','-632px');
		$('.num-img').css('top','0');
		$('.meet-img').css('top','2528px');
		$('.apps-img').css('top','3106px');
	})
	$('.meeting').on('click',function(){
		$('.wc-img').css('top','-2528px');
		$('.bus-img').css('top','-1896px');
		$('.media-img').css('top','-1264px');
		$('.num-img').css('top','-632px');
		$('.meet-img').css('top','0');
		$('.apps-img').css('top','3106px');
	})
	$('.app').on('click',function(){
		$('.wc-img').css('top','-3106px');
		$('.bus-img').css('top','2528px');
		$('.media-img').css('top','-1896px');
		$('.num-img').css('top','-1264px');
		$('.meet-img').css('top','-632px');
		$('.apps-img').css('top','0');
	});

//登录是点击记住密码
$('.rem-pass').on('click','i',function(){
		$(this).toggleClass('on');
	})

//协议
$('p.protocol').on('click','i',function(){
	$(this).toggleClass('on');
})

//应用领域
$('.app-tit p a').click(function(){
	$('.app-tit p a span').removeClass('on');
	$(this).find('span').addClass('on');
});

//置顶
$(".top").css("top",window.screen.availHeight-200+"px");
$(window).scroll(function() {       
	if($(window).scrollTop() >= 500){
	    $('.top').fadeIn(300); 
	}else{    
	    $('.top').fadeOut(300);    
	}  
});
$('.top').click(function(){$('html,body').animate({scrollTop: '0px'}, 800);});

//
$('.type-tit').on('click','p',function(){
	$(this).toggleClass('on');
})

/*工作机会左侧*/
$('.m-left-job li').click(function(){
	$('.m-left-job li span').removeClass('on');
	$(this).find('span').addClass('on');
});

//个人信息
$('.m-user').on('mouseover','.new-msg',function(){

	$('.m-usermsg-popup').addClass('f-hide');
	$('.m-newmsg-popup').removeClass('f-hide');

});
$('.new-msg').on('mouseout','i',function(){

	$('.m-newmsg-popup').addClass('f-hide');

});

//用户消息
$('.m-user').on('mouseover','.user-msg',function(){

	$('.m-newmsg-popup').addClass('f-hide');
	$('.m-usermsg-popup').removeClass('f-hide');

});
$('.user-msg').on('mouseout','i',function(){

	$('.m-usermsg-popup').addClass('f-hide');

});

//个人信息交互
$('.m-newmsg-popup').hover(function(){
	$(this).removeClass('f-hide');				
},function(){
	$(this).addClass('f-hide');
});


//用户消息弹窗交互
$('.m-usermsg-popup').hover(function(){

	$(this).removeClass('f-hide');
},function(){

	$(this).addClass('f-hide');
});

//案例展示显示二维码
$(".show-img").hover(function(){
		$(this).next().removeClass("f-hide");
	},function(){
		$(this).next().addClass("f-hide");
});
$(".show-ewm").hover(function(){
		$(this).removeClass("f-hide");
	},function(){
		$(this).addClass("f-hide");
});
$(".icon-ewm").hover(function(){
		$(this).prevAll(".show-ewm").removeClass("f-hide");
	},function(){
		$(this).prevAll(".show-ewm").addClass("f-hide");
});
$(".btn-gametry").hover(function(){
		$(this).parents(".p-game-info")
		       .prev()
			   .removeClass("f-hide");
	},function(){
		$(this).parents(".p-game-info")
		       .prev()
			   .addClass("f-hide");
});
//设计师认证信息提交
$(".design_type").click(function(){
	var num = $(this).children().val();
	if( num == 1) {
		$(this).parent()
			   .next().removeClass("f-hide")
			.next().addClass("f-hide");
	}else {
		$(this).parent()
			   .next().addClass("f-hide")
			   .next().removeClass("f-hide");
	}
});

// news
$('.news-item').hover(function(){
	$(this).parent().find('.news-item-hover').removeClass('f-hide');
},function(){
	$(this).parent().find('.news-item-hover').addClass('f-hide');
});

//商务合作公司个人切换
$('.j-company').on('click',function(){
	$('.radio-company').removeClass('f-hide');
	$('.radio-personal').addClass('f-hide');
})
$('.j-personal').on('click',function(){
	$('.radio-company').addClass('f-hide');
	$('.radio-personal').removeClass('f-hide');
})