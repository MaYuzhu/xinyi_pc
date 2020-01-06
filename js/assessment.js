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
        $('.assessment_export').hide()
        $('.ass_export_btn').hide()
        getAssData.member_id = null
        $('.assessment .input_sousuo input').val('')
        pageAss()

        $(".ass_export_btn").unbind().click(function(){
            $("#ass_export").table2excel({
                exclude: ".noExl",
                name: "测评报表",
                filename: "测评报表",
                exclude_img: true,
                exclude_links: true,
                exclude_inputs: true
            });
        });
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
                    {field:'scale', templet: scaleTitle, title: '量表名称'}
                    ,{field:'theme', templet: scaleName, align:'center', width:120, title: '用户名'}
                    ,{field:'phone', templet: scalePhone, align:'center', width:140, title: '手机号'}
                    ,{field:'total_score', align:'center', width:100, title: '得分'}
                    //,{field:'record_id', width:'15%', title: 'id'}
                    ,{field:'complete_time', align:'center', width:220,  title: '完成时间'}  //templet: ZhuangTai,
                    ,{field:'create_time', align:'center', width:220, title: '创建时间'}
                    ,{fixed:'right',field:'priority', width:120, toolbar: '#barAss', title: '操作'}

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
                    $('.assessment_export').hide()
                    $('.assessment_content').hide()
                    $('.assessment_details').show()
                    getAjax(url+'record/get',{record_id:data.record_id},true,recordGet, errFunc)
                }else if(obj.event === 'export'){
                    $('.assessment_export').show()
                    $('.assessment_content').hide()
                    $('.assessment_details').hide()
                    $("#ass_export").empty()
                    getAjax(url+'record/get',{record_id:data.record_id},true,recordExport, errFunc)
                }
            })
        })
    }

    //返回量表列表
    $('.assessment .back_ass_content').click(function () {
        $('.left_ass').click()
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
        //console.log(json)
	    dataAll = json

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

    function recordExport(json) {
        //console.log(json)
        $('#ass_export').append(`
            <tr>
                <td colspan='4' style="border: none;text-align: left;">
                姓名：${json.member.full_name?json.member.full_name:''}&nbsp;&nbsp;&nbsp;&nbsp;
                昵称：${json.member.nickname?json.member.nickname:''}&nbsp;&nbsp;&nbsp;&nbsp;
                手机：${json.member.phone?json.member.phone:''}&nbsp;&nbsp;&nbsp;&nbsp; 
                </td>
            </tr>
            <tr>
                <td colspan='4' style="border: none;text-align: left;">
                
                角色：${json.role.title}&nbsp;&nbsp;&nbsp;&nbsp;
                时间：${json.role.create_time}
                   
                </td>
            </tr>
            <tr><td colspan='4'>量表名称：${json.scale.title}</td></tr>
            <tr><td colspan='4'>得分：${json.total_score}</td></tr>
        `)
        for(var i=0;i<json.groups.length;i++){
            $('#ass_export').append(`
                <tr>
                    <td colspan='4'>分组：${json.groups[i].group.title}&nbsp;(得分：${json.groups[i].score})</td>
                </tr>
            `)
            if(json.groups[i].details){
                for(var j=0;j<json.groups[i].details.length;j++){

                    $('#ass_export').append(`
                    <tr>
                        <td>题目：${j+1}</td>
                        <td>${json.groups[i].details[j].question.content}</td>
                        <td>选项：${json.groups[i].details[j].my_option?json.groups[i].details[j].my_option.content:'未选择'}</td>
                        <td>得分：${json.groups[i].details[j].my_option?json.groups[i].details[j].my_option.score:0}</td>
                    </tr>
                `)
                }
            }


        }
        $('.ass_export_btn').show()
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

    function scaleName(data) {
    	//console.log(data)
        var name = data.member.nickname?data.member.nickname:''
        return name
    }

    function scalePhone(data) {
        var phone = data.member.phone?data.member.phone:''
        return phone
    }

    function getSomething(data) {
        var r = 0;
        var phone = ''
        return new Promise(function(resolve) {
            setTimeout(function() {
                r = 2;
                resolve(r);
            }, 1000);
            /*getAjax(url+'record/get',{record_id:data.record_id},true,function (json) {
                phone = json.member.phone,
                resolve(phone);
            },errFunc)*/
        });
    }

    async function compute(data) {
        var x = await getSomething(data);
        console.log(x);
        console.log(typeof x);
        return x
    }
    //compute();
})