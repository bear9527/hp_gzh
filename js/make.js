$(function() {
    //提前请求数据
    var make = (function() {
        function make() {}
        // make.dataObj = {
        // }
        return make;
    })();
    make.doclistObj = {
        id:"",
        name: "",
        zc: "",
        ks: "",
        date: "",
        dt: "",
        head_src: "",
        week: ""
    };
    make.dzlistObj  = {};
    //为jq添加获取URL上的值自定义方法
    (function($) {
        $.getUrlParam = function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return '';
        }
    })(jQuery);
    make.doclistObj.id = decodeURI($.getUrlParam('id'));
    make.doclistObj.name = decodeURI($.getUrlParam('name'));
    make.doclistObj.zc = decodeURI($.getUrlParam('zc'));
    make.doclistObj.ks = decodeURI($.getUrlParam('ks'));
    make.doclistObj.date = decodeURI($.getUrlParam('date'));
    make.doclistObj.dt = decodeURI($.getUrlParam('dt'));
    make.doclistObj.head_src = decodeURI($.getUrlParam('head_src'));
    make.doclistObj.week = decodeURI($.getUrlParam('week'));
    $("#jkda").attr("href","archives.html?id=" + make.doclistObj.id +"&name="+make.doclistObj.name);
    $("#scfj").attr("href","all-case-info.html?id=" + make.doclistObj.id +"&name="+make.doclistObj.name); // +"&len="+booking.doclistObj[i].images.length
            
    $("#head_img").attr("src",make.doclistObj.head_src);
    $("#navbar").css("background-image","url("+make.doclistObj.head_src+")");
    $("#docname").text(make.doclistObj.name);
    $("#zc").text(make.doclistObj.zc);
    $(".ks").text(make.doclistObj.ks);
    $("#date").text(make.doclistObj.date +"("+ make.doclistObj.week +")" + make.doclistObj.dt);
    //输入框限制字数
    $("#txt").keyup(function(){
       var len = $(this).val().length;
       if(len > 99){
        $(this).val($(this).val().substring(0,100));
       }
       var num = len;
       $("#word").text(num);
    });
    var domain = '../json/make.json';
    //获取列表
    // $.ajax({
    //     type: "get",
    //     // async: false,
    //     url: domain + "",
    //     dataType: "jsonp",
    //     jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
    //     jsonpCallback: "fun", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
    //     success: function(data) {
    //             make.doclistObj = data.rows;
    //         $("#target").html("");
    //         var docStr = '';
    //         console.log(make.doclistObj.length);
    //         var len = make.doclistObj.length;
    //         for(var i=0;i<len;i++){
    //            docStr += '<a class="weui-cell weui-cell_access" href="/make.html?doc='+ make.doclistObj[i] +'"><div class="weui-cell__bd"><p>'+ make.doclistObj[i] +'</p></div><div class="weui-cell__ft"></div></a>';
    //         }
    //         $("#target").html(docStr);
    //     },
    //     error: function() {
    //         console.log('fail 请求数据失败！');
    //     }
    // });
    
    //获取就诊地区
    $.ajax({
        type: "get",
        // async: false,
        url: domain + "?id=" + make.doclistObj.id ,
        dataType: "jsonp",
        jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
        jsonpCallback: "fun", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
        success: function(data) {
            make.dzlistObj = data.rows;
            $("#dz").html("");
            var dzStr = '';
            var len = make.dzlistObj.length;
            for(var i=0;i<len;i++){
                if(make.dzlistObj.id == make.doclistObj[i].id){
                    dzStr =make.doclistObj[i].dz;
                }
            }
            $("#dz").html(dzStr);
        },
        error: function() {
            console.log('fail 请求数据失败！');
        }
    });
    $("#jzr").select({
      title: "选择就诊人",
      multi: false,
      items: [
        {
          title: "就诊人1",
          value: 1
        },
        {
          title: "就诊人2",
          value: 2
        },
        {
          title: "就诊人3",
          value: 3
        },
        {
          title: "就诊人4",
          value: 4
        },
      ]
    });

});