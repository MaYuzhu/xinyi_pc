$(function () {
    var dataClock
    var getClockData = {
        page:{
            number:1,
            size:10
        },
        paging:true
    }
    var totalSize = 0
    var member_id = ''
    var member_id_record = ''
    var options_length_num = 0
	  var record_id = ''
    var TrackList = []
    $('.left_clock').click(function () {

		    $('.clock_history').hide()
		    $('.clock_content').show()

        $('.search_add_clockin').hide()
        $('.clockin .input_sousuo input').val('')
        pageClock()
        //getAjax(url+'track-scale/list',{paging:false},true,getClockList,errFunc)
    })

    function pageClock() {
        //
        getAjax(url+'track-scale/list',getClockData,true,function (json) {
            //console.log(json)
            totalSize = json.total_size
            layui.use(['laypage', 'layer'], function(){
                var laypage = layui.laypage
                    ,layer = layui.layer;
                //自定义首页、尾页、上一页、下一页文本
                laypage.render({
                    elem: 'clock_page'
                    ,theme: '#e6a825'
                    ,count: totalSize
                    ,limit: getClockData.page.size
                    //,first: '首页'
                    //,last: '尾页'
                    ,prev: '<em><i class="iconfont icon-icon-arrow-left2"></i></em>'
                    ,next: '<em><i class="iconfont icon-icon-arrow-right2"></i></em>'
                    ,jump: function (obj) {
                        //console.log(obj.curr)
                        getClockData.page.number = obj.curr
                        getAjax(url+'track-scale/list',getClockData,true,getClockList,errFunc)
                    }
                });
            });
        },errFunc)

    }

    function getClockList(json) {
        //console.log(json)
        dataClock = json.results
        layui.use('table', function(){
            var table = layui.table;
            table.render({
                elem: '#clock'

                ,data: dataClock
                ,cols: [[
                    {field:'title',  title: '打卡量表'}
                    ,{field:'publish_explain', align:'center', width:120,  title: '发布状态'}
                    ,{field:'disable_explain', align:'center', width:120, title: '禁用状态'}

                      //templet: ZhuangTai, fixed:'left',
                    ,{field:'create_time', align:'center', width:220, title: '创建时间'}
                    ,{field:'update_time', align:'center', width:220, title: '更新时间'}
                    ,{fixed:'right',field:'priority',align:'center', width:180, toolbar: '#barClock', title: '操作'}

                ]]
                /*,page: {
                    layout: [ 'prev', 'page', 'next'] //自定义分页布局
                    ,theme: '#e6a825'
                },*/
                ,page: false,
                //skin: 'row', //表格风格
                //even: true, //隔行背景
                //limits: [5, 10, 15], //显示
                limit: 10 //每页默认显示的数量
            });

            //监听行工具事件
            table.on('tool(clock)', function(obj){
                var data = obj.data;
                //console.log(data.scale_id)
                if(obj.event === 'details'){
                    getAjax(url+'track-scale/get',{scale_id:data.scale_id},true,function (json) {
                        //console.log(json)

                        $('.track_details_show_wrap').show()
                        $('.track_details_show_title').text(json.title)
                        $('.track_show_options').empty()
                        if(!json.options){
                            return
                        }
                        for(var i=0;i<json.options.length;i++){
                            $('.track_show_options').append(`<li>
                                <p>关键词${i+1}</p>
                                <p>${json.options[i].title}</p>
                            </li>`)
                        }
                    },errFunc)
                } else if(obj.event === 'history'){
										$('.clock_history').show()
	                  $('.clock_content').hide()
	                  $('.clock_history_nickname').text('')
	                  $('.clock_history_phone').text('')
	                  //console.log(data)
	                  member_id_record = data.member_id
	                  getAjax(url+'track-record/list',{member_id:data.member_id,review:false},true,getTrackListMember,errFunc)
	                  getAjax(url+'member/get',{member_id:data.member_id},true,function (json) {
			                  $('.clock_history_nickname').text(json.nickname)
			                  $('.clock_history_phone').text(json.phone)
	                  },errFunc)

                } else if(obj.event === 'publish'){
                    layer.confirm(`确定要${data.publish?' ':'发布'}吗？`,{btn: ['确定', '取消'],title:"提示"}, function(index){
                        //obj.del();
                        var saveData = {
                            scale_id:data.scale_id,
                            publish:!data.publish
                        }
                        getAjax(url+'track-scale/publish',saveData,true,function (json) {
                            if(json){
                                layer.msg('发布成功')
                            }
                        },errFunc)
                        layer.close(index);
                    });
                }
            });
        });

    }

    $('.search_clockin').click(function () {
        var phone = $('.clockin .input_sousuo input').val().trim()
        if(!phone){
            layer.msg('请输入手机号')
            return
        }

        getAjax(url+'member/search',{phone:phone},true,function (json) {
            //console.log(json)

            if(json.results.length>0){
                $('.search_add_clockin').show()
                member_id = json.results[0].member_id
                getAjax(url+'track-scale/list',{member_id:member_id},true,getClockList,errFunc)
            }else {
                layer.msg('未找到...')
            }

        },errFunc)
    })

    $('.search_add_clockin').click(function () {
        //alert(112233)
        options_length_num = 0
        $('.track_details_edit_wrap').show()
        $('.track_details_edit_title').val('')
        $('.track_edit_options').empty()
        $('.add_options_edit_track').unbind().click(function () {
            if(options_length_num>5){
                layer.msg('最多设置6个关键词')
                return false
            }
            if(options_length_num==0){
                options_length_num = 0
            }
            options_length_num ++
            $(`.track_edit_options>:last-child .delete_option`).remove()
            $('.track_edit_options').append(`<li class=li${options_length_num-1}>
                    <p>关键词${options_length_num}</p>
                    <p><input class="options_input" type="text"></p>
                    
                    <p class="delete_option" value=${options_length_num-1}><i class="iconfont icon-shanchu"></i></p>
                </li>`)
            delete_option()
        })
        //确定
        $('.button_edit_track_confirm').unbind().click(function () {
            var title_track = $('.track_details_edit_title').val().trim()
            var options_arr = []
            $('.options_input').each(function () {
                options_arr.push({title:$(this).val()})
            })
            console.log(options_arr)
            if(!title_track){
                layer.msg('请输入名称')
                return
            }
            var trackAddData = {
                member_id: member_id,
                title: title_track,
                options: options_arr,
            }
            getAjax(url+'track-scale/save',trackAddData,true,function (json) {
                if(json){
                    layer.msg('添加成功，请发布')
                }else {
                    layer.msg('添加失败！')
                }
                $('.track_details_edit_wrap').hide()

            },errFunc)
        })
    })

    $('.close_track_details_edit,.button_edit_track_close').click(function () {
        $('.track_details_edit_wrap').hide()
    })
    $('.track_details_show_wrap .close_track_details_edit,.track_details_show_wrap .button_edit_track_close').click(function () {
        $('.track_details_show_wrap').hide()
    })

    $('.save_review_wrap .close_add_group,.save_review_wrap .button_add_group_close').click(function () {
		  $('.save_review_wrap').hide()
	  })

		$('.back_track_content').click(function () {
				$('.left_clock').click()
		})

	  $('.button_save_review_confirm').click(function () {
	      var expert_review = $('#save_review_text').val()
        if(!expert_review){
	        layer.msg('请填写内容！')
          return
        }
        getAjax(url+'track-record/save',{record_id:record_id,expert_review:expert_review},true,function (json) {
            if(json){
                layer.msg('回复成功！')
	              $('.save_review_wrap').hide()
                getAjax(url+'track-record/list',{member_id:member_id_record,review:false},true,getTrackListMember,errFunc)
                getAjax(url+'member/get',{member_id:member_id_record},true,function (json) {
                    $('.clock_history_nickname').text(json.nickname)
                    $('.clock_history_phone').text(json.phone)
                },errFunc)
            }
        },errFunc)
	  })

    $('.ping_select').change(function () {
        //console.log($('.ping_select').val())
        //console.log(TrackList)
        if($('.ping_select').val()=='false'){
	        getAjax(url+'track-record/list',{member_id:member_id_record,review:true},true,getTrackListMember,errFunc)
        }else if($('.ping_select').val()=='true'){
	        getAjax(url+'track-record/list',{member_id:member_id_record,review:false},true,getTrackListMember,errFunc)
        }else if($('.ping_select').val()=='-1'){
	        getAjax(url+'track-record/list',{member_id:member_id_record,review:null},true,getTrackListMember,errFunc)
        }
    })

    function delete_option() {
        $('.delete_option').unbind().click(function () {
            var index = $(this).attr('value')*1
            //console.log(index)
            $(`.track_edit_options .li${index}`).remove()
            options_length_num -= 1
            //console.log(options_length_num)
            $(`.track_edit_options>:last-child`).append(`
                <p class="delete_option" value=${options_length_num-1}><i class="iconfont icon-shanchu"></i></p>
             `)
            delete_option()
        })
    }

    function getTrackListMember(json) {
				console.log(json)
	      $('.clock_history_list').empty()
	      TrackList = json.results
	      for(var i=0;i<json.results.length;i++){
		      $('.clock_history_list').append(`<li>
																<p class="clock_history_content">${json.results[i].summary}</p>
																<p class="clock_history_date">${json.results[i].update_time}</p>
																<p class="huifu" value=${json.results[i].record_id}>回复</p>
														</li>`)
	      }
				saveTrack()
    }

    function saveTrack() {
	      $('.huifu').each(function () {
		        $(this).unbind().click(function () {
			          //alert($(this).attr('value'))
								$('.save_review_wrap').show()
			          record_id = $(this).attr('value')
				        $('.save_review_ul').empty()
                getAjax(url+'track-record/get',{record_id:$(this).attr('value')},true,function (json) {
                    console.log(json)
                    for(var i=0;i<json.details.length;i++){
	                      $('.save_review_ul').append(`<li class=xingxing_li${i}>
                            <span style="display:inline-block;width:120px;text-align:right">${json.details[i].title}</span>
                            <div style="margin-left: 10px"></div>
                        </li>`)
                        for(var j=0;j<json.details[i].my_level;j++){
	                          $(`.xingxing_li${i} div`).append('<img src="./img/xingxing.png" alt="">')
                        }

                    }
                    $('.save_summary').empty().text(json.summary)
                    $('#save_review_text').empty()
                    if(json.expert_review){
	                      $('#save_review_text').val(json.expert_review)
                    }else {
	                      $('#save_review_text').val('')
                    }
                },errFunc)

		        })
	      })
    }

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
function trackScale(data){
    var track
    //console.log(data.member_id)
    getAjax(url+'track-scale/list',{member_id:data.member_id,disable:false},false,function (json) {
        //console.log(json)
        if(json.results.length>0){
            track = json.results[0].title
        }else {
            track = '暂无打卡项'
        }

    },errFunc)
    return track
}
function createTime(data) {
    var track
    getAjax(url+'track-scale/list',{member_id:data.member_id,disable:false},false,function (json) {
        //console.log(json)
        if(json.results.length>0){
            track = json.results[0].create_time
        }else {
            track = '--'
        }
        //console.log(track)
        //return track
    },errFunc)
    return track
}
function getClockMember(json) {
    //console.log(json)
    getAjax(url+'track-scale/get',{scale_id:json.results[0].scale_id},true,function (res) {
        console.log(res)
        var options = res.options

        $('.track_details_edit_title').empty().val(res.title)
        $('.track_edit_options').empty()
        if(options){
            options_length_num = options.length
            for(let i=0;i<options.length;i++){
                if(i+1 == options.length){
                    $('.track_edit_options').append(`<li class=li${i}>
                        <p>关键词${i+1}</p>
                        <p><input class="options_input" type="text" value=${options[i].title}></p>
                        
                        <p class="delete_option" value=${i}><i class="iconfont icon-shanchu"></i></p>
                    </li>`)
                }else {
                    $('.track_edit_options').append(`<li class=li${i}>
                            <p>关键词${i+1}</p>
                            <p><input class="options_input" type="text" value=${options[i].title}></p>
                         </li>`)
                }

            }
        }
        $('.add_options_edit_track').click(function () {
            if(options_length_num>5){
                layer.msg('最多设置6个关键词')
                return false
            }
            if(options_length_num==0){
                options_length_num = 0
            }
            options_length_num ++
            $(`.track_edit_options>:last-child .delete_option`).remove()
            $('.track_edit_options').append(`<li class=li${options_length_num-1}>
                    <p>关键词${options_length_num}</p>
                    <p><input class="options_input" type="text"></p>
                    
                    <p class="delete_option" value=${options_length_num-1}><i class="iconfont icon-shanchu"></i></p>
                </li>`)
            delete_option()
        })
        $('.button_edit_track_confirm').click(function () {
            var options = []
            for(var i=0;i<options_length_num;i++){
                options.push({
                    title: $(`.track_edit_options>:nth-child(${i+1}) .options_input`).val(),
                    max_level:7
                })
            }
            console.log(options)
            var trackSaveData = {
                member_id:res.member_id,
                title:$('.track_details_edit_title').val(),
                options:options
            }
            getAjax(url+'track-scale/save',trackSaveData,true,updataTrack,errFunc)

        })
        delete_option()

    },errFunc)
}
