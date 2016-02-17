 $(function($){
    var ANIMATION_TIME = 1000;
    function transition_transform(ele, time, timing, delay) {
        timing = timing || "linear";
        if (time == undefined)time = ANIMATION_TIME / 1000;
        delay = delay || 0;
        $(ele).css({
/*            '-webkit-transition': '-webkit-transform ' + time + 's ' + timing + " " + delay + "s",
            '-moz-transition': '-moz-transform ' + time + 's ' + timing + " " + delay + "s",
            '-ms-transition': '-ms-transform ' + time + 's ' + timing + " " + delay + "s",
            '-o-transition': '-o-transform ' + time + 's ' + timing + " " + delay + "s",
            'transition': 'transform ' + time + 's ' + timing + " " + delay + "s"*/
            '-webkit-transition': 'all ' + time + 's ' + timing + " " + delay + "s",
            '-moz-transition': 'all ' + time + 's ' + timing + " " + delay + "s",
            '-ms-transition': 'all ' + time + 's ' + timing + " " + delay + "s",
            '-o-transition': 'all ' + time + 's ' + timing + " " + delay + "s",
            'transition': 'all ' + time + 's ' + timing + " " + delay + "s"
        });
    }
    function transform(ele, transform, x, y, boolean) {
        var value = '';
        if (transform == "translate") {
            if (boolean) {
                value = "translate(" + arguments[2] + "%," + arguments[3] + "%)";
            } else {
                value = "translate(" + arguments[2] + "px," + arguments[3] + "px)";
            }
        } else if (transform == "rotate") {
            value = "rotate(" + arguments[2] + "deg)";
        } else if (transform == "scale") {
            value = "scale(" + arguments[2];
            if (arguments[3] !== undefined) {
                value += "," + arguments[3];
            }
            value += ")";
        } else if (transform == "skew") {
            value = "rotate(" + arguments[2] + "deg," + arguments[2] + "deg)";
        } else if (transform == "matrix") {
            value = "matrix(" + arguments[2] + "," + arguments[3] + "," + arguments[4] + "," + arguments[5] + "," + arguments[6] + "," + arguments[7] + ")";
        } else if (transform == 'value') {
            value = arguments[2];
        }
        $(ele).css({
            "transform": value + ' translateZ(0px)',
            "-ms-transform": value + ' translateZ(0px)',
            "-moz-transform": value + ' translateZ(0px)',
            "-webkit-transform": value + ' translateZ(0px)',
            "-o-transform": value + ' translateZ(0px)'
        });
    }
    var currentIndex = 0;
    var FIRST;
    var myswiper = new Swiper('.swiper-container', {
//        pagination: '.swiper-pagination',
        lazyLoading : true,
        lazyLoadingInPrevNext : true,
        initialSlide :0,
        direction: 'vertical',
        effect : 'cube',
        cube: {
          slideShadows: false,
          shadow: false,
        },
        onSlideChangeEnd: function(swiper){
        },
    });
    $(".audio").addClass('play');
    var audioPlay = false;
    $(".audio").on("click",function(){
        var audio = document.getElementById("back_audio");
        if(audio!=null){
            if(audio.paused){
                audio.play();
                $(this).addClass("play");
            }else{
                audio.pause();
                $(this).removeClass("play");
            }
        }
    });
    setTimeout(function(){
        myswiper.once('TouchMove', function(swiper){
           if(swiper.activeIndex == 0 && !FIRST){
                $(".cup").addClass("hide");
                $(".tea-text").addClass("hide");
                $(".title-tea").addClass("move-center");
                var drawStart = false;
                var lottery = new Lottery('page1', './images/list_1_bg_2.jpg', 'image', swiper.width, swiper.height, drawPercent);
                lottery.init('./images/list_1_bg_3.jpg', 'image');
                $(".page1 canvas").addClass("active");
                function drawPercent(percent){
/*                    if(!drawStart){
                        $(".title-tea").css("display","none");
                        drawStart = true;
                    }*/
                    if(percent>20){
                        lottery.clearMask();
/*                        transform(".one-top-title","translate",70,0,true);
                        transition_transform(".one-top-title",1);*/
                        $("#page1").removeClass("swiper-no-swiping");
                    }
                }
                FIRST = true;
            }
        }); 
    },500);
 //   },10500);

    var page3_swiper = new Swiper('.page3-swiper-container', {
    pagination: '.swiper-pagination',
    lazyLoading : true,
    lazyLoadingInPrevNext : true,
    noSwiping : true,
    initialSlide :0,
//        direction: 'vertical',
    });
    $(".prev-button").on("click",function(){
        page3_swiper.slidePrev(function(){},500);
    });
    $(".next-button").on("click",function(){
        page3_swiper.slideNext(function(){},500);
    });
    window.swiper = myswiper;
})