$(function() {
    //提前请求数据
    var departments = (function() {
        function departments() {}
        // departments.dataObj = {
        // }
        return departments;
    })();
    departments.kslistObj = {
    };

    var domain = '../json/departments.json';
    var menAllList = '';
    var womenAllList = '';
    //获取列表
    $.ajax({
        type: "get",
        // async: false,
        url: domain + "",
        dataType: "jsonp",
        jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
        jsonpCallback: "fun", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
        success: function(data) {
                departments.kslistObj = data.rows;
            $("#target").html("");
            var ksStr = '';
            console.log(departments.kslistObj.length);
            var len = departments.kslistObj.length;
            for(var i=0;i<len;i++){
               ksStr += '<a class="weui-cell weui-cell_access" href="/department.html?ks='+ departments.kslistObj[i] +'"><div class="weui-cell__bd"><p>'+ departments.kslistObj[i] +'</p></div><div class="weui-cell__ft"></div></a>';
            }
            $("#target").html(ksStr);
        },
        error: function() {
            console.log('fail 请求数据失败！');
        }
    });
    $("form").submit(function(){
        return false;
    });
    
    //点击回车||搜索
    $(document).keydown(function(event){ 
        var _this = $("#searchInput").val();
        if(event.keyCode==13){ 
        //获取列表
        $.ajax({
            type: "get",
            // async: false,
            url: domain + '?ks='+ _this,
            dataType: "jsonp",
            jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
            jsonpCallback: "fun", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
            success: function(data) {
                    departments.kslistObj = data.rows;
                $("#target").html("");
                var ksStr = '';
                console.log(departments.kslistObj.length);
                var len = departments.kslistObj.length;
                for(var i=0;i<len;i++){
                   ksStr += '<a class="weui-cell weui-cell_access" href="/department.html?ks='+ departments.kslistObj[i] +'"><div class="weui-cell__bd"><p>'+ departments.kslistObj[i] +'</p></div><div class="weui-cell__ft"></div></a>';
                }
                $("#target").html(ksStr);
            },
            error: function() {
                console.log('fail 请求数据失败！');
            }
        });
        }
    });
});