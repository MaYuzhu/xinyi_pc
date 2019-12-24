
//管理员
$(function () {
    var dataAdmin
    var getAdminData = {
        page:{
            number:1,
            size:10
        }
    }
    var totalSize = 0

    $('.left_admin').click(function () {
        $('.user_name_show').text($.cookie('username'))
        pageAdmin()
    })

    function pageAdmin() {
        getAjax(url+'user/search',getAdminData,true,function (json) {
            totalSize = json.total_size
            layui.use(['laypage', 'layer'], function(){
                var laypage = layui.laypage
                    ,layer = layui.layer;
                //自定义首页、尾页、上一页、下一页文本
                laypage.render({
                    elem: 'admin_page'
                    ,theme: '#e6a825'
                    ,count: totalSize
                    ,limit: 10
                    //,first: '首页'
                    //,last: '尾页'
                    ,prev: '<em><i class="iconfont icon-icon-arrow-left2"></i></em>'
                    ,next: '<em><i class="iconfont icon-icon-arrow-right2"></i></em>'
                    ,jump: function (obj) {
                        //console.log(obj.curr)
                        getAdminData.page.number = obj.curr
                        getAjax(url+'user/search',getAdminData,true,getAdminList,errFunc)
                    }
                });
            });
        },errFunc)

    }

    function getAdminList(json) {
        //console.log(json)
        dataAdmin = json.results
        layui.use('table', function(){
            var table = layui.table;
            //console.log(dataTheme)
            table.render({
                elem: '#admin'

                ,data: dataAdmin
                ,cols: [[
                    {field:'full_name',align:'center', width:150, title: '姓名'}
                    ,{field:'phone', align:'center', width:240, title: '手机'}
                    ,{field:'disable', align:'center', width:120, templet: ZhuangTai,  title: '状态'}
                    ,{field:'create_time', align:'center',  title: '创建时间'}
                    ,{field:'update_time', align:'center',  title: '更新时间'}
                    ,{fixed:'right',field:'priority', align:'center', width:220, toolbar: '#barAdmin', title: '操作'}

                ]]
                /*,page: {
                    layout: [ 'prev', 'page', 'next'] //自定义分页布局
                    ,theme: '#e6a825'
                },*/
                ,page: false,
                //skin: 'row', //表格风格
                even: false, //隔行背景
                //limits: [5, 10, 15], //显示
                limit: 10 //每页默认显示的数量
            });

            //监听行工具事件
            table.on('tool(admin)', function(obj){
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
                        getAjax(url+'user/save',saveData,true,adminTheme,errFunc)
                        layer.close(index);
                    });
                } else if(obj.event === 'edit'){
                    alert('编辑')
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
    function adminTheme(json){
        console.log(json)
    }

    //退出
    $('.logout_admin').click(function () {
        $('.logout').click()
    })

})