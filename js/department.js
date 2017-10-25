$(function() {
    //提前请求数据
    var department = (function() {
        function department() {}
        // department.dataObj = {
        // }
        return department;
    })();
    department.kslistObj = {
    };
    department.ks = {
        name: ''
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
    //科室
    department.ks.name = decodeURI($.getUrlParam('ks'));
    $("#department").html(department.ks.name);

    /* 获取当前日期 */
    department.showTime1 = function(str) {
        var show_day = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var date = time.getDate() + 1;
        var day = time.getDay();
        var hour = time.getHours();
        var minutes = time.getMinutes();
        var second = time.getSeconds();
        /*  month<10?month='0'+month:month;  */
        hour < 10 ? hour = '0' + hour : hour;
        minutes < 10 ? minutes = '0' + minutes : minutes;
        second < 10 ? second = '0' + second : second;
        var now_time = '';
        if (str == 1) {
            now_time = '<p class="fl this_time">' + year + '-' + month + '-' + date + '</p><p class="fl">(</p><p class="fl this_week">' + show_day[day%7] + '</p><p class="fl">)</p><p class="fl this_dt">上午班</p>';
        } else if (str == 2) {
            now_time = '<p class="fl this_time">' + year + '-' + month + '-' + date + '</p><p class="fl">(</p><p class="fl this_week">' + show_day[day%7] + '</p><p class="fl">)</p><p class="fl this_dt">下午班</p>';
        } else if (str == 3) {
            now_time = '<p class="fl this_time">' + year + '-' + month + '-' + date + '</p><p class="fl">(</p><p class="fl this_week">' + show_day[day%7] + '</p><p class="fl">)</p><p class="fl this_dt">晚上班</p>';
        }
        return now_time;
    }
    department.showTime2 = function(str) {
        var show_day = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var date = time.getDate() + 2;
        var day = time.getDay();
        var hour = time.getHours();
        var minutes = time.getMinutes();
        var second = time.getSeconds();
        /*  month<10?month='0'+month:month;  */
        hour < 10 ? hour = '0' + hour : hour;
        minutes < 10 ? minutes = '0' + minutes : minutes;
        second < 10 ? second = '0' + second : second;
        var now_time = '';
        if (str == 1) {
            now_time = '<p class="fl this_time">' + year + '-' + month + '-' + date + '</p><p class="fl">(</p><p class="fl this_week">' + show_day[(day+1)%7] + '</p><p class="fl">)</p><p class="fl this_dt">上午班</p>';
        } else if (str == 2) {
            now_time = '<p class="fl this_time">' + year + '-' + month + '-' + date + '</p><p class="fl">(</p><p class="fl this_week">' + show_day[(day+1)%7] + '</p><p class="fl">)</p><p class="fl this_dt">下午班</p>';
        } else if (str == 3) {
            now_time = '<p class="fl this_time">' + year + '-' + month + '-' + date + '</p><p class="fl">(</p><p class="fl this_week">' + show_day[(day+1)%7] + '</p><p class="fl">)</p><p class="fl this_dt">晚上班</p>';
        }
        return now_time;
    }
    department.showTime3 = function(str) {
        var show_day = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var date = time.getDate() + 3;
        var day = time.getDay();
        var hour = time.getHours();
        var minutes = time.getMinutes();
        var second = time.getSeconds();
        /*  month<10?month='0'+month:month;  */
        hour < 10 ? hour = '0' + hour : hour;
        minutes < 10 ? minutes = '0' + minutes : minutes;
        second < 10 ? second = '0' + second : second;
        var now_time = '';
        if (str == 1) {
            now_time = '<p class="fl this_time">' + year + '-' + month + '-' + date + '</p><p class="fl">(</p><p class="fl this_week">' + show_day[(day+2)%7] + '</p><p class="fl">)</p><p class="fl this_dt">上午班</p>';
        } else if (str == 2) {
            now_time = '<p class="fl this_time">' + year + '-' + month + '-' + date + '</p><p class="fl">(</p><p class="fl this_week">' + show_day[(day+2)%7] + '</p><p class="fl">)</p><p class="fl this_dt">下午班</p>';
        } else if (str == 3) {
            now_time = '<p class="fl this_time">' + year + '-' + month + '-' + date + '</p><p class="fl">(</p><p class="fl this_week">' + show_day[(day+2)%7] + '</p><p class="fl">)</p><p class="fl this_dt">晚上班</p>';
        }
        return now_time;
    }
    department.showTime4 = function(str) {
        var show_day = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var date = time.getDate() + 4;
        var day = time.getDay();
        var hour = time.getHours();
        var minutes = time.getMinutes();
        var second = time.getSeconds();
        /*  month<10?month='0'+month:month;  */
        hour < 10 ? hour = '0' + hour : hour;
        minutes < 10 ? minutes = '0' + minutes : minutes;
        second < 10 ? second = '0' + second : second;
        var now_time = '';
        if (str == 1) {
            now_time = '<p class="fl this_time">' + year + '-' + month + '-' + date + '</p><p class="fl">(</p><p class="fl this_week">' + show_day[(day+3)%7] + '</p><p class="fl">)</p><p class="fl this_dt">上午班</p>';
        } else if (str == 2) {
            now_time = '<p class="fl this_time">' + year + '-' + month + '-' + date + '</p><p class="fl">(</p><p class="fl this_week">' + show_day[(day+3)%7] + '</p><p class="fl">)</p><p class="fl this_dt">下午班</p>';
        } else if (str == 3) {
            now_time = '<p class="fl this_time">' + year + '-' + month + '-' + date + '</p><p class="fl">(</p><p class="fl this_week">' + show_day[(day+3)%7] + '</p><p class="fl">)</p><p class="fl this_dt">晚上班</p>';
        }
        return now_time;
    }
    department.showTime5 = function(str) {
        var show_day = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var date = time.getDate() + 5;
        var day = time.getDay();
        var hour = time.getHours();
        var minutes = time.getMinutes();
        var second = time.getSeconds();
        /*  month<10?month='0'+month:month;  */
        hour < 10 ? hour = '0' + hour : hour;
        minutes < 10 ? minutes = '0' + minutes : minutes;
        second < 10 ? second = '0' + second : second;
        var now_time = '';
        if (str == 1) {
            now_time = '<p class="fl this_time">' + year + '-' + month + '-' + date + '</p><p class="fl">(</p><p class="fl this_week">' + show_day[(day+4)%7] + '</p><p class="fl">)</p><p class="fl this_dt">上午班</p>';
        } else if (str == 2) {
            now_time = '<p class="fl this_time">' + year + '-' + month + '-' + date + '</p><p class="fl">(</p><p class="fl this_week">' + show_day[(day+4)%7] + '</p><p class="fl">)</p><p class="fl this_dt">下午班</p>';
        } else if (str == 3) {
            now_time = '<p class="fl this_time">' + year + '-' + month + '-' + date + '</p><p class="fl">(</p><p class="fl this_week">' + show_day[(day+4)%7] + '</p><p class="fl">)</p><p class="fl this_dt">晚上班</p>';
        }
        return now_time;
    }
    department.showTime6 = function(str) {
        var show_day = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var date = time.getDate() + 6;
        var day = time.getDay();
        var hour = time.getHours();
        var minutes = time.getMinutes();
        var second = time.getSeconds();
        /*  month<10?month='0'+month:month;  */
        hour < 10 ? hour = '0' + hour : hour;
        minutes < 10 ? minutes = '0' + minutes : minutes;
        second < 10 ? second = '0' + second : second;
        var now_time = '';
        if (str == 1) {
            now_time = '<p class="fl this_time">' + year + '-' + month + '-' + date + '</p><p class="fl">(</p><p class="fl this_week">' + show_day[(day+5)%7] + '</p><p class="fl">)</p><p class="fl this_dt">上午班</p>';
        } else if (str == 2) {
            now_time = '<p class="fl this_time">' + year + '-' + month + '-' + date + '</p><p class="fl">(</p><p class="fl this_week">' + show_day[(day+5)%7] + '</p><p class="fl">)</p><p class="fl this_dt">下午班</p>';
        } else if (str == 3) {
            now_time = '<p class="fl this_time">' + year + '-' + month + '-' + date + '</p><p class="fl">(</p><p class="fl this_week">' + show_day[(day+5)%7] + '</p><p class="fl">)</p><p class="fl this_dt">晚上班</p>';
        }
        return now_time;
    }
    department.showTime7 = function(str) {
        var show_day = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var date = time.getDate() + 7;
        var day = time.getDay();
        var hour = time.getHours();
        var minutes = time.getMinutes();
        var second = time.getSeconds();
        /*  month<10?month='0'+month:month;  */
        hour < 10 ? hour = '0' + hour : hour;
        minutes < 10 ? minutes = '0' + minutes : minutes;
        second < 10 ? second = '0' + second : second;
        var now_time = '';
        if (str == 1) {
            now_time = '<p class="fl this_time">' + year + '-' + month + '-' + date + '</p><p class="fl">(</p><p class="fl this_week">' + show_day[(day+6)%7] + '</p><p class="fl">)</p><p class="fl this_dt">上午班</p>';
        } else if (str == 2) {
            now_time = '<p class="fl this_time">' + year + '-' + month + '-' + date + '</p><p class="fl">(</p><p class="fl this_week">' + show_day[(day+6)%7] + '</p><p class="fl">)</p><p class="fl this_dt">下午班</p>';
        } else if (str == 3) {
            now_time = '<p class="fl this_time">' + year + '-' + month + '-' + date + '</p><p class="fl">(</p><p class="fl this_week">' + show_day[(day+6)%7] + '</p><p class="fl">)</p><p class="fl this_dt">晚上班</p>';
        }
        return now_time;
    }
    var domain = '../json/department.json'; //+ department.kslistObj.name;
    //获取列表
    $.ajax({
        type: "get",
        // async: false,
        url: domain + "",
        dataType: "jsonp",
        jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
        jsonpCallback: "fun", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
        success: function(data) {
            department.kslistObj = data.rows;
            $("#target").html("");
            var ksStr = '';
            var len = department.kslistObj.length;
            $("#len").html(len);//医生数
            for (var i = 0; i < len; i++) {
                ksStr += '<div class="weui-panel weui-panel_access">' + 
                '<div class="weui-panel__bd">' + '<a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg">' + 
                '<div class="weui-media-box__hd">' + ' <img class="weui-media-box__thumb head_img" src="' + department.kslistObj[i].head_img + '">' + 
                '</div>' + 
                '<div class="weui-media-box__bd">' + 
                '<span class="ys fl">' + department.kslistObj[i].name + '</span><p class="weui-media-box__desc zc">' + department.kslistObj[i].doc_zc + '</p>' + 
                '<p class="weui-media-box__desc">' + department.kslistObj[i].doc_yy + '</p>' + '<p class="weui-media-box__desc fl">线上接诊：</p>' + 
                '<p class="weui-media-box__desc">' + department.kslistObj[i].len + '</p>' + ' </div>' + '</a>' + ' </div>' +
                ' <div class="weui-panel__hd"></div>' + ' <div class="weui-panel__hd adept">' + department.kslistObj[i].doc_xq + '</div>' + 
                '<div class="weui-cells">' + 
                '<a class="weui-cell weui-cell_access conf" data-id=' + department.kslistObj[i].id + ' href="javascript:;">' + 
                ' <div class="weui-cell__bd">' +
                    '<p class="fl">' + department.showTime1(1) + '</p>' + '<p class="fl">(</p><p class="fl">' + department.kslistObj[i].number1[0] + '</p><p>)</p>' + '</div>' + '<div class="weui-cell__ft">' + '</div>' + '</a>' + '<a class="weui-cell weui-cell_access conf" data-id=' + department.kslistObj[i].id + ' href="javascript:;">' + '<div class="weui-cell__bd">' +
                    '<p class="fl">' + department.showTime1(2) + '</p>' + '<p class="fl">(</p><p class="fl">' + department.kslistObj[i].number1[1] + '</p><p>)</p>' + '</div>' + '<div class="weui-cell__ft">' + '</div>' + ' </a>' + '<a class="weui-cell weui-cell_access conf" data-id=' + department.kslistObj[i].id + ' href="javascript:;">' + '<div class="weui-cell__bd">' +
                    '<p class="fl">' + department.showTime1(3) + '</p>' + '<p class="fl">(</p><p class="fl">' + department.kslistObj[i].number1[2] + '</p><p>)</p>' + '</div>' + '<div class="weui-cell__ft">' + '</div>' + '</a>' + '</div>' + '<div class="weui-panel__ft">' + '<a href="javascript:void(0);" class="weui-cell weui-cell_access weui-cell_link dataMore" data-id=' + department.kslistObj[i].id + '>' + '<div class="weui-cell__bd">查看更多</div>' + '<span class="weui-cell__ft"></span>' + '</a> ' + '</div>' + '</div>';
            }
            $("#target").html(ksStr);
        },
        error: function() {
            console.log('fail 请求数据失败！');
        }
    });
    // 点击查看更多
    $("#target").on("click", ".dataMore", function() {
        var dataId = $(this).attr("data-id");
        for (var i = 0; i < department.kslistObj.length; i++) {
            if (department.kslistObj[i].id == dataId) {
                var btm_list = '<a class="weui-cell weui-cell_access conf" data-id='+ dataId +' data-img='+ department.kslistObj[i].head_img +'href="javascript:;">' + 
                                    '<div class="weui-cell__bd">' + 
                                    '<p class="fl this_time">' + department.showTime2(1) + '</p>' + 
                                    '<p class="fl">(</p><p class="fl">' + department.kslistObj[i].number2[0] + 
                                    '</p><p>)</p>' + 
                                    '</div>' + 
                                    '<div class="weui-cell__ft">' + 
                                    '</div>' + 
                                '</a>' + 
                                '<a class="weui-cell weui-cell_access conf" data-id='+ dataId +' data-img='+ department.kslistObj[i].head_img +' href="javascript:;">' + 
                                    '<div class="weui-cell__bd">' +
                                     '<p class="fl">' + department.showTime2(2) + '</p>' + 
                                    '<p class="fl">(</p><p class="fl">' + department.kslistObj[i].number2[1] + 
                                    '</p><p>)</p>' + 
                                    '</div>' + '<div class="weui-cell__ft">' + '</div>' +
                                '</a>' + 
                                '<a class="weui-cell weui-cell_access conf" data-id='+ dataId +' data-img='+ department.kslistObj[i].head_img +' href="javascript:;">' + 
                                    '<div class="weui-cell__bd">' + 
                                    '<p class="fl">' + department.showTime2(3) + '</p>' + 
                                    '<p class="fl">(</p><p class="fl">' + department.kslistObj[i].number2[2] + 
                                    '</p><p>)</p>' + 
                                    '</div>' + 
                                    '<div class="weui-cell__ft">' + 
                                    '</div>' + 
                                '</a>' + 
                                '<a class="weui-cell weui-cell_access conf" data-id='+ dataId +' data-img='+ department.kslistObj[i].head_img +' href="javascript:;">' + 
                                    '<div class="weui-cell__bd">' + 
                                    '<p class="fl">' + department.showTime3(1) + '</p>' + 
                                    '<p class="fl">(</p><p class="fl">' + department.kslistObj[i].number3[0] + 
                                    '</p><p>)</p>' + 
                                    '</div>' + 
                                    ' <div class="weui-cell__ft">' + 
                                    '</div>' + 
                                '</a>' + 
                                '<a class="weui-cell weui-cell_access conf" data-id='+ dataId +'data-img='+ department.kslistObj[i].head_img +'href="javascript:;">' + 
                                    '<div class="weui-cell__bd">' + 
                                    '<p class="fl">' + department.showTime3(2) + '</p>' + 
                                    '<p class="fl">(</p><p class="fl">' + department.kslistObj[i].number3[1] + 
                                    '</p><p>)</p>' + 
                                    '</div>' + 
                                    '<div class="weui-cell__ft">' + '</div>' + 
                                '</a>' + 
                                '<a class="weui-cell weui-cell_access conf" data-id='+ dataId +'data-img='+ department.kslistObj[i].head_img +' href="javascript:;">' + 
                                    '<div class="weui-cell__bd">' + 
                                    '<p class="fl">' + department.showTime3(3) + '</p>' + 
                                    '<p class="fl">(</p><p class="fl">' + department.kslistObj[i].number3[2] + 
                                    '</p><p>)</p>' + 
                                    '</div>' + 
                                    '<div class="weui-cell__ft">' + 
                                    '</div>' + 
                                '</a>'+
                                '<a class="weui-cell weui-cell_access conf" data-id='+ dataId +' data-img='+ department.kslistObj[i].head_img +' href="javascript:;">' + 
                                    '<div class="weui-cell__bd">' + 
                                    '<p class="fl">' + department.showTime4(1) + '</p>' + 
                                    '<p class="fl">(</p><p class="fl">' + department.kslistObj[i].number3[0] + 
                                    '</p><p>)</p>' + 
                                    '</div>' + 
                                    ' <div class="weui-cell__ft">' + 
                                    '</div>' + 
                                '</a>' + 
                                '<a class="weui-cell weui-cell_access conf" data-id='+ dataId +'data-img='+ department.kslistObj[i].head_img +'href="javascript:;">' + 
                                    '<div class="weui-cell__bd">' + 
                                    '<p class="fl">' + department.showTime4(2) + '</p>' + 
                                    '<p class="fl">(</p><p class="fl">' + department.kslistObj[i].number3[1] + 
                                    '</p><p>)</p>' + 
                                    '</div>' + 
                                    '<div class="weui-cell__ft">' + '</div>' + 
                                '</a>' + 
                                '<a class="weui-cell weui-cell_access conf" data-id='+ dataId +'data-img='+ department.kslistObj[i].head_img +' href="javascript:;">' + 
                                    '<div class="weui-cell__bd">' + 
                                    '<p class="fl">' + department.showTime4(3) + '</p>' + 
                                    '<p class="fl">(</p><p class="fl">' + department.kslistObj[i].number3[2] + 
                                    '</p><p>)</p>' + 
                                    '</div>' + 
                                    '<div class="weui-cell__ft">' + 
                                    '</div>' + 
                                '</a>'+
                                '<a class="weui-cell weui-cell_access conf" data-id='+ dataId +' data-img='+ department.kslistObj[i].head_img +' href="javascript:;">' + 
                                    '<div class="weui-cell__bd">' + 
                                    '<p class="fl">' + department.showTime5(1) + '</p>' + 
                                    '<p class="fl">(</p><p class="fl">' + department.kslistObj[i].number3[0] + 
                                    '</p><p>)</p>' + 
                                    '</div>' + 
                                    ' <div class="weui-cell__ft">' + 
                                    '</div>' + 
                                '</a>' + 
                                '<a class="weui-cell weui-cell_access conf" data-id='+ dataId +'data-img='+ department.kslistObj[i].head_img +'href="javascript:;">' + 
                                    '<div class="weui-cell__bd">' + 
                                    '<p class="fl">' + department.showTime5(2) + '</p>' + 
                                    '<p class="fl">(</p><p class="fl">' + department.kslistObj[i].number3[1] + 
                                    '</p><p>)</p>' + 
                                    '</div>' + 
                                    '<div class="weui-cell__ft">' + '</div>' + 
                                '</a>' + 
                                '<a class="weui-cell weui-cell_access conf" data-id='+ dataId +'data-img='+ department.kslistObj[i].head_img +' href="javascript:;">' + 
                                    '<div class="weui-cell__bd">' + 
                                    '<p class="fl">' + department.showTime5(3) + '</p>' + 
                                    '<p class="fl">(</p><p class="fl">' + department.kslistObj[i].number3[2] + 
                                    '</p><p>)</p>' + 
                                    '</div>' + 
                                    '<div class="weui-cell__ft">' + 
                                    '</div>' + 
                                '</a>'+
                                '<a class="weui-cell weui-cell_access conf" data-id='+ dataId +' data-img='+ department.kslistObj[i].head_img +' href="javascript:;">' + 
                                    '<div class="weui-cell__bd">' + 
                                    '<p class="fl">' + department.showTime6(1) + '</p>' + 
                                    '<p class="fl">(</p><p class="fl">' + department.kslistObj[i].number3[0] + 
                                    '</p><p>)</p>' + 
                                    '</div>' + 
                                    ' <div class="weui-cell__ft">' + 
                                    '</div>' + 
                                '</a>' + 
                                '<a class="weui-cell weui-cell_access conf" data-id='+ dataId +'data-img='+ department.kslistObj[i].head_img +'href="javascript:;">' + 
                                    '<div class="weui-cell__bd">' + 
                                    '<p class="fl">' + department.showTime6(2) + '</p>' + 
                                    '<p class="fl">(</p><p class="fl">' + department.kslistObj[i].number3[1] + 
                                    '</p><p>)</p>' + 
                                    '</div>' + 
                                    '<div class="weui-cell__ft">' + '</div>' + 
                                '</a>' + 
                                '<a class="weui-cell weui-cell_access conf" data-id='+ dataId +'data-img='+ department.kslistObj[i].head_img +' href="javascript:;">' + 
                                    '<div class="weui-cell__bd">' + 
                                    '<p class="fl">' + department.showTime6(3) + '</p>' + 
                                    '<p class="fl">(</p><p class="fl">' + department.kslistObj[i].number3[2] + 
                                    '</p><p>)</p>' + 
                                    '</div>' + 
                                    '<div class="weui-cell__ft">' + 
                                    '</div>' + 
                                '</a>'+
                                '<a class="weui-cell weui-cell_access conf" data-id='+ dataId +' data-img='+ department.kslistObj[i].head_img +' href="javascript:;">' + 
                                    '<div class="weui-cell__bd">' + 
                                    '<p class="fl">' + department.showTime7(1) + '</p>' + 
                                    '<p class="fl">(</p><p class="fl">' + department.kslistObj[i].number3[0] + 
                                    '</p><p>)</p>' + 
                                    '</div>' + 
                                    ' <div class="weui-cell__ft">' + 
                                    '</div>' + 
                                '</a>' + 
                                '<a class="weui-cell weui-cell_access conf" data-id='+ dataId +'data-img='+ department.kslistObj[i].head_img +'href="javascript:;">' + 
                                    '<div class="weui-cell__bd">' + 
                                    '<p class="fl">' + department.showTime7(2) + '</p>' + 
                                    '<p class="fl">(</p><p class="fl">' + department.kslistObj[i].number3[1] + 
                                    '</p><p>)</p>' + 
                                    '</div>' + 
                                    '<div class="weui-cell__ft">' + '</div>' + 
                                '</a>' + 
                                '<a class="weui-cell weui-cell_access conf" data-id='+ dataId +'data-img='+ department.kslistObj[i].head_img +' href="javascript:;">' + 
                                    '<div class="weui-cell__bd">' + 
                                    '<p class="fl">' + department.showTime7(3) + '</p>' + 
                                    '<p class="fl">(</p><p class="fl">' + department.kslistObj[i].number3[2] + 
                                    '</p><p>)</p>' + 
                                    '</div>' + 
                                    '<div class="weui-cell__ft">' + 
                                    '</div>' + 
                                '</a>';
                $("#btm_name").text(department.kslistObj[i].name);
                $("#btm_zc").text(department.kslistObj[i].doc_zc);
            }
        }
        $("#btm_slide_target").html(btm_list);
    });
    //点击描述
    $("#target").on("click", ".adept", function() {
        if ($(this).css("height") == "30px") {
            $(this).css("height", "auto");
        } else {
            $(this).css("height", "30px");
        }
    });
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
    //点击预约的具体时间
    $("#target").on("click", ".conf", function() {
        var this_id = $(this).attr("data-id");
        var this_time = $(this).find(".this_time").text();
        var this_dt = $(this).find(".this_dt").text();
        var this_img = $(this).parents(".weui-panel").find(".head_img").attr("src");
        var this_name = $(this).parents(".weui-panel").find(".ys").text();
        var this_zc = $(this).parents(".weui-panel").find(".zc").text();
        var this_week = $(this).find(".this_week").text();
         
        $.confirm({
            title: '挂号须知',
            text: '1.本次所付费用为专家诊疗费，不包含药物、检查、手术等其它费用<br/>2.优先安排预约时间，实际就诊时间与地点以双方沟通的最终订单为准',
            onOK: function() {
                //点击确认
                console.log(document.cookie);
                if(document.cookie == ''){
                     window.location.href = '/new-user.html'
                }else{
                window.location.href='/make-an-appointment.html?'+'id=' + this_id + '&date='+ this_time + '&dt=' + encodeURI(this_dt) + '&head_src=' +this_img + '&ks=' + department.ks.name + '&name=' + this_name +'&zc=' +this_zc +"&week="+  this_week;
                }
            },
            onCancel: function() {
                // $(".weui-mask").remove();
                // $(".weui-dialog").remove();
            }
        });
    });
    $("#btm_slide_target").on("click", ".conf", function() {
        var this_id = $(this).attr("data-id");
        var this_time = $(this).find(".this_time").text();
        var this_dt = $(this).find(".this_dt").text();
        var this_img = $(this).attr("data-img");
        var this_name = $("#btm_name").text();
        var this_zc = $("#btm_zc").text();
        var this_week = $(this).find(".this_week").text();
        $("#one_list").animate({
            top: '100%'
        });
        $.confirm({
            title: '挂号须知',
            text: '1.本次所付费用为专家诊疗费，不包含药物、检查、手术等其它费用<br/>2.优先安排预约时间，实际就诊时间与地点以双方沟通的最终订单为准',
            onOK: function() {
                //点击确认
                if(document.cookie == ''){
                    window.location.href = '/new-user.html'
                }else{
                    window.location.href='/make-an-appointment.html?'+'id=' + this_id + '&date='+ this_time + '&dt=' + encodeURI(this_dt) + '&head_src=' +this_img + '&ks=' + department.ks.name + '&name=' + this_name +'&zc=' +this_zc +"&week="+  this_week;
                }
            },
            onCancel: function() {
            }
        });
    });
    // $("#btm_slide").on("click", ".conf", function() {
    //     $("#one_list").animate({
    //         top: '100%'
    //     });
    //     //如果参数过多，建议通过 object 方式传入
    //     $.confirm({
    //         title: '挂号须知',
    //         text: '1.本次所付费用为专家诊疗费，不包含药物、检查、手术等其它费用<br/>2.优先安排预约时间，实际就诊时间与地点以双方沟通的最终订单为准',
    //         onOK: function() {
    //             //点击确认
    //         },
    //         onCancel: function() {
    //             // $(".weui-mask").remove();
    //             // $(".weui-dialog").remove();
    //         }
    //     });
    // });
    // $("#target").on("click", ".conf", function() {
    //     var this_id = $(this).attr("data-id");
    //     var this_time = $(this).find(".this_time").text();
    //     var this_dt = $(this).find(".this_dt").text();
    //     console.log(this_id + this_time + this_dt);
    // });
});