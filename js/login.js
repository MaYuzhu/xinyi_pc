$(function () {
    $('.username').focus(function () {
        if($('.user_message').text()==''&&$(this).val()==''){
            $(this).parent().css({'border-color': '#ffbb29'})
        }else if($(this).val()!=''){
            $(this).parent().css({'border-color': '#67c23a'});
        }
    });
    $('.password').focus(function () {
        if($('.psd_message').text()==''&&$(this).val()==''){
            $(this).parent().css({'border-color': '#ffbb29'})
        }else if($(this).val()!=''){
            $(this).parent().css({'border-color': '#67c23a'});
        }
    });

    $('.username').blur(function () {
        if($(".username").val()){
            $(".user_message").html("");
            $(this).parent().css({'border-color': '#67c23a'});
            $(this).next().addClass('icon-gou').removeClass('hidden icon-guanbi');
        }else {
            $(".user_message").html("请输入账号");
            $(this).parent().css({'border-color': '#f56c6c'});
            $(this).next().addClass('icon-guanbi').removeClass('hidden icon-gou');
        }
    })
    $('.password').blur(function () {
        if($(".password").val()){
            $(".psd_message").html("");
            $(this).parent().css({'border-color': '#67c23a'});
            $(this).next().addClass('icon-gou').removeClass('hidden icon-guanbi');
        }else {
            $(".psd_message").html("请输入密码");
            $(this).parent().css({'border-color': '#f56c6c'});
            $(this).next().addClass('icon-guanbi').removeClass('hidden icon-gou');
        }
    })
    $(".login").click(function(){
        var data = {}
        data.username = $(".username").val();
        data.password = $(".password").val();

        $(".username,.password").html("");

        if(!data.username){
            $(".user_message").html("请输入用户名");
            return;
        }else if(!data.password){
            $(".psd_message").html("请输入密码");
            return;
        }

        $.ajax({
            type: 'POST',
            async: false,
            cache: false,
            url: 'http://admin.sount.net/api/' + 'account/login',
            //data:JSON.stringify({username:data.username,password:data.password}),
            data:{username:data.username,password:data.password},
            dataType: 'json',
            //contentType: 'application/json',
            xhrFields:{
                withCredentials:true
            },
            crossDomain: true,
            success: function(json){
                console.log(json)
                if(json){
                    location.href="./index.html";
                    $.cookie('username',json.username,{ path: '/'});
                }else{
                    $(".psd_message").html("帐号或密码错误")
                }
            },
            error: function(){
                $(".psd_message").html("帐号或密码错误")
            }
        });
    });
    $(document).keyup(function(event){
        if(event.keyCode == 13){
            $(".login").click()
        }
    })
})