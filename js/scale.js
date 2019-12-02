//量表管理
$(function () {

    var dataScale = null
    var getScaleData = {
        page:{
            number:1,
            size:10
        },
        theme_id:1
    }
    var totalSize = 0
    $('.left_gauge').click(function () {
        pageScale()
        //getAjax(url+'scale/search',{paging:false,theme_id:1},true,getScaleList,errFunc)
    })

    //点击添加量表
    $('.gauge_add').click(function () {
        layer.prompt({
            formType: 0,
            value: '',
            title: '添加量表',
            area: ['800px', '150px'] //自定义文本域宽高
        }, function(value, index, elem){
            alert(value); //得到value
            layer.close(index);
        });
    })

    //取消编辑
    $('.button_edit_scale_close').click(function () {
        $('.scale_edit_wrap').hide()
    })
    //确定编辑
    $('.button_edit_scale_confirm').click(function () {
        var scaleSaveData = {
            scale_id:$('.scale_edit_title').attr('scale_id'),
            theme_id:1,
            title:$('.scale_edit_title').val(),
            description:$('.scale_edit_description').val(),
            priority:20,
            answer_time:$('.scale_edit_time').val()*1
        }
        getAjax(url+'scale/save',scaleSaveData,true,scaleSave,errFunc)
    })
    //返回量表列表
    $('.back_gauge_content').click(function () {
        $('.gauge_content').show()
        $('.scale_details').hide()
    })

    function pageScale() {
        getAjax(url+'scale/search',getScaleData,true,function (json) {
            totalSize = json.total_size
            layui.use(['laypage', 'layer'], function(){
                var laypage = layui.laypage
                    ,layer = layui.layer;
                //自定义首页、尾页、上一页、下一页文本
                laypage.render({
                    elem: 'gauge_page'
                    ,theme: '#e6a825'
                    ,count: totalSize
                    ,limit: 10
                    //,first: '首页'
                    //,last: '尾页'
                    ,prev: '<em><i class="iconfont icon-icon-arrow-left2"></i></em>'
                    ,next: '<em><i class="iconfont icon-icon-arrow-right2"></i></em>'
                    ,jump: function (obj) {
                        //console.log(obj.curr)
                        getScaleData.page.number = obj.curr
                        getAjax(url+'scale/search',getScaleData,true,getScaleList,errFunc)
                    }
                });
            });
        },errFunc)

    }

    function getScaleList(json) {
        //console.log(json)
        dataScale = json.results
        layui.use('table', function(){
            var table = layui.table;
            //console.log(dataTheme)
            table.render({
                elem: '#gauge'

                ,data: dataScale
                ,cols: [[
                    {fixed:'left',field:'title', width:'15%', title: '量表名称'}
                    ,{field:'description', width:'15%', title: '量表说明'}
                    ,{field:'answer_time', width:'12%', title: '答题时间（分钟）'}
                    ,{field:'disable', width:'10%', templet: ZhuangTai,  title: '状态'}
                    ,{field:'create_time', width:'15%', title: '创建时间'}
                    ,{fixed:'right',field:'priority', width: '15%', toolbar: '#barScale', title: '操作'}

                ]]
                /*,page: {
                    layout: [ 'prev', 'page', 'next'] //自定义分页布局
                    ,theme: '#e6a825'
                },*/
                ,page: false,
                skin: 'row', //表格风格
                even: true, //隔行背景
                //limits: [5, 10, 15], //显示
                limit: 10 //每页默认显示的数量
            });

            //监听行工具事件
            table.on('tool(gauge)', function(obj){
                var data = obj.data;
                //console.log(data.disable)
                if(obj.event === 'del'){
                    layer.confirm(`确定要${data.disable?'启用':'禁用'}吗？`,{btn: ['确定', '取消'],title:"提示"}, function(index){
                        //obj.del();
                        var saveData = {
                            //user_id:data.user_id,
                            disable:!data.disable
                        }
                        //getAjax(url+'user/save',saveData,true,userTheme,errFunc)
                        layer.close(index);
                    });
                } else if(obj.event === 'edit'){
                    $('.scale_edit_wrap').show()
                    getAjax(url+'scale/get',{scale_id:data.scale_id},true,getScale,errFunc)
                } else if(obj.event === 'details'){
                    var questionListData = {
                        paging:false,
                        scale_id:data.scale_id,
                        with_option:true
                    }
                    $('.gauge_content').hide()
                    $('.scale_details').show()
                    $('.scale_details_title').text(data.title)
                    getAjax(url+'question/list',questionListData,true,getQuestionList,errFunc)
                }
            });
        });
    }

    function getScale(json) {
        //console.log(json)
        $('.scale_edit_title').val(json.title)
        $('.scale_edit_title').attr('scale_id',json.scale_id)
        $('.scale_edit_description').val(json.description)
        $('.scale_edit_time').val(json.answer_time)
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

    function scaleSave(json) {
        //console.log(json)
        if(json){
            layer.msg('保存成功！')
            $('.scale_edit_wrap').hide()
        }

    }

    function getQuestionList(json) {
        console.log(json)
        $('.scale_details_content').empty()
        var questionData = json.results
        if(questionData.length>0){

            for(var i=0;i<questionData.length;i++){
                $('.scale_details_content').append(`<li>
                                <div>
                                    <p><span>${i+1}.</span><span>${questionData[i].content}</span></p>
                                    <ul class="scale_details_options">
                                        
                                    </ul>
                                </div>
                                <div class="scale_details_options_edit">
                                    <div><i class="iconfont icon-shanchu"></i></div>
                                    <div><i class="iconfont icon-bianji"></i></div>
                                </div>
                            </li>`)
                $('.scale_details_options').empty()
                for(var j=0;j<questionData[i].options.length;j++){
                    $('.scale_details_options').append(`<li>${questionData[i].options[j].content}</li>`)
                }

            }
        }

    }


})