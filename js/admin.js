var user_id
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
        getAjax(url+'user/search',{full_name:$.cookie('username')},true,function (json) {
            //console.log(json)
            //user_id = json.results[0].user_id
        },errFunc)
        pageAdmin()
    })

    $('input[name=pwd]').focus(function () {
        $('input[name=pwd]').removeAttr('readonly')
    })
    $('.admin_add').click(function () {
        $('.add_admin_wrap').show()
        $('.add_admin_wrap input').val('')
    })
    $('.admin_add_edit .button_add_group_close,.admin_add_edit .close_add_group').click(function () {
        $('.add_admin_wrap').hide()
        $('.add_admin_wrap input').val('')
    })
    $('.admin_edit .button_add_group_close,.admin_edit .close_add_group').click(function () {
        $('.edit_admin_wrap').hide()
        $('.edit_admin_wrap input').val('')
    })

    $('.admin_add_edit .button_add_admin_confirm').click(function () {

        var pwd_repeat = $('.admin_add_edit .pwd_repeat').val().trim()
        var userSaveData = {
            full_name: $('.admin_add_edit .full_name').val(),
            phone: $('.admin_add_edit .phone').val(),
            password: $('.admin_add_edit .pwd').val().trim()
        }
        for(var key in userSaveData){
            if(!userSaveData[key]){
                layer.msg('请完整填写')
                return
            }
        }
        if(!(/^[1][3,4,5,7,8,9][0-9]{9}$/.test(userSaveData.phone))){
            layer.msg('请输入正确的手机号')
            return
        }
        if(userSaveData.password !== pwd_repeat){
            layer.msg('两次密码不一致')
            return
        }
        //console.log(userSaveData)
        getAjax(url+'user/save',userSaveData,true,function (json) {
            //console.log(json)
            $('.left_admin').click()
        },errFunc)
        $('.add_admin_wrap').hide()
    })

    $('.admin_edit .button_edit_admin_confirm').click(function () {
        var pwd = $('.admin_edit .pwd').val().trim()
        var pwd_old = $('.admin_edit .old_pwd').val().trim()
        var pwd_repeat = $('.admin_edit .pwd_repeat').val().trim()
        //console.log(pwd,pwd_old,pwd_repeat)
        if(pwd!==pwd_repeat){
            layer.msg('两次密码不一致')
            return
        }
        var changePwd = {
            user_id: user_id,
            password: pwd,
            old_password: pwd_old
        }
        //console.log(changePwd)
        getAjax(url+'user/change-password',changePwd,true,function (json) {
            console.log(json)
            layer.msg('密码修改完成')
            $('.edit_admin_wrap').hide()
            $('.left_admin').click()

        },errFunc)
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
                    ,{fixed:'right',field:'priority',  width:240, toolbar: '#barAdmin', title: '操作'}

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
                        getAjax(url+'user/disable',saveData,true,function (json) {
                            //console.log(json)
                            if(json){
                                layer.msg('操作成功！')
                                $('.left_admin').click()
                            }
                        },errFunc)
                        layer.close(index);
                    });
                } else if(obj.event === 'pwd'){
                    $('.edit_admin_wrap').show()
                    user_id = data.user_id
                    getAjax(url+'user/get',{user_id:data.user_id},true,getUserInfo,errFunc)
                } else if(obj.event === 'edit'){
                    //console.log(data)
                    layer.prompt({
                        formType: 0
                        ,value: data.full_name
                        ,title: '用户姓名'
                    }, function(value, index){
                        var saveData = {
                            user_id:data.user_id,
                            full_name:value
                        }
                        if(!$.trim(saveData.full_name)){
                            layer.msg('请输入用户姓名')
                            return false
                        }
                        getAjax(url+'user/save',saveData,true,function (json) {
                            if(json){
                                layer.msg('修改成功！')
                                $('.left_admin').click()
                            }
                        },errFunc)
                        layer.close(index);
                    });
                }else if(obj.event === 'delete'){
                    layer.confirm(`确定要删除吗？`,{btn: ['确定', '取消'],title:"提示"}, function(index){
                        //obj.del();
                        var saveData = {
                            user_id:data.user_id,
                        }
                        getAjax(url+'user/remove',saveData,true,function (json) {
                            if(json){
                                layer.msg('删除成功！')
                                $('.left_admin').click()
                            }
                        },errFunc)
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

    function getUserInfo(json) {
        //console.log(json)
        $('.admin_edit .full_name').val(json.full_name)
        $('.admin_edit .phone').val(json.phone)
    }

    //退出
    $('.logout_admin').click(function () {
        $('.logout').click()
    })

})