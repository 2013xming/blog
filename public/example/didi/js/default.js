 $(function($){
    var currentIndex = 0;
    var myswiper = new Swiper('.swiper-container', {
//        pagination: '.swiper-pagination',
        lazyLoading : true,
        lazyLoadingInPrevNext : true,
        initialSlide :0,
        direction: 'vertical',
        onSlideChangeEnd: function(swiper){
          $(".story").removeClass("story-show").css("display","none");
        },
    });
     $(".share-img").click(function(){
        $(".shared-layer").css("display","block");
     });
     $(".shared-layer").click(function(){
        $(".shared-layer").css("display","none");
     });
     $(".story-img").click(function(event){
        $(this).parents(".swiper-slide").find(".story").addClass("story-show").css("display","block");
     });
     
     $(".page-close").click(function(event){
        $(this).parent().removeClass("story-show");
        var par = $(this).parent();
        setTimeout(function(){par.css("display","none");},500);
     });
     window.swiper = myswiper;
})