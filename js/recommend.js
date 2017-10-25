$(function() {
    //提前请求数据
    var recommend = (function() {
        function recommend() {}
        // recommend.dataObj = {
        // }
        return recommend;
    })();
    recommend.kslistObj = {
    };

    var domain = '../json/recommend.json';
    //获取列表
    $.ajax({
        type: "get",
        // async: false,
        url: domain + "",
        dataType: "jsonp",
        jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
        jsonpCallback: "fun", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
        success: function(data) {
            recommend.kslistObj = data.rows;
            $("#target").html("");
            var ksStr = '';
            console.log(recommend.kslistObj.length);
            var len = recommend.kslistObj.length;
            for(var i=0;i<len;i++){
               // ksStr += '<a class="weui-cell weui-cell_access" href="/department.html?ks='+ recommend.kslistObj[i] +'"><div class="weui-cell__bd"><p>'+ recommend.kslistObj[i] +'</p></div><div class="weui-cell__ft"></div></a>';
               ksStr += '<div class="weui-cell">'+
                    '<div class="weui-cell__bd">'+
                        '<p>'+ recommend.kslistObj[i] +'</p>'+
                    '</div>'+
                    '<div class="weui-cell__ft"><a href="department.html?ks='+ recommend.kslistObj[i] +'">预约挂号</a></div>'+
                '</div>';
            }
            $("#target").html(ksStr);
        },
        error: function() {
            console.log('fail 请求数据失败！');
        }
    });
    
    

});