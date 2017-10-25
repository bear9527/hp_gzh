$(function() {
    //提前请求数据
    var booking = (function() {
        function booking() {}
        // booking.dataObj = {
        // }
        return booking;
    })();
    booking.doclistObj = {
    };
    booking.thislistObj = {
    };
    //为jq添加获取URL上的值自定义方法
    (function($) {
        $.getUrlParam = function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return '';
        }
    })(jQuery);
    booking.thislistObj.ddh = decodeURI($.getUrlParam('ddh'));
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
            booking.doclistObj = data.rows;
            var ksStr = '';
            var len = booking.doclistObj.length;
            for(var i=0;i<len;i++){
               if(booking.doclistObj[i].doc_ddh == booking.thislistObj.ddh){
                if(booking.doclistObj[i].progess == 0){$("#jd").hide(); $("#sta_info").html("该预约已取消，如需就诊，请重新预约");$("#yes").hide();$("#txt").attr("disabled","disabled");}
                if(booking.doclistObj[i].progess == 1){$("#jd").attr("data-step","1");$("#jd li").eq(0).addClass("active").siblings().removeClass("active"); $("#sta_info").html("该预约待医生确认，请耐心等候");}
                if(booking.doclistObj[i].progess == 2){$("#jd").attr("data-step","2");$("#jd li").eq(0).addClass("active");$("#jd li").eq(1).addClass("active"); $("#sta_info").html("医生已确认，请缴费");}
                if(booking.doclistObj[i].progess == 3){$("#jd").attr("data-step","3");$("#jd li").addClass("active"); $("#sta_info").html("缴费成功");}
                $("#doc_name").html(booking.doclistObj[i].doc_name);
                $("#doc_zc").html(booking.doclistObj[i].doc_zc);
                $("#doc_jzr").html(booking.doclistObj[i].jzr);
                $("#doc_date").html(booking.doclistObj[i].jz_date);
                $("#doc_target").html(booking.doclistObj[i].target);
                $("#money").html(booking.doclistObj[i].money);
                $("#submit_date").html(booking.doclistObj[i].submit_date);
                $("#doc_ddh").html(booking.doclistObj[i].doc_ddh);
                $("#jkda").attr("href","archives.html?id=" + booking.doclistObj[i].id +"&name="+booking.doclistObj[i].doc_name);
                $("#scfj").attr("href","all-case-info.html?id=" + booking.doclistObj[i].id +"&name="+booking.doclistObj[i].doc_name +"&len="+booking.doclistObj[i].images.length);
                
               }
            }
            
        },
        error: function() {
            console.log('fail 请求数据失败！');
        }
    });
    
    
    //输入框限制字数
    $("#txt").keyup(function(){
       var len = $(this).val().length;
      
       if(len > 99){
        $(this).val($(this).val().substring(0,100));
       }
       var num = len;
       $("#word").text(num);
    });
    //点击上传附件
    doc_jzr
    $("#yes").click(function(){
        var bqms = $("#txt").val();
              $.actions({
                title:"确定修改该预约单？",
                actions: [{
                  text: "确认修改",
                  onClick: function() {
                    $.ajax({
                        type: "post",
                        // async: false,
                        url: domain + "",
                        dataType: "json",
                        data: {"bqms":bqms},
                        success: function(data) {   
                            $.toast("修改成功", "text");
                        },
                        error: function() {
                            console.log('fail 请求数据失败！');
                        }
                    });
                  }
                }]
              });    //     $.ajax({
    //     type: "post",
    //     // async: false,
    //     url: domain + "",
    //     dataType: "json",
    //     data: {"bqms":bqms},
    //     success: function(data) {
    //     },
    //     error: function() {
    //         console.log('fail 请求数据失败！');
    //     }
    // });
    });

});