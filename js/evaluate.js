$(function() {
    //提前请求数据
    var evaluate = (function() {
        function evaluate() {}
        // evaluate.dataObj = {
        // }
        return evaluate;
    })();
    evaluate.evlistObj = {
    };
    evaluate.docSublistObj = {
    };
    evaluate.doclistObj = {
    };
    evaluate.defalutlistObj = {
    };
    // var domain = '../json/evaluate.json';
    var domain = '../json/archives.json';

    //获取就诊人列表
    $.ajax({
        type: "get",
        // async: false,
        url: domain + "",
        dataType: "jsonp",
        jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
        jsonpCallback: "fun", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
        success: function(data) {
            evaluate.defalutlistObj = data.rows;
            $("#user_list").html("");
            var userStr = '';
            console.log(evaluate.defalutlistObj.length);
            var len = evaluate.defalutlistObj.length;
            for(var i=0;i<len;i++){
               userStr += '<label class="weui-cell weui-check__label" for="x'+ i +'">'+
                            '<div class="weui-cell__bd">'+
                                '<p class="fl user_name">'+ evaluate.defalutlistObj[i].user_name +'</p>'+
                                '<p class="fr this_id">'+ evaluate.defalutlistObj[i].id +'</p>'+
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
            $("#this_id").val(evaluate.defalutlistObj[0].id);
            $("#this_name").val(evaluate.defalutlistObj[0].user_name);
            $("#this_sfz").val(evaluate.defalutlistObj[0].user_sfz);
            $("#this_phone").val(evaluate.defalutlistObj[0].user_phone);
            $("#jzr").html(evaluate.defalutlistObj[0].user_name);
            //评论
            $("#bt").html();
            $("#pl").html();
            $("#date").html();
            
        },
        error: function() {
            console.log('fail 请求数据失败！');
        }
    });

    //点击选择用户
    $("#user_list").on("click",".weui-check__label",function(){
        var this_id = $(this).find(".this_id").text();
        var user_name = $(this).find(".user_name").text();
        $(this).addClass("this_active");
        $(this).siblings().removeClass("this_active");
        $("#jzr").html(user_name);
        $("#agile").removeClass("up_icon");
        $("#one_list").css("display","none");
        $("#user_list").css("display","none");
    });

    //输入框限制字数
    $("#txt").keyup(function(){
       var len = $(this).val().length;
       if(len > 199){
        $(this).val($(this).val().substring(0,200));
       }
       var num = len;
       $("#word").text(num);
    });
    $("#txt_doc").keyup(function(){
       var len = $(this).val().length;
       if(len > 199){
        $(this).val($(this).val().substring(0,200));
       }
       var num = len;
       $("#word_doc").text(num);
    });
    //提交评价医院表单信息
    $("#yes").click(function(){
        evaluate.evlistObj.id = $("#people_list").find(":checked").parents("label").find(".fr").html();
        evaluate.evlistObj.population = $("#star").find("input[name='score']").val();
        evaluate.evlistObj.environmentalScience = $("#star1").find("input[name='score']").val();
        evaluate.evlistObj.technology = $("#star2").find("input[name='score']").val();
        evaluate.evlistObj.attitude = $("#star3").find("input[name='score']").val();
        evaluate.evlistObj.txt = $("#txt").val();
        
        $.ajax({
            type: "post",
            // async: false,
            url: domain + "",
            dataType: "json",
            data: evaluate.evlistObj,
            success: function(data) {
                $.toast("提交成功", "text");
            },
            error: function() {
                $.toast("提交失败", "text");
                console.log('fail 请求数据失败！');
            }
        });
    });
    $("#yspj").click(function(){
            //请求医生数据
            $.ajax({
                type: "get",
                // async: false,
                url: domain + evaluate.defalutlistObj[0].id,
                dataType: "jsonp",
                jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
                jsonpCallback: "fun", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
                success: function(data) {
                    evaluate.doclistObj = data.rows;
                    var userStr = '';
                    var len = evaluate.doclistObj.length;
                    for(var i=0;i<len;i++){
                       userStr += '';
                    } 
                    //医生信息
                    
                    $("#docname").attr("data-id",evaluate.doclistObj.id);
                    $("#docname").html(evaluate.doclistObj.docname);
                    $("#zc").html(evaluate.doclistObj.zc);
                    $("#head_img").attr("src",evaluate.doclistObj.head_img);  
                    $("#ks").html(evaluate.doclistObj.ks);
                    //判断有无待给医生评论
                    $("#doc_pl").css("display","none");
                    if(evaluate.doclistObj.istrue == 0){
                        $("#doc_pl_not").css("display","block");
                        $("#doc_pl").css("display","none");
                    }else if(evaluate.doclistObj.istrue == 1){
                        $("#doc_pl_not").css("display","none");
                        $("#doc_pl").css("display","block");
                    }
                },
                error: function() {
                    console.log('fail 请求数据失败！');
                }
            });
    });
    
    //提交评价医生表单信息
    $("#yes_doc").click(function(){
        evaluate.docSublistObj.id = $("#people_list").find(":checked").parents("label").find(".fr").html();
        // evaluate.doclistObj.population = $("#star_doc").find("input[name='score']").val();
        evaluate.docSublistObj.doc_id = $("#docname").attr("data-id");
        evaluate.docSublistObj.environmentalScience = $("#star_doc1").find("input[name='score']").val();
        evaluate.docSublistObj.technology = $("#star_doc2").find("input[name='score']").val();
        evaluate.docSublistObj.attitude = $("#star_doc3").find("input[name='score']").val();
        evaluate.docSublistObj.txt = $("#txt_doc").val();
        
        $.ajax({
            type: "post",
            // async: false,
            url: domain + "",
            dataType: "json",
            data: evaluate.doclistObj,
            success: function(data) {
                $.toast("提交成功", "text");
            },
            error: function() {
                $.toast("提交失败", "text");
                console.log('fail 请求数据失败！');
            }
        });
    });
    
    

});