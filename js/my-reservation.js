$(function() {
    //提前请求数据
    var reservation = (function() {
        function reservation() {}
        // reservation.dataObj = {
        // }
        return reservation;
    })();
    reservation.doclistObj = {
    };

    var domain = '../json/my-reservation.json';

    //获取列表
    $.ajax({
        type: "get",
        // async: false,
        url: domain + "",
        dataType: "jsonp",
        jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
        jsonpCallback: "fun", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
        success: function(data) {
                reservation.doclistObj = data.rows;
            $("#target").html("");
            var ksStr = '',isyy="",status="";
            console.log(reservation.doclistObj.length);
            var len = reservation.doclistObj.length;
            for(var i=0;i<len;i++){
                if(reservation.doclistObj[i].progess ==0){status='<span class="close_re">已取消</span>'; isyy=''};
                if(reservation.doclistObj[i].progess ==1){status='<span class="yes_re">待医生确认</span>'; isyy='<a href="javascript:;" data-ddh="'+ reservation.doclistObj[i].doc_ddh +'" class="weui-btn weui-btn_plain-default qxyy">取消预约</a>'};
                if(reservation.doclistObj[i].progess ==2){status='<span class="yes_re">医生已确认</span>'; isyy=''};

               ksStr += '<div class="weui-panel weui-panel_access">'+
                            '<div class="weui-panel__bd">'+
                              '<a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg">'+
                                '<div class="weui-media-box__hd">'+
                                  '<img class="weui-media-box__thumb head_img" src="'+ reservation.doclistObj[i].head_img +'">'+
                                '</div>'+
                                '<div class="weui-media-box__bd">'+
                                  '<span class="ys fl">'+ reservation.doclistObj[i].doc_name +'</span><span class="we_desc">'+ reservation.doclistObj[i].doc_zc +'</span>'+
                                  '<span class="we_desc grey block">'+ reservation.doclistObj[i].doc_ks +'</span>'+
                                  status +
                                '</div>'+
                              '</a>'+
                            '</div>'+
                            '<div class="weui-cells">'+
                                '<a class="weui-cell weui-cell_access" href="booking-details.html?ddh='+ reservation.doclistObj[i].doc_ddh +'">'+
                                  '<div class="weui-cell__bd">'+
                                    '<p>来自：<span>'+ reservation.doclistObj[i].lz +'</span></p>'+
                                    '<p>订单号：<span>'+ reservation.doclistObj[i].doc_ddh +'</span></p>'+
                                    '<p>费用：<span>'+ reservation.doclistObj[i].money +'</span>元</p>'+
                                    '<p>就诊人：<span>'+ reservation.doclistObj[i].jzr +'</span></p>'+
                                    '<p>就诊时间：<span>'+ reservation.doclistObj[i].jz_date +'</span></p>'+
                                    '<p>就诊地点：<span>'+ reservation.doclistObj[i].target +'</span></p>'+
                                  '</div>'+
                                  '<div class="weui-cell__ft">'+
                                  '</div>'+
                                  isyy +
                                '</a>'+
                            '</div>'+
                        '</div>';
            }
            $("#target").html(ksStr);
        },
        error: function() {
            console.log('fail 请求数据失败！');
        }
    });
    
    
    $("#target").on("click",".qxyy",function(){
        var ddh = $(this).attr("data-ddh");
              $.actions({
                title:"是否取消该预约单？",
                actions: [{
                  text: "确认取消",
                  onClick: function() {
                    $.ajax({
                     url: domain +"?"+ ddh ,
                     type: 'PUT',
                     data: ddh,
                     success: function(response) {
                      location.reload();
                     }
                    });
                  }
                }]
              });
    });

});