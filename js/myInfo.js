$(function() {
    //提前请求数据
    var myInfo = (function() {
        function myInfo() {}
        // myInfo.dataObj = {
        // }
        return myInfo;
    })();
    myInfo.userlistObj = {
    };

    var domain = '../json/myInfo.json';
    //获取列表
    $.ajax({
        type: "get",
        // async: false,
        url: domain + "",
        dataType: "jsonp",
        jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
        jsonpCallback: "fun", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
        success: function(data) {
            myInfo.userlistObj = data.rows;
            $("#target").html("");
            var ksStr = '';
            console.log(myInfo.userlistObj.length);
            var len = myInfo.userlistObj.length;
            for(var i=0;i<len;i++){
               ksStr += '<a class="weui-cell weui-cell_access weui-media-box weui-media-box_appmsg" href="my-info-in.html?id='+ myInfo.userlistObj[i].id +'">'+
                            '<div class="weui-media-box__hd">'+
                                '<img class="weui-media-box__thumb head_img" src="'+ myInfo.userlistObj[i].head_img +'">'+
                            '</div>'+
                            '<div class="weui-media-box__bd">'+
                                '<span class="ys fl">'+ myInfo.userlistObj[i].user_name +'</span><span class="we_desc">'+ (myInfo.userlistObj[i].is_default==1?'(默认)': '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') +'</span>'+
                                '<span class="we_desc grey block">用户ID:<span>'+ myInfo.userlistObj[i].id +'</span></span>'+
                                '<span class="yes_re"></span>'+
                            '</div>'+
                            '<div class="weui-cell__ft">'+
                                '<img class="tup " src="images/barcode-2d.png" data-img="'+ myInfo.userlistObj[i].rwm_img +'" alt="">'+
                            '</div>'+
                        '</a> ';
            }
            $("#target").html(ksStr);
            // $('#target :contains("默认")').parents(".weui-cell").css("margin-bottom","10px");
        },
        error: function() {
            console.log('fail 请求数据失败！');
        }
    });
    
    

});