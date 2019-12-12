//http://www.sount.net/docs/admin/index.html  接口文档

$(function () {
    $(".left_list li").off("click").on("click",function(){
        var index = $(this).index();
        $(this).addClass("active").siblings().removeClass("active");
        $(".box").eq(index).addClass("on").siblings().removeClass("on");
    });

    //退出
    $('.logout').on('click',function () {
        getAjax(url+'account/logout',{},true,function (json) {
            //console.log(json)
            location.href="./login.html";
        },errFunc)
    })

})