$(function() {
    //提前请求数据
    var records = (function() {
        function records() {}
        // records.dataObj = {
        // }
        return records;
    })();
    records.listObj = {
    };
    records.thislistObj = {
    };
    var domain = '../json/records.json';
    //为jq添加获取URL上的值自定义方法
    (function($) {
        $.getUrlParam = function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return '';
        }
    })(jQuery);
    records.thislistObj.id = decodeURI($.getUrlParam('id'));
    //获取列表信息

        $.ajax({
            type: "get",
            url: domain + records.thislistObj.id,
            dataType: "jsonp",
            jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
            jsonpCallback: "fun", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
            success: function(data) {
                records.listObj = data.rows;
                $("#height").val(records.listObj.height);
                $("#weight").val(records.listObj.weight);
                $("#bloodtype").val(records.listObj.bloodtype);
                $("#gms").val(records.listObj.gms);
                $("#jbs").val(records.listObj.jbs);
                $("#sss").val(records.listObj.sss);
                $("#wss").val(records.listObj.wss);
                $("#sxs").val(records.listObj.sxs);
                $("#cjqk").val(records.listObj.cjqk);
                $("#ycbs").val(records.listObj.ycbs);
                $("#smoking").val(records.listObj.smoking);
                $("#whate").val(records.listObj.whate);
                $("#datetime-picker").val(records.listObj.datetime);
            },
            error: function() {
                $.toast("系统繁忙，请稍后再试","text");
                console.log('fail 请求数据失败！');
            }
        });
    //提交列表所填信息
    $("#yes").click(function(){
        records.listObj.height = $("#height").val();
        records.listObj.weight = $("#weight").val();
        records.listObj.bloodtype = $("#bloodtype").val();
        records.listObj.gms = $("#gms").val();
        records.listObj.jbs = $("#jbs").val();
        records.listObj.sss = $("#sss").val();
        records.listObj.wss = $("#wss").val();
        records.listObj.sxs = $("#sxs").val();
        records.listObj.cjqk = $("#cjqk").val();
        records.listObj.ycbs = $("#ycbs").val();
        records.listObj.smoking = $("#smoking").val();
        records.listObj.whate = $("#whate").val();
        records.listObj.datetime = $("#datetime-picker").val();
        $.ajax({
            type: "post",
            // async: false,
            dataType:"json",
            data: records.listObj,
            url: domain + "",
            success: function(data) {
                $.toast("数据保存成功，正在跳转...");
                window.history.back();  //返回上一页
                window.location.go(-1); //刷新上一页
            },
            error: function() {
                $.toast("系统繁忙，请稍后再试","text");
                console.log('fail 请求数据失败！');
            }
        });
    });
    

});