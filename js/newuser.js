$(function() {
    //提前请求数据
    var newuser = (function() {
        function newuser() {}
        // newuser.dataObj = {
        // }
        return newuser;
    })();
    newuser.kslistObj = {
        name: "",
        sfz: "",
        phone: ""
    };

    var domain = '../json/newuser.json';
    //cookie
        function setCookie(key, value, iDay) {
            var oDate = new Date();
            oDate.setDate(oDate.getDate() + iDay);
            document.cookie = key + '=' + value + ';expires=' + oDate;
        }
        function removeCookie(key) {
            setCookie(key, '', -1);//这里只需要把Cookie保质期退回一天便可以删除
        }
        function getCookie(key) {
            var cookieArr = document.cookie.split('; ');
            for(var i = 0; i < cookieArr.length; i++) {
                var arr = cookieArr[i].split('=');
                if(arr[0] === key) {
                    return arr[1];
                }
            }
            return false;
        }
        $("#user_name").on("change",function(){
           newuser.kslistObj.name = $(this).val(); 
        });
        $("#user_sfz").on("change",function(){
           newuser.kslistObj.sfz = $(this).val(); 
        });
        $("#user_phone").on("change",function(){
           newuser.kslistObj.phone = $(this).val(); 
        });




    //登录
    $("#yes").click(function(){
        $.ajax({ 
            type: "post",
            // async: false,
            url: domain + "",
            dataType: "json",
            data: newuser.kslistObj ,
            // dataType: "jsonp",
            // jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
            // jsonpCallback: "fun", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
            success: function(data) {
                encodeURI(newuser.kslistObj.name);
                setCookie(encodeURI(newuser.kslistObj.name),newuser.kslistObj.sfz,1);
            },
            error: function() {
                console.log('fail 请求数据失败！');
                setCookie(encodeURI(newuser.kslistObj.name),newuser.kslistObj.sfz,1);
            }
        }); 
    });
    
    
    
    //dom操作
    // $(".weui-navbar__item").on("click", function() {
    //     $(this).addClass("weui-bar__item_on").siblings().removeClass("weui-bar__item_on");
    //     $($(this).attr("href")).addClass("weui-tab__bd-item--active").siblings().removeClass("weui-tab__bd-item--active");
    // });

});