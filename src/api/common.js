import $ from "jquery";

export default {
  info(a){
    $(".messageInfo").html(a).stop().css("display","block").animate({opacity:1},300);
    setTimeout(()=>{
      $(".messageInfo").stop().animate({opacity:0},300,"linear",function () {
        $(".messageInfo").html("").css("display","none")
      });
  },1000);
}
}
