$(function() {
    //提前请求数据
    var allCase = (function() {
        function allCase() {}
        // allCase.dataObj = {
        // }
        return allCase;
    })();
    allCase.thislistObj = {
    };

    var domain = '../json/allCase.json';
    //为jq添加获取URL上的值自定义方法
    (function($) {
        $.getUrlParam = function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return '';
        }
    })(jQuery);
    allCase.thislistObj.id = decodeURI($.getUrlParam('id'));
    allCase.thislistObj.name = decodeURI($.getUrlParam('name'));
    allCase.thislistObj.len = decodeURI($.getUrlParam('len'));
     function uploadPic() {  
        // 上传设置  
        var options = {  
                // 规定把请求发送到那个URL  
                url: "/json",  
                // 请求方式  
                type: "post",  
                // 服务器响应的数据类型  
                dataType: "json",  
                // 请求成功时执行的回调函数  
                success: function(data, status, xhr) {  
                    // 图片显示地址  
                    // $("#allUrl").attr("src", data.path); 
                    console.log("上传成功"); 
                }  
        };  
          
        $("#jvForm").ajaxSubmit(options);  
    }  


    $("#userName").html(allCase.thislistObj.name);
    $("#len").html(allCase.thislistObj.len);
    $("#uploaderInput").on("change",function(){
        uploadPic();
    });

    //获取列表
    // $.ajax({
    //     type: "get",
    //     // async: false,
    //     url: domain + "",
    //     dataType: "jsonp",
    //     jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
    //     jsonpCallback: "fun", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
    //     success: function(data) {
    //             allCase.thislistObj = data.rows;
    //         $("#target").html("");
    //         var ksStr = '';
    //         console.log(allCase.thislistObj.length);
    //         var len = allCase.thislistObj.length;
    //         for(var i=0;i<len;i++){
    //            ksStr += '<a class="weui-cell weui-cell_access" href="/department.html?ks='+ allCase.thislistObj[i] +'"><div class="weui-cell__bd"><p>'+ allCase.thislistObj[i] +'</p></div><div class="weui-cell__ft"></div></a>';
    //         }
    //         $("#target").html(ksStr);
    //     },
    //     error: function() {
    //         console.log('fail 请求数据失败！');
    //     }
    // });
    

});