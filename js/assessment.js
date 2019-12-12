//测评管理

var size_page = 10
$(function () {
    var dataAss
    var getAssData = {
        page:{
            number:1,
            size:size_page
        },
        paging: true,
        with_member: true,
        with_scale: true

    }
    var totalSize = 0

    var dataAll = null

    $('.left_ass').click(function () {
        $('.assessment_content').show()
        $('.assessment_details').hide()
        getAssData.member_id = null
        $('.assessment .input_sousuo input').val('')
        pageAss()
    })

    function pageAss() {
        getAjax(url+'record/search',getAssData,true,function (json) {
            //console.log(json)
            totalSize = json.total_size
            layui.use(['laypage', 'layer'], function(){
                var laypage = layui.laypage
                    ,layer = layui.layer;
                //自定义首页、尾页、上一页、下一页文本
                laypage.render({
                    elem: 'assessment_page'
                    ,theme: '#e6a825'
                    ,count: totalSize
                    ,limit: getAssData.page.size
                    //,first: '首页'
                    //,last: '尾页'
                    ,prev: '<em><i class="iconfont icon-icon-arrow-left2"></i></em>'
                    ,next: '<em><i class="iconfont icon-icon-arrow-right2"></i></em>'
                    ,jump: function (obj) {
                        //console.log(obj.curr)
                        getAssData.page.number = obj.curr
                        getAjax(url+'record/search',getAssData,true,getAssList,errFunc)
                    }
                });
            });
        },errFunc)

    }

    function getAssList(json) {
        //console.log(json)
        dataAss = json.results
        layui.use('table', function(){
            var table = layui.table;
            //console.log(dataAss)
            table.render({
                elem: '#assessment'

                ,data: dataAss
                ,cols: [[
                    {field:'scale', width:'20%', templet: scaleTitle, title: '量表名称'}
                    ,{field:'total_score', width:'10%' ,title: '得分'}
                    //,{field:'record_id', width:'15%', title: 'id'}
                    ,{field:'complete_time', width:'25%',  title: '完成时间'}  //templet: ZhuangTai,
                    ,{field:'create_time', width:'25%', title: '创建时间'}
                    ,{fixed:'right',field:'priority', width: '15%', toolbar: '#barAss', title: '操作'}

                ]]
                /*,page: {
                    layout: [ 'prev', 'page', 'next'] //自定义分页布局
                    ,theme: '#e6a825'
                },*/
                ,page: false,
                //skin: 'row', //表格风格
                //even: true, //隔行背景
                //limits: [5, 10, 15], //显示
                limit: size_page //每页默认显示的数量
            });

            //监听行工具事件
            table.on('tool(assessment)', function(obj){
                var data = obj.data;
                if(obj.event === 'details') {
                    //console.log(data.record_id)
                    getAjax(url+'record/get',{record_id:data.record_id},true,recordGet, errFunc)
                }
            })
        })
    }

    //返回量表列表
    $('.back_ass_content').click(function () {
        $('.assessment_content').show()
        $('.assessment_details').hide()

    })

    $('.search_ass').click(function () {
        var phone = $('.assessment .input_sousuo input').val()

        getAjax(url+'member/search',{phone:phone},true,function (json) {

            if(json.results.length>0){
                var member_id = json.results[0].member_id
                getAssData.member_id = member_id
                pageAss()
                //getAjax(url+'record/search',getAssData,true,getAssList,errFunc)
            }else {
                layer.msg('未找到...')
            }

        },errFunc)
    })

    $('.all_btn').click(function () {
	    recordGet(dataAll)
    })

    function recordGet(json) {
	    dataAll = json
	    $('.assessment_content').hide()
	    $('.assessment_details').show()
	    $('.ass_details_title').text(json.scale.title)
	    $('.ass_group_tab').empty()
	    $('.ass_group_content').empty()
	    $('.ass_total_score>:nth-child(2)').text(json.total_score)
	    $('.ass_role>:nth-child(2)').text(json.role.title)  //${ass_options[k].option_id==my_option?true:null}
	    for(let i=0;i<json.groups.length;i++){
		    $('.ass_group_tab').append(`<li class="ass_group_tab_li">
                                <p style="font-size:16px;">${json.groups[i].group.title}</p>
                                <p style="font-size:12px;"><span class="a0 span">得分:</span><span class="a0 span">${json.groups[i].score}</span></p>
                            </li>`)

		    $('.ass_group_content').append(`<li>
                                <ul class='ass_details_content${i} ass_content'>
                                    
                                </ul>
                            </li>`)
		    $('.ass_details_content').empty()
		    var ass_details = json.groups[i].details
		    for(let j=0;j<json.groups[i].details.length;j++){
			    $(`.ass_details_content${i}`).append(`<li>
                                    <p>${json.groups[i].details[j].question.content}</p>
                                    <ul class='ass_options${j}'>
                                        
                                    </ul>
                                </li>`)
			    var ass_options = json.groups[i].details[j].question.options
			    $('.ass_options').empty()
			    var my_option = 0
			    //console.log(ass_options)
			    for (let k=0;k<ass_options.length;k++){
				    if(ass_details[j].my_option){
					    my_option = ass_details[j].my_option.option_id
					    //console.log(ass_details[j].my_option.option_id)
				    }else {
					    my_option = -1
				    }

				    $(`.ass_details_content${i} .ass_options${j}`).append(`<li>
                                        <input ${ass_options[k].option_id == my_option?'checked':''}
                                        disabled="disabled" type="radio"/>
                                        <text>${ass_options[k].content} (分值:${ass_options[k].score})</text>
                                    </li>`)
			    }

		    }

	    }
	    group_item()
    }

    function scaleTitle(data) {
        var scale_title = ' '
        //console.log(data)
        if(data.scale){
            scale_title = data.scale.title
        }
        return scale_title;
    }

    function group_item() {
        $('.ass_group_tab_li').each(function (i) {
            $(this).click(function () {
              //alert(i)
	            $('.ass_group_tab_li').eq(i).addClass("red").siblings().removeClass("red")
	            $('.ass_group_tab_li').eq(i).find('.span').addClass("red").removeClass('a0')
	            $('.ass_group_tab_li').eq(i).siblings().find('.span').addClass('a0').removeClass("red");
	            //console.log(dataAll.groups[i].details)
              var group = dataAll.groups[i].details
	            $('.ass_group_content').empty()
              for(let l=0;l<group.length;l++){
	              $('.ass_group_content').append(`<li class="ass_group_content_item">
                    <p>${l+1}. ${group[l].question.content}</p>
                    <ul class='ass_options${l}'>
                        
                    </ul>
                </li>`)
	              var ass_options = group[l].question.options
	              $('.ass_options').empty()
	              var my_option = 0
	              //console.log(ass_options)
	              for (let k=0;k<ass_options.length;k++){
		              if(group[l].my_option){
			              my_option = group[l].my_option.option_id

		              }else {
			              my_option = -1
		              }

		              $(`.ass_options${l}`).append(`<li>
                        <input ${ass_options[k].option_id == my_option?'checked':''}
                        disabled="disabled" type="radio"/>
                        <text>${ass_options[k].content} (分值:${ass_options[k].score})</text>
                    </li>`)
	              }
              }
            })
        })

    }
})