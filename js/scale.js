//量表管理
$(function () {

    var form
    layui.use(['form', 'layedit', 'laydate'], function(){
        form = layui.form
        var layer = layui.layer
        var layedit = layui.layedit
        var laydate = layui.laydate
        //表单取值
        layui.$('#LAY-component-form-getval').on('click', function(){
            var data = form.val('example');
            //alert(JSON.stringify(data));
        });

    });

    var dataScale = null
    var getScaleData = {
        page:{
            number:1,
            size:10
        },
        //theme_id:1
    }
    var totalSize = 0
    $('.left_gauge').click(function () {
        pageScale()
        $('.gauge_content').show()
        $('.scale_details').hide()
        //getAjax(url+'scale/search',{paging:false,theme_id:1},true,getScaleList,errFunc)
    })

    //点击添加量表
    $('.gauge_add').click(function () {
        $('.scale_add_wrap').show()

        $('.scale_title_add_edit').text('新增量表')
        $('.scale_add_title').val('')
        $('.scale_add_time').val('')
        $('.scale_add_description').val('')
        $('.scale_add_promise').val('')
        $('.scale_add_title').attr('scale_id',null)
        getAjax(url+'theme/search',{paging:false},true,getThemeTitle,errFunc)
    })
    //取消添加
    $('.button_add_scale_close, .close_scale_add').click(function () {
        $('.scale_add_wrap').hide()
    })
    //确定添加 or 编辑
    $('.button_add_scale_confirm').click(function () {
        var sacleSaveData = {}
        sacleSaveData.theme_id = $('.add_scale_theme').val()
        sacleSaveData.title = $('.scale_add_title').val()
        sacleSaveData.answer_time = $('.scale_add_time').val()
        sacleSaveData.promise = $('.scale_add_promise').val()
        sacleSaveData.description = $('.scale_add_description').val()

        sacleSaveData.scale_id = $('.scale_add_title').attr('scale_id')?$('.scale_add_title').attr('scale_id'):null
        console.log(sacleSaveData)
        if(sacleSaveData.theme_id==-1){
            layer.msg('请选择主题')
            return
        }
        if(!sacleSaveData.title){
            layer.msg('请输入名称')
            return
        }
        if(!sacleSaveData.answer_time){
            layer.msg('请输入答题时长')
            return
        }
        getAjax(url+'scale/save',sacleSaveData,true,scaleSave,errFunc)

    })



    //返回量表列表
    $('.back_gauge_content').click(function () {
        $('.gauge_content').show()
        $('.scale_details').hide()
    })

    //添加分组
    var options_length_num = 0
    $('.add_group_btn').click(function () {
        $('.add_group_wrap').show()
        $('.add_group_title').text($('.scale_details_title').text())
        $('.group_add_options').empty()
        options_length_num = 0
        getAjax(url+'question-group/list',{scale_id:$('.scale_details_title').attr('id')},true,function (json) {
            console.log(json)
            for(var i=0;i<json.results.length;i++){
                options_length_num ++
                $('.group_add_options').append(`<li class=li${options_length_num-1}>
                    <p>分组${options_length_num}</p>
                    <p><input value=${json.results[i].title} class="options_input" type="text"></p>
                    
                    <p class="delete_option_group" value=${options_length_num-1}
                        style="display:${(json.results.length)==options_length_num?'block':'none'}">
                        <i class="iconfont icon-shanchu"></i>
                    </p>
                </li>`)
            }
            delete_option_group()

        },errFunc)
    })
    //取消关闭
    $('.button_add_group_close,.close_add_group').click(function () {
	    $('.add_group_wrap').hide()
    })
  
    //增加组项
    $('.add_group_option').click(function () {
	    options_length_num ++
	    $(`.group_add_options>:last-child .delete_option_group`).remove()
	    $('.group_add_options').append(`<li class=li${options_length_num-1}>
                    <p>分组${options_length_num}</p>
                    <p><input class="options_input" type="text"></p>
                    
                    <p class="delete_option_group" value=${options_length_num-1}><i class="iconfont icon-shanchu"></i></p>
                </li>`)
	    delete_option_group()
    })
  
    //增加问题（评分项）
    var num_add_question = 0
	  var num_add_option = 0
    $('.add_question').click(function () {

	      num_add_question++  //<span>问题</span>${num_add_question}
        $('.scale_details_content').append(`<li class=scale_details_question${num_add_question}>
            <div>
                <p>
                    <span>问题</span>
                    <span class="scale_details_question_p">
                      <input class=scale_details_question_input${num_add_question} type="text">
                    </span>
                    <span style="margin-left:18px;">本题满分</span>
                    <span class="scale_details_question_p" style="width: 50px">
                      <input class='scale_details_question_input scale_details_question_weight${num_add_question}'  type="number">
                    </span>
                </p>
                <ul class='scale_details_options${num_add_question} scale_details_options'>
                    <!--<li><span>选项1</span><input type="text"></li>
                    <li><span>选项2</span><input type="text"></li>-->
                </ul>
                <div class="add_option_item${num_add_question} add_option_item">增加选项</div>
            </div>
            <div class="scale_details_options_edit">
                <div class="del${num_add_question}"><i class="iconfont icon-shanchu"></i></div>
                <!--<div><i class="iconfont icon-bianji"></i></div>-->
            </div>
        </li>`)
	      del_question_item()
	      add_option_item()

    })

    //确定分组
    $('.button_add_group_confirm').click(function () {

        var groupSaveData = []
	        //scale_id:$('.scale_details_title').attr('id'),//question-group/save
          //title:$('.group_add_options .options_input').val()
        $('.group_add_options .options_input').each(function (i) {
	          groupSaveData.push({
              title:$(this).val(),
		          scale_id:$('.scale_details_title').attr('id'),
	          })
        })
        //console.log(groupSaveData)
	      getAjax(url+'question-group/save',groupSaveData,true,groupSave,errFunc)

	      $('.add_group_wrap').hide()
    })

    function getThemeTitle(json) {
        $('.add_scale_theme').empty()
        //console.log(json)
        var themeList = json.results

        $('.add_scale_theme').append(`<option value="-1">请选择</option>`)
        for(var i=0;i<themeList.length;i++){
            $('.add_scale_theme').append(`<option value=${themeList[i].theme_id}>${themeList[i].title}</option>`)
        }
        form.render('select')
    }

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
            //console.log(dataScale)
            table.render({
                elem: '#gauge'

                ,data: dataScale
                ,cols: [[
                    {fixed:'left',field:'title', width:'15%', title: '量表名称'}
                    ,{field:'description', width:'10%', title: '量表说明'}
                    ,{field:'promise', width:'20%', title: '指导语'}
                    ,{field:'answer_time', width:'12%', title: '答题时间（分钟）'}
                    ,{field:'publish_explain', width:'10%', templet:FabuZhuangTai, title: '发布状态'}
                    ,{field:'disable_explain', width:'10%', templet:ZhuangTai, title: '禁用状态'}
                    ,{field:'create_time', width:'15%', title: '创建时间'}
                    ,{fixed:'right',field:'priority', width: '20%', toolbar: '#barScale', title: '操作'}

                ]]
                /*,page: {
                    layout: [ 'prev', 'page', 'next'] //自定义分页布局
                    ,theme: '#e6a825'
                },*/
                ,page: false,
                //skin: 'row', //表格风格
                //even: true, //隔行背景
                //limits: [5, 10, 15], //显示
                //limit: 10 //每页默认显示的数量
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
                    $('.scale_add_wrap').show()
                    getAjax(url+'scale/get',{scale_id:data.scale_id},true,getScale,errFunc)
                } else if(obj.event === 'details'){
                    var questionListData = {
                        paging:false,
                        scale_id:data.scale_id,
                        with_option:true
                    }
                    $('.gauge_content').hide()
                    $('.scale_details').show()
	                  num_add_question = 0
                    $('.scale_details_title').text(data.title)
	                  $('.scale_details_title').attr('id',data.scale_id)
                    getAjax(url+'question/list',questionListData,true,getQuestionList,errFunc)
                }
            });
        });
    }

    function getScale(json) {
        console.log(json)
        $('.scale_title_add_edit').text('编辑量表')
        $('.scale_add_title').val(json.title)
        $('.scale_add_time').val(json.answer_time)
        $('.scale_add_description').val(json.description)
        $('.scale_add_promise').val(json.promise)

        $('.scale_add_title').attr('scale_id',json.scale_id)
        getAjax(url+'theme/search',{paging:false},true,getThemeTitle,errFunc)
    }

    function ZhuangTai(data) {
        var disable = data.disable;
        var btns = "";
        if (disable == true) {
            btns += `<a class="" style="color:#ed6638">${data.disable_explain}</a>`;
        }
        if (disable == false) {
            btns += `<a class="" style="color:#0b7c17">${data.disable_explain}</a>`;
        }
        return btns;
    }
    function FabuZhuangTai(data) {
        var disable = data.publish;
        var btns = "";
        if (disable == true) {
            btns += `<a class="" style="color:#0b7c17">${data.publish_explain}</a>`;
        }
        if (disable == false) {
            btns += `<a class="" style="color:#dba41e">${data.publish_explain}</a>`;
        }
        return btns;
    }

    function scaleSave(json) {
        //console.log(json)
        if(json){
            layer.msg('保存成功！')
            $('.scale_add_wrap').hide()
            pageScale()
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
                                    <ul class="scale_details_options${i} scale_details_options">
                                        
                                    </ul>
                                </div>
                                <div class="scale_details_options_edit">
                                    <div qu_id=${questionData[i].question_id}><i class="iconfont icon-shanchu"></i></div>
                                    <div qu_id=${questionData[i].question_id}><i class="iconfont icon-bianji"></i></div>
                                </div>
                            </li>`)
                //$('.scale_details_options').empty()
                for(var j=0;j<questionData[i].options.length;j++){
                    $(`.scale_details_options${i}`).append(`<li>${questionData[i].options[j].content}</li>`)
                }

            }
        }
        //编辑量表问题
        $('.scale_details_options_edit>:nth-child(2)').click(function () {
            $('.scale_details_edit_wrap').show()
            var qu_id = $(this).attr('qu_id')
            $('.button_edit_question_close').click(function () {
                $('.scale_details_edit_wrap').hide()
            })
            $('.close_scale_details_edit').click(function () {
                $('.button_edit_question_close').click()
            })
            getAjax(url+'question/get',{with_option:true,question_id:qu_id},true,getQuestion,errFunc)
        })

    }

    function del_question_item() {

	      for(let i=0;i<=num_add_question;i++){
		        $(`.del${i}`).unbind().click(function () {
			          $(`.scale_details_question${i}`).remove()
			          num_add_question -=1
            })
        }
    }

    function add_option_item() {
        for(let i=0;i<=num_add_question;i++){

            $(`.add_option_item${i}`).unbind().click(function () {
	              num_add_option ++
                $(`.scale_details_options${i}`).append(`<li class="add_option_li${num_add_option} add_option_li">
                    <span>选项</span>
                    <span class="add_option_li_input"><input type="text"></span>
                    <span style="margin-left:20px">分值</span>
                    <span class="add_option_li_input" style="width:50px;"><input type="number"></span>
                    <div class="del_option_i${num_add_option}"><i class="iconfont icon-shanchu"></i></div>
                </li>`)
	              del_option_item()
            })

        }

    }

    function del_option_item() {
	      for(let i=0;i<=num_add_option;i++){
		        $(`.del_option_i${i}`).unbind().click(function () {
		            $(`.add_option_li${i}`).remove()
            })
        }
    }

    //获取问题详情
    function getQuestion(json) {
        //console.log(json)
        if(json){
            $('.scale_details_edit_title').val(json.content)
            $('.scale_edit_options').empty()
            for(var i=0;i<json.options.length;i++){
                $('.scale_edit_options').append(`<li>
                    <p>选项${i+1}</p>
                    <p><input type="text" value=${json.options[i].content}></p>
                    <p><input type="number"></p>
                    <p><i class="iconfont icon-shanchu"></i></p>
                </li>`)
            }

        }
    }


    //删除分组项
    function delete_option_group() {
	    $('.delete_option_group').unbind().click(function () {
		    var index = $(this).attr('value')*1
		    //console.log(index)
		    $(`.group_add_options .li${index}`).remove()
		    options_length_num -= 1
		    //console.log(options_length_num)
		    $(`.group_add_options>:last-child`).append(`
                <p class="delete_option_group" value=${options_length_num-1}><i class="iconfont icon-shanchu"></i></p>
             `)
		    delete_option_group()
	    })
    }

    function groupSave(json) {
      console.log(json)
    }


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
/*
$('.add_options_edit').click(function () {
	$('.scale_edit_options').append(`<li>
                    <p>选项1</p>
                    <p><input type="text"></p>
                    <p><input type="number"></p>
                    <p><i class="iconfont icon-shanchu"></i></p>
                </li>`)
})*/
