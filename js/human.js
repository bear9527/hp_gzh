$(function() {
    //提前请求数据
    var human = (function() {
        function human() {}
        // human.dataObj = {
        // }
        return human;
    })();
    human.menlistObj = {
        men_tb: "",
        men_eykb: "",
        men_jb: "",
        men_xb: "",
        men_fb: "",
        men_sz: "",
        men_szq: "",
        men_xz: "",
        men_bb: ""
    };
    human.womenlistObj = {
        women_tb: "",
        women_eykb: "",
        women_jb: "",
        women_xb: "",
        women_fb: "",
        women_sz: "",
        women_szq: "",
        women_xz: "",
        women_bb: ""
    };

    //右边栏初始化	
    $("#one_list").animate({
        left: '100%'
    });

    var domain = '../json/human.json';
    var menAllList = '';
    var womenAllList = '';
    human.transformation = function(val) {
    	switch(val)
				{
				case 'men_tb' :
				  val ="头部";
				  break;
				case 'men_eykb':
				  val ="耳眼口鼻";
				  break;
				case 'men_jb':
				  val ="颈部";
				  break;
				case 'men_xb':
				  val ="胸部";
				  break;
				case 'men_fb':
				  val ="腹部";
				  break;
				case 'men_sz':
				  val ="上肢";
				  break;
				case 'men_szq':
				  val ="生殖器";
				  break;
				case 'men_xz':
				  val ="下肢";
				  break;
				case 'men_bb':
				  val ="背部";
				  break;
				case 'women_tb' :
				  val ="头部";
				  break;
				case 'women_eykb':
				  val ="耳眼口鼻";
				  break;
				case 'women_jb':
				  val ="颈部";
				  break;
				case 'women_xb':
				  val ="胸部";
				  break;
				case 'women_fb':
				  val ="腹部";
				  break;
				case 'women_sz':
				  val ="上肢";
				  break;
				case 'women_szq':
				  val ="生殖器";
				  break;
				case 'women_xz':
				  val ="下肢";
				  break;
				case 'women_bb':
				  val ="背部";
				  break;
				default:
				  val ="其他";
				}
				return val;
    }
    human.getAllList = function() {
        for ( x in human.menlistObj) {
            menAllList += '<a class="weui-cell weui-cell_access" href="javascript:;" data-this="'+x+'"><div class="weui-cell__bd"><p>' + human.transformation(x) + '</p></div><div class="weui-cell__ft"></div></a>';
        }
        for ( y in human.menlistObj) {
            womenAllList += '<a class="weui-cell weui-cell_access" href="javascript:;" data-this="'+y+'"><div class="weui-cell__bd"><p>' + human.transformation(y) + '</p></div><div class="weui-cell__ft"></div></a>';
        }
        //判断男女渲染列表
        $("#all_list").html(menAllList);
        $("#btn").click(function() {
            $("#all_list").html(menAllList);
        });
        $("#btn2").click(function() {
            $("#all_list").html(womenAllList);
        });
    };
    human.getChildrenList = function(one,two,three) {
        $("#one_list_right").html('');
        //men
        $("#organswrapper1").find("path:not(.nome)").click(function() {
            var pos_this = $(this).attr("data-position");
            var childList = '';
            childList = '<h5 class="text-center">' + human.transformation(pos_this) + '</h5>';
            for (var i = 0; i < human.menlistObj[pos_this].length; i++) {
                childList += '<a class="weui-cell weui-cell_access" href="javascript:;"><div class="weui-cell__bd"><p>' + human.menlistObj[pos_this][i] + '</p></div><div class="weui-cell__ft"></div></a>';
            }
            $("#one_list_right").html(childList);
            $("#one_list").animate({
            	left: '0%'
        	});
        });

            // var pos_this = $(this).attr("data-position");
            // var childList = '';
            // childList = '<h5 class="text-center">' + three + '</h5>';
            // for (var i = 0; i < human.menlistObj[pos_this].length; i++) {
            //     childList += '<a class="weui-cell weui-cell_access" href="javascript:;"><div class="weui-cell__bd"><p>' + human.menlistObj[pos_this][i] + '</p></div><div class="weui-cell__ft"></div></a>';
            // }
            // $("#one_list_right").html(childList);
            // $("#one_list").animate({
            //     left: '0%'
            // });



        //women
        $("#organswrapper").find("path:not(.nome)").click(function() {
            var pos_this = $(this).attr("data-position");
            var childList = '';
            childList = '<h5 class="text-center">' + human.transformation(pos_this) + '</h5>';
            for (var i = 0; i < human.womenlistObj[pos_this].length; i++) {
                childList += '<a class="weui-cell weui-cell_access" href="javascript:;"><div class="weui-cell__bd"><p>' + human.womenlistObj[pos_this][i] + '</p></div><div class="weui-cell__ft"></div></a>';
            }
            $("#one_list_right").html(childList);
            $("#one_list").animate({
            	left: '0%'
        	});
        });
            
        
    };
    //获取列表
    $.ajax({
        type: "get",
        // async: false,
        url: domain + "",
        dataType: "jsonp",
        jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
        jsonpCallback: "fun", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
        success: function(data) {
            // var human.menlistObj = data.men,
            //     human.womenlistObj = data.women;
                human.menlistObj = data.rows[0],
                human.womenlistObj = data.rows[1];
            $("#all_list").html("");
            human.getAllList();
    		human.getChildrenList();
        },
        error: function() {
            console.log('fail 请求数据失败！');
        }
    });
    
    
    //dom操作
    $(".weui-navbar__item").on("click", function() {
        $(this).addClass("weui-bar__item_on").siblings().removeClass("weui-bar__item_on");
        $($(this).attr("href")).addClass("weui-tab__bd-item--active").siblings().removeClass("weui-tab__bd-item--active");
    });
    $(".women").css("display", "none");
    $("#btn").click(function() {
        $(".men").css("display", "block");
        $(".women").css("display", "none");
        $(this).removeClass("weui-btn_default").addClass("weui-btn_orange").siblings().removeClass("weui-btn_orange").addClass("weui-btn_default");
    });
    $("#btn2").click(function() {
        $(".men").css("display", "none");
        $(".women").css("display", "block");
        $(this).removeClass("weui-btn_default").addClass("weui-btn_orange").siblings().removeClass("weui-btn_orange").addClass("weui-btn_default");
    });
    //点击总列表出现子列表
    $("#all_list").on("click", ".weui-cell", function() {
    	var _this = $(this).attr("data-this");
    	var childList = '';
            childList = '<h5 class="text-center">' + human.transformation(_this) + '</h5>';
            for (var i = 0; i < human.menlistObj[_this].length; i++) {
                childList += '<a class="weui-cell weui-cell_access" href="javascript:;"><div class="weui-cell__bd"><p>' + human.menlistObj[_this][i] + '</p></div><div class="weui-cell__ft"></div></a>';
            }
            $("#one_list_right").html(childList);
        $("#one_list").animate({
            left: '0%'
        });
    });
    $("#one_list_left").on("click", function() {
        $("#one_list").animate({
            left: '100%'
        });
    });
    //点击子列表项
    $("#one_list_right").on("click", ".weui-cell", function() {
    	var _this = $(this).attr("data-this");
    	//to do ...
        // $("#one_list").animate({
        //     left: '100%'
        // });
    });

});