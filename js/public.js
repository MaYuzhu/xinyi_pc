//全局变量、方法
//var url = 'http://www.sount.net/admin/'            //测试库
var url = 'https://api.anlanxinyi.com/admin/'
$.ajaxSetup({
    type: 'POST',
    cache:true,
    dataType: 'json',
    contentType: 'application/json',
    xhrFields:{
        withCredentials:true
    },
})

function getAjax(url, data, async, succFunc, errFunc) {
    $.ajax({
        type: 'POST',
        async: async,
        cache:true,
        url: url,
        data:JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        xhrFields:{
            withCredentials:true
        },
        //traditional: true,
        crossDomain: true,
        success: function (json) {
            succFunc(json);
        },
        error: function (err) {
            errFunc(err);
        },
    })
}

function errFunc(err) {
    console.log(err);
    if(err.status===500){
        layer.msg('服务器异常，未得到数据')
    }else if(err.status===403){
        layer.msg('未授权')
    }else if(err.status===401){
        location.href="./login.html";
    }else if(err.status===404){
        layer.msg('未找到您要访问到数据')
    }else{
        layer.msg('暂无数据');
    }
}