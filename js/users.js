//客户管理
$(function () {
    var dataUser
    var getUserData = {
        page:{
            number:1,
            size:10
        },
        paging:true
    }
    var totalSize = 0

    $('.left_users').click(function () {
        pageUsers()
    })

    function pageUsers() {
        getAjax(url+'member/search',getUserData,true,function (json) {
            //console.log(json)
            totalSize = json.total_size
            layui.use(['laypage', 'layer'], function(){
                var laypage = layui.laypage
                    ,layer = layui.layer;
                //自定义首页、尾页、上一页、下一页文本
                laypage.render({
                    elem: 'users_page'
                    ,theme: '#e6a825'
                    ,count: totalSize
                    ,limit: getUserData.page.size
                    //,first: '首页'
                    //,last: '尾页'
                    ,prev: '<em><i class="iconfont icon-icon-arrow-left2"></i></em>'
                    ,next: '<em><i class="iconfont icon-icon-arrow-right2"></i></em>'
                    ,jump: function (obj) {
                        //console.log(obj.curr)
                        getUserData.page.number = obj.curr
                        getAjax(url+'member/search',getUserData,true,getUsersList,errFunc)
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
                    {field:'nickname', templet: avatarNickname, title: '昵称'}
                    ,{field:'full_name', align:'center', width:100,templet: fullName,title: '姓名'}
                    ,{field:'phone', align:'center', width:180, title: '手机'}
                    ,{field:'age', align:'center', width:80, title: '年龄'}
                    ,{field:'degree', align:'center', width:120, title: '学历'}
                    ,{field:'sex', align:'center', width:80,templet: getSex, title: '性别'}
                    ,{field:'occupation', align:'center', width:120, title: '职业'}
                    ,{field:'other', align:'center', width:120,title: '其他'}
                    //,{field:'email', width:'25%',  title: '邮箱'}  //templet: ZhuangTai,
                    ,{field:'create_time', align:'center', width:220, title: '创建时间'}
                    ,{field:'priority', width: '15%', toolbar: '#barMember', title: '查看'}

                ]]
                /*,page: {
                    layout: [ 'prev', 'page', 'next'] //自定义分页布局
                    ,theme: '#e6a825'
                },*/
                ,page: false,
                //skin: 'row', //表格风格  fixed:'right',
                //even: true, //隔行背景
                //limits: [5, 10, 15], //显示
                limit: 10 //每页默认显示的数量
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
                }else if(obj.event === 'details'){
	                //console.log(data.member_id)
                  $('.member_wrap').show()
	                $('.member_group_ul').empty()
	                getAjax(url+'/member-group/get',{member_id:data.member_id},true,function (json) {
		                console.log(json.members)
		                $('.member_group_ul').empty()
                    for(var i=0;i<json.members.length;i++){
	                    $('.member_group_ul').append(`
                        <li>
                            <p><img src=${json.members[i].portrait} alt=""></p>
                            <p>${json.members[i].nickname}</p>
                            <p>${json.members[i].phone}</p>
                        </li>`)
                    }
	                },errFunc)
                }
            });
        });
    }

    $('.search_user').click(function () {
        var phone = $('.users .input_sousuo input').val()

        getAjax(url+'member/search',{phone:phone},true,getUsersList,errFunc)
    })

    $('.member_close').click(function () {
      $('.member_wrap').hide()
    })

    function avatarNickname(data) {
        var avatarNickname,avatar,Nickname
        if(data.portrait){
            avatar = `<img src=${data.portrait} style="width:36px;height:36px;border-radius:24px;margin: 8px 0">`
        }else {
            avatar = `<img src='./img/avatar.png' style="width:36px;height:36px;border-radius:24px;margin: 8px 0">`
        }
        if(data.nickname){
            Nickname = `<text style="margin-left: 10px">${data.nickname}</text>`
        }else {
            Nickname = '<text style="margin-left: 10px">未知</text>'
        }
        avatarNickname = avatar + Nickname
        //var btns = `<img src=${data.portrait} style="width:40px;height:40px;border-radius:24px"><text>${data.nickname}</text>`
        return avatarNickname;
    }
    function fullName(data) {
        var full_name
        if(data.full_name){
            full_name = `<text>${data.full_name}</text>`
        }else {
            full_name = `<text>未知</text>`
        }
        return full_name
    }
    function getSex(data) {
        var sex
        if(data.sex == 1){
            sex = `<text>男</text>`
        }else if(data.sex == 2){
            sex = `<text>女</text>`
        }else {
            sex = `<text> </text>`
        }
        return sex

    }
    function userTheme(json){
        console.log(json)
    }
})