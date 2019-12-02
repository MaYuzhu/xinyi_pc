//客户管理
$(function () {
    var dataUser
    var getUserData = {
        page:{
            number:1,
            size:1
        }
    }
    var totalSize = 0

    $('.left_users').click(function () {
        pageUsers()
    })

    function pageUsers() {
        getAjax(url+'user/search',getUserData,true,function (json) {
            totalSize = json.total_size
            layui.use(['laypage', 'layer'], function(){
                var laypage = layui.laypage
                    ,layer = layui.layer;
                //自定义首页、尾页、上一页、下一页文本
                laypage.render({
                    elem: 'users_page'
                    ,theme: '#e6a825'
                    ,count: totalSize
                    ,limit: 1
                    //,first: '首页'
                    //,last: '尾页'
                    ,prev: '<em><i class="iconfont icon-icon-arrow-left2"></i></em>'
                    ,next: '<em><i class="iconfont icon-icon-arrow-right2"></i></em>'
                    ,jump: function (obj) {
                        //console.log(obj.curr)
                        getUserData.page.number = obj.curr
                        getAjax(url+'user/search',getUserData,true,getUsersList,errFunc)
                    }
                });
            });
        },errFunc)

    }

    function getUsersList(json) {
        //console.log(json)
        dataUser = json.results
        layui.use('table', function(){
            var table = layui.table;
            //console.log(dataTheme)
            table.render({
                elem: '#users'

                ,data: dataUser
                ,cols: [[
                    {field:'full_name', width:'15%', title: '姓名'}
                    ,{field:'phone', width:'25%', title: '手机'}
                    ,{field:'disable', width:'15%', templet: ZhuangTai,  title: '状态'}
                    ,{field:'create_time', width:'25%', title: '创建时间'}
                    ,{fixed:'right',field:'priority', width: '15%', toolbar: '#barUser', title: '操作'}

                ]]
                /*,page: {
                    layout: [ 'prev', 'page', 'next'] //自定义分页布局
                    ,theme: '#e6a825'
                },*/
                ,page: false,
                skin: 'row', //表格风格
                even: true, //隔行背景
                //limits: [5, 10, 15], //显示
                limit: 1 //每页默认显示的数量
            });

            //监听行工具事件
            table.on('tool(users)', function(obj){
                var data = obj.data;
                //console.log(data.disable)
                if(obj.event === 'del'){
                    //layer.confirm('确定要'+ data.sex +'吗？',{btn: ['确定', '取消'],title:"提示"}, function(index){
                    layer.confirm(`确定要${data.disable?'启用':'禁用'}吗？`,{btn: ['确定', '取消'],title:"提示"}, function(index){
                        //obj.del();
                        var saveData = {
                            user_id:data.user_id,
                            disable:!data.disable
                        }
                        getAjax(url+'user/save',saveData,true,userTheme,errFunc)
                        layer.close(index);
                    });
                } else if(obj.event === 'edit'){
                    layer.prompt({
                        formType: 0
                        ,value: data.title
                        ,title: ''
                    }, function(value, index){
                        var saveData = {
                            theme_id:data.theme_id,
                            title:value
                        }
                        getAjax(url+'theme/save',saveData,true,userTheme,errFunc)
                        layer.close(index);
                    });
                }
            });
        });
    }

    function ZhuangTai(data) {
        var disable = data.disable;
        var btns = "";
        if (disable == true) {
            btns += '<a class="" style="color:#ed6638">已禁用</a>';
        }
        if (disable == false) {
            btns += '<a class="" style="color:#0b7c17">启用中</a>';
        }
        return btns;
    }
    function userTheme(json){
        console.log(json)
    }
})