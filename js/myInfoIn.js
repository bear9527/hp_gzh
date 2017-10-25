$(function() {
    //提前请求数据
    var myInfoIn = (function() {
        function myInfoIn() {}
        // myInfoIn.dataObj = {
        // }
        return myInfoIn;
    })();
    myInfoIn.userlistObj = {};
    myInfoIn.thislistObj = {};
    //为jq添加获取URL上的值自定义方法
    (function($) {
        $.getUrlParam = function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return '';
        }
    })(jQuery);
    myInfoIn.thislistObj.id = decodeURI($.getUrlParam('id'));
    var domain = '../json/myInfoIn.json';
    //获取列表信息
    $.ajax({
        type: "get",
        // async: false,
        url: domain + "",
        dataType: "jsonp",
        jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
        jsonpCallback: "fun", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
        success: function(data) {
            myInfoIn.userlistObj = data.rows;
            $("#head_img").attr("src", myInfoIn.userlistObj.head_img);
            $("#user_name").html(myInfoIn.userlistObj.user_name);
            $("#sex").html(myInfoIn.userlistObj.sex);
            $("#phone").html(myInfoIn.userlistObj.phone);
            $("#user_id").html(myInfoIn.userlistObj.id);
            $("#user_sfz").html(myInfoIn.userlistObj.user_sfz);
            $("#rwm").attr("data-img", myInfoIn.userlistObj.rwm);
            $("#txm").attr("data-img", myInfoIn.userlistObj.txm);
            $("#bfb").html(myInfoIn.userlistObj.bfb);
            $("#jkda").attr("href", 'health-records.html?id=' + myInfoIn.userlistObj.id);
            //判断是否为默认
            if (myInfoIn.userlistObj.is_default == 1) {
                $("#m_default").css("display", "none");
            } else if (myInfoIn.userlistObj.is_default == 0) {
                $("#m_default").css("display", "block");
            }
        },
        error: function() {
            console.log('fail 请求数据失败！');
        }
    });
    //点击出现图片弹窗
    var $androidActionSheet = $('#androidActionsheet');
    var $androidMask = $androidActionSheet.find('.weui-mask');
    $(".tup").on('click', function() {
        var data_img = $(this).attr("data-img");
        $("#img_code").attr("src", data_img);
        $("#head_img").attr("src", myInfoIn.userlistObj.head_img);
        $androidMask.addClass("weui-mask--visible")
        $androidActionSheet.css("display", "block");
        $androidMask.on('click', function() {
            $androidActionSheet.css("display", "none");
        });
    });
    //点击设为默认
    $("#m_default").click(function() {
        $.ajax({
            url: domain + "",
            type: 'PUT',
            data: {
                id: myInfoIn.thislistObj.id
            },
            success: function(response) {
                $.toast("设置成功", "text");
            }
        });
    });
    //点击解除绑定
    $("#yes").click(function() {
        $.actions({
            title: "确定要解绑当前就诊人吗？",
            actions: [{
                text: "确定解绑",
                onClick: function() {
                    $.ajax({
                        url: domain + "",
                        type: 'DELETE',
                        data: {
                            id: myInfoIn.thislistObj.id
                        },
                        success: function(result) {
                            // Do something with the result
                            $.toast('已解除绑定', "text");
                            window.history.go(-1);
                            window.location.go(-1);
                        },
                        error:function(){
                            $.toast('解除绑定失败', "text");
                        }
                    });
                }
            }]
        });
    });
    $("#place").click(function() {
        $.prompt({
            title: '设定就诊地点',
            // text: '内容文案',
            textarea: '输入框默认值',
            empty: false, // 是否允许为空
            onOK: function(input) {
                //点击确认
                $(".place").html($("#weui-prompt-input").val());
                $.closeModal();
            },
            onCancel: function() {
                $.closeModal();
            }
        });
        $("#weui-prompt-input").remove(); //去除原始输入框
        $(".weui-dialog__bd").append('<textarea  rows="8" type="height:110px;" class="weui_input weui-prompt-input" id="weui-prompt-input" value=""></textarea><p><span class="color_orange">温馨提示：</span>预约医生到其他地方就诊，费用会高于当前费用，具体费用以后台工作人员与医生确认为准</p>');
        //重新拼接应textarea.
    });
});