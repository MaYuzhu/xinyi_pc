//量表管理
$(function () {

    var form, table
    layui.use(['form', 'layedit', 'laydate','table'], function(){
        form = layui.form
        table = layui.table
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

    var groupDataArr = []
    var totalSize = 0
    var question_num_old = 0
    var scale_id
    $('.left_gauge').click(function () {
        pageScale()
        $('.gauge_content').show()
        $('.scale_details').hide()
        $('.scale_add_box').hide()
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
        // $('.gauge_content').show()
        // $('.scale_details').hide()
        // $('.scale_add_box').hide()
        $('.left_gauge').click()
        table.render('#gauge')
    })

    //添加分组
    var options_length_num = 0
    $('.add_group_btn').click(function () {
        $('.add_group_wrap').show()
        $('.add_group_title').text($('.scale_details_title').eq(0).text())
        $('.group_add_options').empty()

        getAjax(url+'question-group/list',{scale_id:$('.scale_details_title').attr('id')},true,function (json) {
            //console.log(json)
            options_length_num = json.results.length
            for(var i=0;i<json.results.length;i++){
                $('.group_add_options').append(`<li class=li${i}>
                    <p>分组名称</p>
                    <p><input group_id=${json.results[i].group_id} value=${json.results[i].title} class="options_input" type="text"></p>
                    
                    <p class="delete_option_group" value=${i} group_id=${json.results[i].group_id}
                        style="display:${(json.results.length)==options_length_num?'block':'block'}">
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
	    //$(`.group_add_options>:last-child .delete_option_group`).remove()
	    $('.group_add_options').append(`<li class=li${options_length_num-1}>
                    <p>分组名称</p>
                    <p><input class="options_input" type="text"></p>
                    
                    <p class="delete_option_group" value=${options_length_num-1}><i class="iconfont icon-shanchu"></i></p>
                </li>`)
	    delete_option_group()
    })
  
    //增加问题（评分项）
    var num_add_question = 0
    var num_add_option = 0
    $('.add_question').click(function () {

        $(this).attr('num',num_add_question)
        if($(this).attr('num')>0){

        }

	      num_add_question++  //<span>问题</span>${num_add_question}
        $('.scale_details_content_edit').append(`<li class=scale_details_question${num_add_question}>
            <div>
                <p>
                    <span>问题</span>
                    <span class="scale_details_question_p">
                      <input class='scale_details_question_input${num_add_question} scale_question_input_content' type="text">
                    </span>
                    <span style="margin-left:18px;">本题满分</span>
                    <span class="scale_details_question_p scale_question_input_weight" style="width: 50px">
                      <input class='scale_details_question_input scale_details_question_weight${num_add_question}'  type="number">
                    </span>
                </p>
                <ul class='scale_details_options${num_add_question} scale_details_options'>
                    <!--<li><span>选项1</span><input type="text"></li>
                    <li><span>选项2</span><input type="text"></li>-->
                </ul>
                <div class="add_option_item${num_add_question} add_option_item">增加选项</div>
                <form class="layui-form layui-form-pane select_item_form" action="">
                    <select class="select_item${num_add_question} select_item"  name="interest" lay-filter="aihao">
                        
                    </select>
                </form>
                
            </div>
            <div class="scale_details_options_edit">
                <div class="del${num_add_question}"><i class="iconfont icon-shanchu"></i></div>
                <!--<div><i class="iconfont icon-bianji"></i></div>-->
            </div>
            <div class="save_question save_question${num_add_question}" num=${num_add_question}>保存</div>
        </li>`)
          //$('.select_item').empty()
	      $(`.select_item${num_add_question}`).append(`<option value='null'>选择分组</option>`)
          for(let i=0;i<groupDataArr.length;i++){
            $(`.select_item${num_add_question}`).append(`<option value=${groupDataArr[i].group_id}>${groupDataArr[i].title}</option>`)
          }

	      del_question_item()
	      add_option_item()
          save_question()
	      form.render('select')

    })

    //确定分组
    $('.button_add_group_confirm').click(function () {

        var groupSaveData = []
	        //scale_id:$('.scale_details_title').attr('id'),//question-group/save
          //title:$('.group_add_options .options_input').val()
        $('.group_add_options .options_input').each(function (i) {
	          groupSaveData.push({
		          group_id:$(this).attr('group_id')?$(this).attr('group_id'):null,
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
            if(theme_id==themeList[i].theme_id){
                $('.add_scale_theme').append(`
                    <option selected='selected' value=${themeList[i].theme_id}>${themeList[i].title}</option>
                `)
            }else {
                $('.add_scale_theme').append(`
                    <option value=${themeList[i].theme_id}>${themeList[i].title}</option>
                `)
            }

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
                    {fixed:'left',field:'title', minWidth:220,  title: '量表名称'}
                    ,{field:'description',align:'center', width:120, title: '量表说明'}
                    ,{field:'promise', align:'center', width:220, title: '指导语'}
                    ,{field:'answer_time', align:'center', width:150, title: '答题时间（分钟）'}
                    ,{field:'publish_explain',align:'center', width:120, templet:FabuZhuangTai, title: '发布状态'}
                    ,{field:'disable_explain',align:'center', width:120, templet:ZhuangTai, title: '禁用状态'}
                    ,{field:'create_time', align:'center', width:220, title: '创建时间'}
                    ,{fixed:'right',field:'priority', width:180, toolbar: '#barScale', title: '操作'}

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
                            scale_id:data.scale_id,
                            disable:!data.disable
                        }
                        getAjax(url+'scale/disable',saveData,true,scaleDisable,errFunc)
                        layer.close(index);
                    });
                }else if(obj.event === 'publish'){
                    layer.confirm(`确定要${data.publish?' ':'发布'}吗？`,{btn: ['确定', '取消'],title:"提示"}, function(index){
                        //obj.del();
                        var saveData = {
                            scale_id:data.scale_id,
                            publish:!data.publish
                        }
                        getAjax(url+'scale/publish',saveData,true,function (json) {
                            if(json){
                                layer.msg('已发布')
                                $('.left_gauge').click()
                            }
                        },errFunc)
                        layer.close(index);
                    });
                }else if(obj.event === 'edit'){
                    $('.scale_add_wrap').show()
                    getAjax(url+'scale/get',{scale_id:data.scale_id},true,getScale,errFunc)
                } else if(obj.event === 'details'){
                    var questionListData = {
                        paging:false,
                        scale_id:data.scale_id,
                        with_option:true
                    }
                    $('.gauge_content').hide()
                    $('.scale_add_box').hide()
                    $('.scale_details').show()
                    num_add_question = 0
                    $('.scale_details_title').text(data.title)
                    $('.scale_details_title').attr('id',data.scale_id)
                    getAjax(url+'question/list',questionListData,true,getQuestionList,errFunc)
                    getAjax(url+'question-group/list',{scale_id:data.scale_id},true,getGroupList,errFunc)
                } else if(obj.event === 'add'){
                    $('.gauge_content').hide()
                    $('.scale_details').hide()
                    $('.scale_add_box').show()
                    var questionListData = {
                        paging:false,
                        scale_id:data.scale_id,
                        with_option:true
                    }
                    num_add_question = 0
                    scale_id = data.scale_id
                    $('.scale_details_title').text(data.title)
                    $('.scale_details_title').attr('id',data.scale_id)
                    getAjax(url+'question/list',questionListData,true,setQuestionList,errFunc)
                }
            });
        });
    }

    var theme_id = null
    function getScale(json) {
        console.log(json)
        $('.scale_title_add_edit').text('编辑量表')
        $('.scale_add_title').val(json.title)
        $('.scale_add_time').val(json.answer_time)
        $('.scale_add_description').val(json.description)
        $('.scale_add_promise').val(json.promise)
        theme_id = json.theme.theme_id
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
        //console.log(json)
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
                                <!--<div class="scale_details_options_edit">
                                    <div qu_id=${questionData[i].question_id}><i class="iconfont icon-shanchu"></i></div>
                                    <div qu_id=${questionData[i].question_id}><i class="iconfont icon-bianji"></i></div>
                                </div>-->
                            </li>`)
                //$('.scale_details_options').empty()
                for(var j=0;j<questionData[i].options.length;j++){
                    $(`.scale_details_options${i}`).append(`<li>${questionData[i].options[j].content}（${questionData[i].options[j].score}分）</li>`)
                }

            }
        }
        //编辑量表问题
        /*$('.scale_details_options_edit>:nth-child(2)').click(function () {
            $('.scale_details_edit_wrap').show()
            var qu_id = $(this).attr('qu_id')
            $('.button_edit_question_close').click(function () {
                $('.scale_details_edit_wrap').hide()
            })
            $('.close_scale_details_edit').click(function () {
                $('.button_edit_question_close').click()
            })
            getAjax(url+'question/get',{with_option:true,question_id:qu_id},true,getQuestion,errFunc)
        })*/

    }

    function setQuestionList(json) {
        //console.log(json)
        getAjax(url+'question-group/list',{scale_id:scale_id},true,getGroupList,errFunc)
        $('.scale_details_content_edit').empty()
        var questionData = json.results
        question_num_old = questionData.length
        num_add_question = question_num_old
        if(questionData.length>0){

            for(var i=0;i<questionData.length;i++){
                $('.scale_details_content_edit').append(`<li class=scale_details_question${i}>
                   
                    <div>
                        <p>
                            <span>问题</span>
                            <span class="scale_details_question_p">
                              <input class='scale_details_question_input${num_add_question} scale_question_input_content' 
                                value=${questionData[i].content} type="text">
                            </span>
                            <span style="margin-left:18px;">本题满分</span>
                            <span class="scale_details_question_p scale_question_input_weight" style="width: 50px">
                              <input class='scale_details_question_input scale_details_question_weight${num_add_question}'  
                              value=${questionData[i].weight} type="number">
                            </span>
                        </p>
                        <ul class='scale_details_options${i} scale_details_options'>
                            <!--<li><span>选项1</span><input type="text"></li>
                            <li><span>选项2</span><input type="text"></li>-->
                        </ul>
                        <div class="add_option_item${i} add_option_item">增加选项</div>
                        <form class="layui-form layui-form-pane select_item_form" action="">
                            <select class="select_item${i} select_item"  name="interest" lay-filter="aihao">
                                
                            </select>
                        </form>
                        
                    </div>
                    <div class="scale_details_options_edit">
                        <div class="del_question del${i}" num=${i} value=${questionData[i].question_id}><i class="iconfont icon-shanchu"></i></div>
                        <!--<div><i class="iconfont icon-bianji"></i></div>-->
                    </div>
                    <div class="save_question save_question${i}" num=${i} value=${questionData[i].question_id}>保存</div>
                </li>`)
                //$(`scale_details_options${num_add_question}`).empty()
                for(var j=0;j<questionData[i].options.length;j++){
                    $(`.scale_details_options${i}`).append(`
                        
                        <li class="add_option_li${num_add_option} add_option_li del_option${questionData[i].options[j].option_id}">
                            <span>选项</span>
                            <span class="add_option_li_input">
                                <input data_id=${questionData[i].options[j].option_id} value=${questionData[i].options[j].content} class="option_content" type="text">
                            </span>
                            <span style="margin-left:20px">分值</span>
                            <span class="add_option_li_input" style="width:50px;">
                                <input value=${questionData[i].options[j].score} class="option_score" type="number">
                            </span>
                            <div data_id=${questionData[i].options[j].option_id} class="del_option_i${num_add_option} del_option_i"><i class="iconfont icon-shanchu"></i></div>
                        </li>
                    `)
                }
                $(`.select_item${i}`).empty()
                $(`.select_item${i}`).append(`<option value='null'>选择分组</option>`)
                form.render('select')
            }

            delQuestion()
            delOption()
            add_option_item()
            save_question()
        }
    }

    function getGroupList(json) {
        groupDataArr = json.results
        console.log(groupDataArr)
        for(let i=0;i<groupDataArr.length;i++){
            $('.select_item').append(`
                <option value=${groupDataArr[i].group_id}>${groupDataArr[i].title}</option>
            `)
            form.render('select')
        }
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
                    <span class="add_option_li_input"><input class="option_content" type="text"></span>
                    <span style="margin-left:20px">分值</span>
                    <span class="add_option_li_input" style="width:50px;"><input class="option_score" type="number"></span>
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
        $('.delete_option_group').each(function () {
            $(this).unbind().click(function () {
                var index = $(this).attr('value')*1
                var group_id = $(this).attr('group_id')
                getAjax(url+'question-group/remove',{group_id:group_id},true,function (json) {
                    if(json){
                        //console.log(json)
                        $(`.group_add_options .li${index}`).remove()
                    }
                },errFunc)
            })
        })

    }

    function groupSave(json) {
      //console.log(json)
    }

    //禁用、启用量表
    function scaleDisable(json) {
        if(json){
            //layer.msg('已禁用')
            $('.left_gauge').click()
        }
    }

    //删除问题
    function delQuestion(){
        $('.del_question').each(function () {
            $(this).unbind().click(function () {
                //alert($(this).attr('num'))
                $(`.scale_details_question${$(this).attr('num')}`).remove()
                getAjax(url+'question/remove',{question_id:$(this).attr('value')},true,function (json) {
                    if(json){
                        $(`.scale_details_question${$(this).attr('num')}`).remove()
                        layer.msg('删除成功！')
                        console.log(json)
                    }
                },errFunc)
            })
        })
    }
    
    //保存问题
    function save_question() {
        $('.save_question').each(function () {
            $(this).unbind().click(function () {
                //alert($(this).attr('value'))
                //console.log($(this).attr('num'))
                var num = $(this).attr('num')
                var question_id = $(this).attr('value')
                var options = []
                for(var i=0;i<$(`.scale_details_options${num}>li`).length;i++){
                    var option_id = $(`.scale_details_options${num}>:nth-child(${i+1}) .option_content`).attr('data_id')
                    options.push({
                        option_id:option_id?option_id:null,
                        content:$(`.scale_details_options${num}>:nth-child(${i+1}) .option_content`).val(),
                        score:$(`.scale_details_options${num}>:nth-child(${i+1}) .option_score`).val(),
                        priority:i
                    })
                }
                //保存问题
                var questionSaveData = {
                    scale_id:$('.scale_details_title').attr('id'),
                    //group_id:$(`.scale_details_question${num} .select_item`).val(),
                    content:$(`.scale_details_question${num} .scale_question_input_content`).val(),
                    weight:$(`.scale_details_question${num} .scale_question_input_weight>input`).val(),
                    priority:num_add_question,
                    options:options,
                    question_id:question_id?question_id:null
                }
                var group_id = $(`.scale_details_question${num} .select_item`).val()*1
                if(group_id){
                    questionSaveData.group_id = group_id
                }
                //console.log(questionSaveData)
                for(var key in questionSaveData){
                    //console.log(questionSaveData[key]);
                    if(!questionSaveData['content']){
                        layer.msg('请填写问题内容')
                        return
                    }
                    if(!questionSaveData['weight']){
                        layer.msg('请填写问题分值')
                        return
                    }
                    //console.log(groupDataArr)
                    if(groupDataArr.length>=1){
                        if(!questionSaveData['group_id']){
                            layer.msg('请选择分组')
                            return
                        }
                    }

                    if(key == 'options'){
                        if(questionSaveData.options.length<1){
                            layer.msg('请填写选项')
                            return
                        }
                        for(var i=0;i<questionSaveData.options.length;i++){
                            if(!questionSaveData['options'][i].content){
                                layer.msg('请填写选项')
                                return
                            }
                            if(!questionSaveData['options'][i].score){
                                layer.msg('请填写选项分值')
                                return
                            }
                        }
                    }
                }

                getAjax(url+'question/save',questionSaveData,true,function (json) {
                    if(json){
                        layer.msg('保存成功！')
                        //console.log(json)
                    }
                },errFunc)
            })
        })
    }

    //删除选项
    function delOption() {
        $('.del_option_i').each(function () {
            $(this).unbind().click(function () {
                //alert($(this).attr('data_id'))
                $(`.del_option${$(this).attr('data_id')}`).remove()
                getAjax(url+'question/remove-option',{option_id:$(this).attr('data_id')},true,function (json) {
                    if(json){
                        $(`.del_option${$(this).attr('data_id')}`).remove()
                        layer.msg('删除成功！')
                        //console.log(json)
                    }
                },errFunc)
            })
        })
    }
})

