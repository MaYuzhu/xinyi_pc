$(function () {

    var dataTheme = null
    //获取主题列表
    getAjax(url+'theme/search',{paging:false},true,getThemeList,errFunc)

    function getThemeList(json) {
        //console.log(json)
        dataTheme = {
            code:0,
            msg:"",
            count: json.total_size,
            data: json.results
        }
        /*dataTheme = {"code":0,
            "msg":"",
            "count":50,
            "data":[
                {
                    "title":"中学生心理主题",
                    "sex":"启用",
                    "create_time":"2019-03-14 15:59:44",
                    "sign":"1"
                },
                {
                    "title":"中学生心理主题123",
                    "sex":"禁用",
                    "create_time":"2019-03-14 15:59:44",
                    "sign":"2"
                }
            ]
        }*/
        layui.use('table', function(){
            var table = layui.table;
            //console.log(dataTheme)
            table.render({
                elem: '#zhuti'
                //,url:'./js/aa.json'
                //,width: '100%'
                //,height: 530
                ,data: dataTheme.data
                ,cols: [[
                    {field:'title', width:'45%', title: '主题名称'}
                    ,{field:'disable', width:'15%', templet: ZhuangTai,  title: '状态'}
                    ,{field:'create_time', width:'25%', title: '创建时间'}
                    ,{fixed:'right',field:'priority', width: '15%', toolbar: '#barDemo', title: '操作'}

                ]]
                ,page: {
                    layout: [ 'prev', 'page', 'next'] //自定义分页布局
                    ,theme: '#e6a825'
                },
                skin: 'row', //表格风格
                even: true, //隔行背景
                //limits: [5, 10, 15], //显示
                limit: 10 //每页默认显示的数量
            });

            //监听行工具事件
            table.on('tool(zhuti)', function(obj){
                var data = obj.data;
                //console.log(data.disable)
                if(obj.event === 'del'){
                    //layer.confirm('确定要'+ data.sex +'吗？',{btn: ['确定', '取消'],title:"提示"}, function(index){
                    layer.confirm(`确定要${data.disable?'启用':'禁用'}吗？`,{btn: ['确定', '取消'],title:"提示"}, function(index){
                        //obj.del();
                        var saveData = {
                            theme_id:data.theme_id,
                            disable:!data.disable
                        }
                        getAjax(url+'theme/save',saveData,true,saveTheme,errFunc)
                        layer.close(index);
                    });
                } else if(obj.event === 'edit'){
                    layer.prompt({
                        formType: 0
                        ,value: data.title
                        ,title: '主题名称'
                    }, function(value, index){
                        var saveData = {
                            theme_id:data.theme_id,
                            title:value
                        }
                        getAjax(url+'theme/save',saveData,true,saveTheme,errFunc)
                        layer.close(index);
                    });
                }
            });
        });
    }

    //点击添加主题
    $('.zhuti_add').click(function () {
        layer.prompt({
            formType: 0,
            value: '',
            placeholder: '输入原因',
            title: '添加主题',
            area: ['800px', '150px'] //自定义文本域宽高
        }, function(value, index, elem){
            alert(value); //得到value
            var saveData = {
                title:value
            }
            getAjax(url+'theme/save',saveData,true,saveTheme,errFunc)
            layer.close(index);
        });
    });

    //搜索
    $('.search').click(function () {
        var disable = $('select[name=interest]').val()=='true'?true:$('select[name=interest]').val()=='false'?false:null
        var title_like = $('.input_sousuo input').val()
        var searchData = {
            disable:disable,
            title_like:title_like
        }
        getAjax(url+'theme/search',searchData,true,getThemeList,errFunc)

    })

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

    function saveTheme(json){
        //console.log(json)
        getAjax(url+'theme/search',{paging:false},true,getThemeList,errFunc)
    }

})