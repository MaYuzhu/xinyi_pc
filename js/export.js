
$(function () {



    $('.left_export').click(function () {
        $('.export_content').show()
        $('.export_content_details').hide()
        $('.loading_data_p').hide()

        $(".track_export_btn").click(function(){
            $("#track_export").table2excel({
                exclude: ".noExl",
                name: "打卡报表",
                filename: "打卡报表",
                exclude_img: true,
                exclude_links: true,
                exclude_inputs: true
            });
        });
    })
    var size_page = 10
    var reportListData = {
        page:{
            number:1,
            size:size_page
        },
        paging: true,
    }
    var totalSize
    var member_id
    var dataTrackReport
    //搜索用户
    $('.search_track_report').click(function () {
        var phone = $('.export_content .input_sousuo input').val().trim()

        if(!phone){
            layer.msg('手机号不能为空...')
            return
        }

        getAjax(url+'member/search',{phone:phone},true,function (json) {
            //console.log(json)
            member_id = json.results[0].member_id
            if(json.results.length>0){
                reportListData.member_id = json.results[0].member_id
                reportListData.range = $('.export .input_wrap select').val()
                reportListData.caliber =3
                pageReportList()
            }else {
                layer.msg('未找到...')
                return
            }

        },errFunc)

    })

    //返回
    $('.export .back_ass_content').click(function () {
        $('.export_content').show()
        $('.export_content_details').hide()
        $('.loading_data_p').hide()
    })

    function pageReportList() {
        getAjax(url+'track-report/list',reportListData,true,function (json) {
            //console.log(json)
            totalSize = json.total_size
            layui.use(['laypage', 'layer'], function(){
                var laypage = layui.laypage
                    ,layer = layui.layer;
                //自定义首页、尾页、上一页、下一页文本
                laypage.render({
                    elem: 'export_page'
                    ,theme: '#e6a825'
                    ,count: totalSize
                    ,limit: reportListData.page.size
                    //,first: '首页'
                    //,last: '尾页'
                    ,prev: '<em><i class="iconfont icon-icon-arrow-left2"></i></em>'
                    ,next: '<em><i class="iconfont icon-icon-arrow-right2"></i></em>'
                    ,jump: function (obj) {
                        //console.log(obj.curr)
                        reportListData.page.number = obj.curr
                        getAjax(url+'track-report/list',reportListData,true,getTrackReportList,errFunc)
                    }
                });
            });
        },errFunc)

    }


    function getTrackReportList(json){
        //console.log(json)
        dataTrackReport = json.results

        layui.use('table', function(){
            var table = layui.table;
            //console.log(dataAss)
            table.render({
                elem: '#export'
                ,data: dataTrackReport
                ,cols: [[
                    {field:'sign_in_days',  title: '打卡天数'}
                    ,{field:'not_in_days', align:'center', width:120, title: '缺卡天数'}
                    ,{field:'ranking', align:'center', width:120,  title: '排名'}  //templet: ZhuangTai,
                    ,{field:'participant_number', align:'center', width:120, title: '参与人数'}
                    ,{field:'start_date', align:'center', width:220, title: '起始时间'}
                    ,{field:'end_date', align:'center', width:220, title: '结束时间'}
                    //,{field:'participant_number', align:'center', width:220, title: '参与人数'}
                    ,{fixed:'right',field:'priority', align:'center',width:120, toolbar: '#barExport', title: '操作'}

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
            table.on('tool(export)', function(obj){
                var data = obj.data;
                if(obj.event === 'details') {
                    //console.log(data)
                    $('.export_content').hide()
                    $('.export_content_details').show()
                    $('.loading_data_p').show()
                    $('.track_export_btn').hide()
                    $("#track_export").empty()
                    getAjax(url+'track-report/get',{report_id:data.report_id,structure:1},true,reportGet, errFunc)
                }
            })
        })

    }

    function reportGet(json) { //<td style="border: none">姓名：${json.member.full_name}</td><td style="border: none">手机：${json.member.phone}</td>
        //console.log(json)
        $("#track_export").empty()
        $("#track_export").append(`
            <tr>
                <td colspan=${json.options.length+1} style="border: none;text-align: left;">
                    昵称：${json.member.nickname}
                    &nbsp;&nbsp;&nbsp;&nbsp;姓名：${json.member.full_name}
                    &nbsp;&nbsp;&nbsp;&nbsp;手机：${json.member.phone}
                </td>
            </tr>
            <tr class="tr_header"><td>日期</td></tr>
        `)
        for(var i=0;i<json.options.length;i++){

            $("#track_export .tr_header").append(`
                <td>${json.options[i].title}</td>
            `)

        }

        if(json.times.length==1){
            //月报
            for(var i=0;i<json.times[0].dailies.length;i++){
                    $("#track_export").append(`<tr class=tr${i}>
                        <td>${json.times[0].dailies[i].date.month}月${json.times[0].dailies[i].date.day}日</td>
                    </tr>`)
                //console.log(json.times[0].dailies[i].details)
                for(var j=0;j<json.times[0].dailies[i].details.length;j++){
                        $(`.tr${i}`).append(`
                        <td>${json.times[0].dailies[i].details[j].my_level}</td>
                    `)
                }
            }
            $('.track_export_btn').show()
            $('.loading_data_p').hide()
        }else {
            //年报
            for(var k=0;k<json.times.length;k++){
                for(var i=0;i<json.times[k].dailies.length;i++){
                    $("#track_export").append(`<tr class=tr${k}_${i}>
                        <td>${json.times[k].dailies[i].date.month}月${json.times[k].dailies[i].date.day}日</td>
                    </tr>`)
                    //console.log(json.times[0].dailies[i].details)
                    for(var j=0;j<json.times[k].dailies[i].details.length;j++){
                        $(`.tr${k}_${i}`).append(`
                            <td>${json.times[k].dailies[i].details[j].my_level}</td>
                        `)
                        //console.log(k)
                    }
                }

            }
            $('.track_export_btn').show()
            $('.loading_data_p').hide()

        }







    }
})