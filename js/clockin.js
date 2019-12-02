$(function () {
    $('.left_clock').click(function () {
        getAjax(url+'track-scale/list',{paging:false},true,getTrackList,errFunc)
    })

    function getTrackList(json) {
        console.log(json)
    }
})