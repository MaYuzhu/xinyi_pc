//http://www.sount.net/docs/admin/index.html  接口文档

$(function () {
    //显示用户名字
    $('.user_name>span').text($.cookie('username'))

    $(".left_list li").off("click").on("click",function(){
        var index = $(this).index();
        $(this).addClass("active").siblings().removeClass("active");
        $(".box").eq(index).addClass("on").siblings().removeClass("on");
    });

    //退出
    $('.logout').on('click',function () {
        getAjax(url+'oauth/logout',{},true,function (json) {
            //console.log(json)
            location.href="./login.html";
        },errFunc)
    })

})