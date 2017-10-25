$(function() {
    //提前请求数据
    var archives = (function() {
        function archives() {}
        // archives.dataObj = {
        // }
        return archives;
    })();
    archives.userObj = {
    };
    archives.thisObj = {
        id : "",
        user_name : "",
        user_sfz : "",
        user_phone : "",
        user_age : "",
        user_contacts : "",
        user_contactnumber : "",
        user_sex : "",
        user_nation : "",
        user_date : "",
        user_bloodtype : "",
        user_height : "",
        user_weight : "",
        user_work : "",
        user_xbs : "",
        user_jws : "",
        user_sys : "",
        user_gms : "",
        user_jzs : "",
        user_imgs :[],
        submit_date: ""
    };

    var domain = '../json/archives.json';
    //获取列表
    $.ajax({
        type: "get",
        // async: false,
        url: domain + "",
        dataType: "jsonp",
        jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
        jsonpCallback: "fun", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
        success: function(data) {
            archives.userObj = data.rows;
            $("#user_list").html("");
            var userStr = '';
            console.log(archives.userObj.length);
            var len = archives.userObj.length;
            for(var i=0;i<len;i++){
               userStr += '<label class="weui-cell weui-check__label" for="x'+ i +'">'+
                            '<div class="weui-cell__bd">'+
                                '<p class="fl user_name">'+ archives.userObj[i].user_name +'</p>'+
                                '<p class="fr this_id">'+ archives.userObj[i].id +'</p>'+
                            '</div>'+
                            '<div class="weui-cell__ft">'+
                                '<input type="radio" class="weui-check" name="radio1" id="x' + i + '">'+
                                '<span class="weui-icon-checked"></span>'+
                            '</div>'+
                        '</label>';
            }
            $("#user_list").html(userStr);
            $("#user_list label").eq(0).addClass("this_active");
            //默认用户
            $("#this_id").val(archives.userObj[0].id);
            $("#this_name").val(archives.userObj[0].user_name);
            $("#this_sfz").val(archives.userObj[0].user_sfz);
            $("#this_phone").val(archives.userObj[0].user_phone);

            //是否暂存
            if(archives.userObj[0].iszc == 0){
                $("#info_head").css("display","none");
            }else if(archives.userObj[0].iszc == 1){
                $("#info_text").text("已暂存，最近一次暂存时间为：");
                $("#info_date").text(archives.userObj[0].submit_date);
                $("#info_head").css("display","block");
            }else if(archives.userObj[0].iszc == 2){
                $("#info_text").text("已提交，最近一次提交时间为：");
                $("#info_date").text(archives.userObj[0].submit_date);
                $("#info_head").css("display","block");
            }

            //更换图片列表
            $("#uploaderFiles").html("");
            $("#uploaderInput").siblings().remove();
            var tmpl = '<li id="#imgname#_li" class="weui-uploader__file" style="background-image:url(#url#)"></li>',
            $gallery = $("#gallery"), $galleryImg = $("#galleryImg"),
            // $uploaderInput = $("#uploaderInput"),
            $uploaderInput = $("#uploaderInput_par"),
            $uploaderFiles = $("#uploaderFiles");
                var images_len = archives.userObj[0].images.length;
                for(var k=0;k<images_len;k++){
                   var src = archives.userObj[0].images[k];
                    var src_split = src.split('/'); 
                    $uploaderFiles.append($(tmpl.replace('#url#', src).replace('#imgname#', src_split[src_split.length-1].replace(".","_"))));
        //copy
        //其中img_str 为我自己写的隐藏文本框，用来存放所有的图片名称组成的字符,类似"'名称1','名称2'，'名称3'"，因为我用这个隐藏框的值，来删除页面页面的指定图片。
                    if($("#img_str").val() == '' || $("#img_str").val() == null){
                       $("#img_str").val("'"+src_split[src_split.length-1]+"'");
                    }else{
                       $("#img_str").val($("#img_str").val()+",'"+src_split[src_split.length-1]+"'");
                    }
                    
                    //开启隐藏上传 div
                    $('#uploaderInput').after('<input id="uploaderInput"   name="result_file[]"  class="weui-uploader__input" type="file"   accept="image/*" multiple/>');
                    $('#uploaderInput').hide();
                    $('#uploaderInput').attr({id:""+src_split[src_split.length-1].replace(".","_")+"_input"}).val(); 
                }
            
        },
        error: function() {
            console.log('fail 请求数据失败！');
        }
    });
    //点击选择用户
    $("#user_list").on("click",".weui-check__label",function(){
        var this_id = $(this).find(".this_id").text();
        for(var i=0;i<archives.userObj.length;i++){
            if(archives.userObj[i].id == this_id){
                archives.thisObj.user_name = archives.userObj[i].user_name;
                archives.thisObj.user_sfz = archives.userObj[i].user_sfz;
                archives.thisObj.user_phone = archives.userObj[i].user_phone;
                archives.thisObj.id = archives.userObj[i].id;
                //是否暂存
                if(archives.userObj[i].iszc == 0){
                    $("#info_head").css("display","none");
                }else if(archives.userObj[i].iszc == 1){
                    $("#info_text").text("已暂存，最近一次暂存时间为：");
                    $("#info_date").text(archives.userObj[0].submit_date);
                    $("#info_head").css("display","block");
                }else if(archives.userObj[i].iszc == 2){
                    $("#info_text").text("已提交，最近一次提交时间为：");
                    $("#info_date").text(archives.userObj[0].submit_date);
                    $("#info_head").css("display","block");
                }
                $("#user_home").val(archives.userObj[i].user_home);
                $("#user_age").val(archives.userObj[i].user_age);
                $("#user_contacts").val(archives.userObj[i].user_contacts);
                $("#user_contactnumber").val(archives.userObj[i].user_contactnumber);
                $("#sex").val(archives.userObj[i].user_sex);
                $("#nation").val(archives.userObj[i].user_nation);
                $("#datetime-picker").val(archives.userObj[i].user_date);
                $("#bloodtype").val(archives.userObj[i].user_bloodtype);
                $("#user_height").val(archives.userObj[i].user_height);
                $("#user_weight").val(archives.userObj[i].user_weight);
                $("#user_work").val(archives.userObj[i].user_work);
                $("#xbs").val(archives.userObj[i].user_xbs);
                $("#jws").val(archives.userObj[i].user_jws);
                $("#sys").val(archives.userObj[i].user_sys);
                $("#gms").val(archives.userObj[i].user_gms);
                $("#jzs").val(archives.userObj[i].user_jzs);
                var images_len = archives.userObj[i].images.length;
            //更换图片列表
            $("#uploaderFiles").html("");
            $("#uploaderInput").siblings().remove();
            var tmpl = '<li id="#imgname#_li" class="weui-uploader__file" style="background-image:url(#url#)"></li>',
            $gallery = $("#gallery"), $galleryImg = $("#galleryImg"),
            // $uploaderInput = $("#uploaderInput"),
            $uploaderInput = $("#uploaderInput_par"),
            $uploaderFiles = $("#uploaderFiles");
                // var src="";
                for(var k=0;k<images_len;k++){
                   var src = archives.userObj[i].images[k];
                    var src_split = src.split('/'); 
                    $uploaderFiles.append($(tmpl.replace('#url#', src).replace('#imgname#', src_split[src_split.length-1].replace(".","_"))));
        //copy
        //其中img_str 为我自己写的隐藏文本框，用来存放所有的图片名称组成的字符,类似"'名称1','名称2'，'名称3'"，因为我用这个隐藏框的值，来删除页面页面的指定图片。
                    if($("#img_str").val() == '' || $("#img_str").val() == null){
                       $("#img_str").val("'"+src_split[src_split.length-1]+"'");
                    }else{
                       $("#img_str").val($("#img_str").val()+",'"+src_split[src_split.length-1]+"'");
                    }
                    
                    //开启隐藏上传 div
                    $('#uploaderInput').after('<input id="uploaderInput"   name="result_file[]"  class="weui-uploader__input" type="file"   accept="image/*" multiple/>');
                    $('#uploaderInput').hide();
                    $('#uploaderInput').attr({id:""+src_split[src_split.length-1]+"_input"}); 
                }
            }
        }
        $("#this_id").val(archives.thisObj.id);
        $("#this_name").val(archives.thisObj.user_name);
        $("#this_sfz").val(archives.thisObj.user_sfz);
        $("#this_phone").val(archives.thisObj.user_phone);

        $(this).addClass("this_active");
        $(this).siblings().removeClass("this_active");

        $("#agile").removeClass("up_icon");
        $("#one_list").css("display","none");
        $("#people_list .weui-cells").css("display","none");
    });
    /* 获取当前日期 */
    archives.showTime = function() {
        var show_day = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var date = time.getDate() ;
        var day = time.getDay();
        var hour = time.getHours();
        var minutes = time.getMinutes();
        var second = time.getSeconds();
        /*  month<10?month='0'+month:month;  */
        hour < 10 ? hour = '0' + hour : hour;
        minutes < 10 ? minutes = '0' + minutes : minutes;
        second < 10 ? second = '0' + second : second;
        var now_time = '';
            now_time = year + '-' + month + '-' + date +' ' + hour + ':' + minutes + ':' + second ;
        return now_time;
    }
    
    //暂存
    $("#temporary").click(function(){
            var _this = $("#form_body>div");
            var text = "",temp_label = "",temp_val = "";
            var in_len ="";
            for(var i=1;i<_this.length;i++){
              temp_label = $(_this).eq(i).find("label").text();
              in_len =$(_this).eq(i).find("input").length;
              if(in_len > 2){
                for(var k=0;k < in_len-1;k++){
                   temp_val += $(_this).eq(i).find("input").eq(k).val() + ";"; 
                }
              }else{
              temp_val = $(_this).eq(i).find("input").val();
              }
              text +=temp_label + " : " +temp_val +"<br>";
            }
            archives.thisObj.id = $("#this_id").val();
            archives.thisObj.user_name = $("#user_name").val();
            archives.thisObj.user_sfz = $("#user_sfz").val();
            archives.thisObj.user_phone = $("#user_phone").val();
            archives.thisObj.user_home = $("#user_home").val();
            archives.thisObj.user_age = $("#user_age").val();
            archives.thisObj.user_contacts = $("#user_contacts").val();
            archives.thisObj.user_contactnumber = $("#user_contactnumber").val();
            archives.thisObj.user_sex = $("#sex").val();
            archives.thisObj.user_nation = $("#nation").val();
            archives.thisObj.user_date = $("#datetime-picker").val();
            archives.thisObj.user_bloodtype = $("#bloodtype").val();
            archives.thisObj.user_height = $("#user_height").val();
            archives.thisObj.user_weight = $("#user_weight").val();
            archives.thisObj.user_work = $("#user_work").val();
            archives.thisObj.user_xbs = $("#xbs").val();
            archives.thisObj.user_jws = $("#jws").val();
            archives.thisObj.user_sys = $("#sys").val();
            archives.thisObj.user_gms = $("#gms").val();
            archives.thisObj.user_jzs = $("#jzs").val();
            var img_len = $("#uploaderInput_par").find(".weui-uploader__input");
            for(var i=0;i<$(img_len).length-1;i++){
                archives.thisObj.user_imgs.push($(img_len[i]).val());
            }
            archives.thisObj.submit_date = archives.showTime();
            $.ajax({
                    type: "post",
                    // async: false,
                    url: domain + "",
                    dataType: "json",
                    data: archives.thisObj ,
                    success: function(data) {

                    },
                    error: function() {
                        console.log('fail 请求数据失败！');
                    }
                });
    });
    //提交
    $("#submit").click(function(){
            var _this = $("#form_body>div");
            var text = "",temp_label = "",temp_val = "";
            var in_len ="";
            for(var i=1;i<_this.length;i++){
              temp_label = $(_this).eq(i).find("label").text();
              in_len =$(_this).eq(i).find("input").length;
              if(in_len > 2){
                for(var k=0;k < in_len-1;k++){
                   temp_val += $(_this).eq(i).find("input").eq(k).val() + ";"; 
                }
              }else{
              temp_val = $(_this).eq(i).find("input").val();
              }
              text +=temp_label + " : " +temp_val +"<br>";
            }
            archives.thisObj.id = $("#this_id").val();
            archives.thisObj.user_name = $("#user_name").val();
            archives.thisObj.user_sfz = $("#user_sfz").val();
            archives.thisObj.user_phone = $("#user_phone").val();
            archives.thisObj.user_home = $("#user_home").val();
            archives.thisObj.user_age = $("#user_age").val();
            archives.thisObj.user_contacts = $("#user_contacts").val();
            archives.thisObj.user_contactnumber = $("#user_contactnumber").val();
            archives.thisObj.user_sex = $("#sex").val();
            archives.thisObj.user_nation = $("#nation").val();
            archives.thisObj.user_date = $("#datetime-picker").val();
            archives.thisObj.user_bloodtype = $("#bloodtype").val();
            archives.thisObj.user_height = $("#user_height").val();
            archives.thisObj.user_weight = $("#user_weight").val();
            archives.thisObj.user_work = $("#user_work").val();
            archives.thisObj.user_xbs = $("#xbs").val();
            archives.thisObj.user_jws = $("#jws").val();
            archives.thisObj.user_sys = $("#sys").val();
            archives.thisObj.user_gms = $("#gms").val();
            archives.thisObj.user_jzs = $("#jzs").val();
            var img_len = $("#uploaderInput_par").find(".weui-uploader__input");
            for(var i=0;i<$(img_len).length-1;i++){
                archives.thisObj.user_imgs.push($(img_len[i]).val());
            }
            archives.thisObj.submit_date = archives.showTime();
            $.confirm({
              title: '确认以下信息',
              text: text,
              onOK: function () {
                //点击确认
                $.toast("提交成功");
                $.ajax({
                    type: "post",
                    // async: false,
                    url: domain + "",
                    dataType: "json",
                    data: archives.thisObj ,
                    success: function(data) {

                    },
                    error: function() {
                        console.log('fail 请求数据失败！');
                    }
                });
              },
              onCancel: function () {
              }
            });
    });
    
    //dom操作
    // $(".weui-navbar__item").on("click", function() {
    //     $(this).addClass("weui-bar__item_on").siblings().removeClass("weui-bar__item_on");
    //     $($(this).attr("href")).addClass("weui-tab__bd-item--active").siblings().removeClass("weui-tab__bd-item--active");
    // });

});