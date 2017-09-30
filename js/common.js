/*
 * 将ajax调用封装起来
 * @Author: strong 
 * @Date: 2017-05-09 13:13:59 
 * @Last Modified by: strong
 * @Last Modified time: 2017-05-24 16:36:45
 */
'use strict'
class AjaxApi {
	constructor(options) {
		this.options = {
			retryMethod: '', // 重试方法
			method: 'get',
			rootDiv: $("#ajaxData"), // 页面根div对象,默认为$("ajaxData")
			resultDesc: '系统异常，请稍后再试',// 未获取到数据时候的显示内容
			ajaxUrl: '',// 异步请求的地址
			ajaxData: {},
			loadingText: '加载中...', // 加载中的文字
			successCb : (resp) => {
			},
			failCb : (resp) => {
				this._defaultFailCb(resp);
			},
			errorCb : () => {
				this._defaultErrorCb();
			}
		}
		Object.assign(this.options, options)
	}
	
	_defaultFailCb(resp) {
		if(this.options.method === 'get') {
			let retryButton = `<a href="javascript:;" onclick="${this.options.retryMethod}" class="c359de4">重试</a>`
			// 如果重试方法没有配置，则不显示重试按钮
			if(Util.checkNull(this.options.retryMethod)) {
				retryButton = '';
			}
			this.options.rootDiv.html(`<div class="kd-loading-wrap">
			<p class="f14">${resp.resultDesc} ${retryButton}</p>
			</div>
			`);
		} else {
			ui.showTip(resp.resultDesc, 3000);
		}		
	}
	
	
	_defaultErrorCb() {
		const resp = {
			resultDesc : this.options.resultDesc
		}
		this._defaultFailCb(resp)
	}
	
	// 页面的某一块显示没有数据
	defaultNullDataCbForPage(desc) {
		this.options.rootDiv.html(`<div class="kd-loading-wrap">
			<p class="f14">${desc}</p>
			</div>
		`);
	}
	
	// 整个页面显示没有数据
	defaultNullDataCbForAllPage(desc) {
		this.options.rootDiv.html(`<div>
			<p class="kd-emptydata"></p>
			<p class="kd-emptydata-title">左翻右翻</p>
			<p class="kd-emptydata-text">${desc}</p>
			</div>
		`);
	}
	
	// 给表单input赋值
	setInputValue(formName = 'dataForm', inputName, value) {
		$(`#${formName} input[name='${inputName}']`).val(value)
	}

	// 获取表单input值
	getInputValue(formName = 'dataForm', inputName) {
		return $(`#${formName} input[name='${inputName}']`).val()
	}
	
	// get方式异步获取ajax数据
	run() {
		if(Util.checkNull(this.options.ajaxUrl)) {
			console.error("异步获取数据没有配置异步调用地址ajaxUrl");
			return;
		}
		if(this.options.rootDiv.length<1) {
			console.error("页面rootDiv节点不存在或没有传入对应的根节点");
			return;
		}
		if(this.options.method === 'post') {
			showLoading(this.options.loadingText);
		} else {
			this.options.rootDiv.html(`<div class="kd-loading-wrap">
			<i class='kd-loading'></i>
			<p class="f14">加载中...</p>
		</div>
			`);
		}
		$.ajax({
			type: this.options.method,
			url: this.options.ajaxUrl,
			data: this.options.ajaxData,
			dataType: "json",
			success: (resp) => {
				if(this.options.method === 'post') {
					hideLoading()
				}
				if(resp.resultCode === '0'){
					this.options.successCb(resp)
				} else {
					this.options.failCb(resp)
				}
			},
			error : () => {
				if(this.options.method === 'post') {
					hideLoading()
				}
				this.options.errorCb()
			}
		});
	}
}

//下面代码是屏蔽微信右上角的菜单栏
$(function(){
	if (typeof WeixinJSBridge == "undefined"){
	    if( document.addEventListener ){
	        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
	    }else if (document.attachEvent){
	        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
	        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
	    }
	}else{
	    onBridgeReady();
	}

	function onBridgeReady(){
		WeixinJSBridge.call('hideOptionMenu');
	}
});


function showTitle(config) {
	showCopyright(config);
}

function showCopyright(config){
	$(window).click(function (){
		$(".footer3").removeAttr("style");
		var date = new Date();
		var year = date.getFullYear();
		var name = "金蝶医疗软件科技有限公司";
		if(typeof(config) != 'undefined' && typeof(config.hospitalShortName) != 'undefined'){
			name = config.hospitalShortName + " 金蝶医疗";
		}
		$(".footer3").html("Copyright © 1993-"+year+" "+name);
		if(document.documentElement.scrollHeight<document.documentElement.clientHeight){
			$(".footer-hospitial-name").attr("style","position:absolute;bottom:18px;");

			$(".footer3").attr("style","position:absolute;bottom:0px;");
		}
	});
	$(window).click();
}

function showTitleNoCopy() {
	if(typeof(AlipayJSBridge) != "undefined"){
			AlipayJSBridge.call("showTitlebar");
	}
}

/**
 * 异步后台打印日志
 */
function ajaxToPrintPageLogs(){
	$.ajax( {
	    url: Util.getBasePath() + "/pageStatisticsLogs!printPageOperatLogs.do",
	    data:$("#pageOperatingLogsForm").serialize(),
	    type:'post',
	    cache:false,
	    dataType:'json',
	    success:function(data) {
	     },
	     error : function() {
	     }
	});
}

// 屏蔽屏幕自身手势
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
/*
 * 在jquery中扩展的插件
 * @Author: strong 
 * @Date: 2017-05-11 14:31:54 
 * @Last Modified by: strong
 * @Last Modified time: 2017-05-11 14:34:34
 */

// 将表单序列化成json对象
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
/*
 * 图片预览加载显示
 * @Author: strong 
 * @Date: 2017-05-12 14:35:36 
 * @Last Modified by: strong
 * @Last Modified time: 2017-05-16 19:11:18
 */

const photo_swipe = (function () {
  let _defaults = {
    history: false,
    focus: false,
    loop: false,
    tapToToggleControls: false, // 点击切换控件的可见性
    closeOnVerticalDrag: false,
    showAnimationDuration: 0,
    hideAnimationDuration: 0,
    loadingIndicatorDelay: 0, // 产生loading的时间
    tapToClose: true, // 点击界面是否关闭预览图片
    closeEl: false, // 是否显示关闭按钮
    deleteEl: false, // 是否显示删除按钮
    errorMsg: '<div class="pswp__error-msg">图片加载失败</div>',
    onDelete(index) { // 删除图片绑定事件
    }
  }

  let _items = []
  let _pswpElement
  let _photo_swipe_inst

  function _bindEvent() {
    $(".pswp__bottom-bar").on('touchstart', function () {
      $(this).addClass('pswp__bottom-bar-active')
    })
    // 点击删除事件
    $(".pswp__bottom-bar").on('touchend', function () {
      $(this).removeClass('pswp__bottom-bar-active')
      actionsheet.init({
        title: '是否删除该张图片？',
        buttons: ['确认删除'],
        cancelTitle: '返回',
        callback: function (x) {
          ui.showTip('删除成功', 1000)
          const currentIndex = _photo_swipe_inst.getCurrentIndex()
          const itemNums = _photo_swipe_inst.options.getNumItemsFn()
          if (currentIndex + 1 === itemNums) {
            _photo_swipe_inst.prev()
          }
          _photo_swipe_inst.items.splice(currentIndex, 1)
          _photo_swipe_inst.invalidateCurrItems();
          _photo_swipe_inst.updateSize(true);

          // 最后一张的话关闭预���界面
          if (itemNums === 1) {
            _photo_swipe_inst.close();
          }
          _defaults.onDelete.call(this, currentIndex)
        }
      })
      actionsheet.show()
    })
  }

  // 加载require.js后的回调
  function _loadRequireCb(picIndex) {
    if (typeof PhotoSwipe !== 'undefined' && typeof PhotoSwipeUI_Default !== 'undefined') {
      _loadPhotoSwipeCb(picIndex, PhotoSwipe, PhotoSwipeUI_Default)
    } else {
      require.config({
        baseUrl: `${Util.getBasePath()}/js/photoswipe`,
        paths: {
          "PhotoSwipe": "photoswipe.min",
          "PhotoSwipeUI_Default": "photoswipe-ui-default.min"
        }
      });

      require(['PhotoSwipe', 'PhotoSwipeUI_Default'], function (PhotoSwipe, PhotoSwipeUI_Default) {
        _loadPhotoSwipeCb(picIndex, PhotoSwipe, PhotoSwipeUI_Default)
      })
    }
  }

  // 加载photoswip.js后的回调
  function _loadPhotoSwipeCb(picIndex, PhotoSwipe, PhotoSwipeUI_Default) {
    hideLoading();
    let options = Object.assign(_defaults, { "index": picIndex })
    _photo_swipe_inst = new PhotoSwipe(_pswpElement, PhotoSwipeUI_Default, _items, options);

    //c处理不知道图片大小的情况
    _photo_swipe_inst.listen('gettingData', function (index, item) {
      if (item.w < 1 || item.h < 1) { // unknown size
        var img = new Image();
        img.src = item.src;// let's download image
        img.onload = function () { // will get size after load
          item.w = this.width; // set image width
          item.h = this.height; // set image height
          _photo_swipe_inst.invalidateCurrItems(); // reinit Items
          _photo_swipe_inst.updateSize(true); // reinit Items
        }
      }
    });

    _photo_swipe_inst.init()
    return _photo_swipe_inst
  }

  return {
    init(picList, options = {}) {
      _items = []
      _defaults = Object.assign(_defaults, options)
      _pswpElement = document.querySelectorAll('.pswp')[0];
      for (let i = 0; i < picList.length; i++) {
        let obj = {
          src: picList[i].src,
          w: picList[i].w || 0,
          h: picList[i].h || 0
        }
        _items.push(obj)
      }
      if (_defaults.deleteEl) {
        $(".pswp__bottom-bar").removeClass("hide")
      }
      _bindEvent()
      return this;
    },
    openPhotoSwipe(picIndex = 0) {
      showLoading();
      if (typeof require !== 'undefined') {
        _loadRequireCb(picIndex)
      } else {
        $.getScript(`${Util.getBasePath()}/js/require/require.js`, function () {
          _loadRequireCb(picIndex)
        })
      }

    }
  }
})();
/*
 * 图片上传组件
 * @Author: strong 
 * @Date: 2017-05-13 23:11:12 
 * @Last Modified by: strong
 * @Last Modified time: 2017-05-15 20:27:57
 */
const photo_upload = (function () {
  // 实际使用的配置
  let _options = {}
  // 默认配置
  const _defaults = {
    imageWarp: "#kdui-uploader__warp", // 存放上传的图片的容器
    fileInputWarp: "#uploadInputWarp", // input最上层的div
    fileInput: "#uploadInput", // 点击触发图片选择的input
    fileInputWidthMode: "noraml", // 上传框的大小，默认noraml(75*75), small(50*50)
    uploaderUrl: "",// 上传图片服务器路径
    deleteUrl: "",// 删除图片服务器路径
    limitSize: 10,//图片大小限制 5M【-1表示不限】
    limitNum: 5,//图片数量限制【-1表示不限】
    isCompress: true, //是否需要压缩
    compressRatio: 0.7, //压缩比例
    beforeComplete(src, index) {
      _defaultBeforeComplete.call(null, src, index)
    }, //上传前处理
    beforeDefaultComplete(index) { // 使用默认上传前处理完成后的回调
    },
    afterComplete(index, picUrl) {
      _defaultAfterComplete.call(null, index, picUrl)
    }, // 上传成功后处理
    afterDefaultComplete(index) { // 使用默认上传完成处理后的回调
    },
    afterDeleteComplete(index) { // 删除后回调
      _defaultDeleteComplete.call(null, index)
    },
    afterDefaultDeleteComplete(index) { // 使用默认删除完成处理后的回调
    },
    uploadError(index) {
      _uploadError.call(null, index)
    } // 上传失败处理
  }

  // 删除图片默认处理
  function _defaultDeleteComplete(index) {
    const _currentImg = $(_options.imageWarp).find('li')[index]
    const picurl = $(_currentImg).data('picurl')
    _currentImg.remove()
    if ($(_options.imageWarp).find('li').length < _options.limitNum || _options.limitNum !== -1) {
      $(_options.fileInputWarp).show()
    }
    $.ajax({
      type: "post",
      url: _options.deleteUrl,
      data: { imgUrl: picurl },
      dataType: "json",
      success: function (data) {
        if (data.resultCode == 0) {
          console.info(`删除成功picurl:${picurl}`)
        } else {
          console.info(`删除失败${data.resultDesc}`)
        }
      },
      error: function (e) {
        console.error(`删除失败${e}`)
      }
    })
    _options.afterDefaultDeleteComplete(null, index)
  }

  // 错误处理
  function _uploadError(index) {
    ui.showTip('图片上传失败，请稍后再试', 2000)
    setTimeout(function () {
      $(`li#${index}`).remove()
    }, 1000)
  }

  // 上传后的处理
  function _defaultAfterComplete(index, picUrl) {
    $(`li#${index}`).data('newupload', '1')
    $(`li#${index}`).data('picurl', picUrl)
    $(`li#${index}`).removeClass('kdui-uploader__file_status')
    $(`li#${index} div.kd-loading-wrap`).remove()
    $(`li#${index}`).on('click', function () {
      let photos = []
      $(_options.imageWarp).find('li').each(function () {
        //注意需要兼容ios和android，ios下面[url()],android下面[url("")]
        let picurl = $(this).data('newupload') === '1' ?  $(this).css('backgroundImage').replace('url("', '').replace('")', '').replace('url(', '').replace(')', '') : $(this).data('picurl')
        let obj = { src: picurl }
        Object.assign(obj, { w: $(this).data("imagew"), h: $(this).data("imageh") })
        photos.push(obj)
      });
      const options = {
        deleteEl: true,
        onDelete(index) {//这个index是列表数据的序号【0,1,2,3，...】
          _options.afterDeleteComplete.call(null, index)
        }
      }
      let photoWiseInstance = photo_swipe.init(photos, options)
      // 初始化话图片预览控件
      photoWiseInstance.openPhotoSwipe($(_options.imageWarp).find('li').index(this));
    })
    _options.afterDefaultComplete.call(null, index)
  }

  // 上传前的处理【默认处理，当没有自定义事件的时候】
  function _defaultBeforeComplete(src, index) {
    var image = new Image();
    image.src = src;
    image.onload = function () {
      $(_options.imageWarp).append(`
        <li data-imageh="${image.height}" data-imagew="${image.width}" id=${index} class="ml0 kdui-uploader__file kdui-uploader__file_status ${_options.fileInputWidthMode === 'small' ? 'kdui-uploader_small' : ''}" style="background-image:url(${src})">
                  <div class="kdui-uploader__file-content kd-loading-wrap">
            <i class='kd-loading'></i>
          </div>
              </li>
      `)
      // 判断当前是否是否已经上传了规定张数的图片
      if ($(_options.imageWarp).find('li').length >= _options.limitNum && _options.limitNum !== -1) {
        $(_options.fileInputWarp).hide()
      }
      if (myScroll) {
        myScroll.refresh()
      }
      _options.beforeDefaultComplete.call(null, index)
    }
  }

  // 图片上传
  function _upload(fileObject) {
    showLoading()
    // 动态加载require.js
    if (typeof require !== 'undefined') {
      _requireCb.call(this, fileObject)
    } else {
      $.getScript(`${Util.getBasePath()}/js/require/require.js`, function () {
        _requireCb.call(this, fileObject)
      })
    }
  }

  // require js加载完毕后的回调函数
  function _requireCb(fileObject) {
    if (typeof lrz !== 'undefined') {
      _loadLrzCb.call(this, fileObject)
    } else {
      require.config({
        baseUrl: `${Util.getBasePath()}/js/lrz`,
        paths: {
          "lrz": "lrz.min"
        }
      });
      require(['lrz'], function (lrz) {
        _loadLrzCb.call(this, fileObject)
      })
    }
  }

  // 加载lrz.js后的回调
  function _loadLrzCb(fileObject) {
    let lrzOptions = {}
    let compressRatio = _options.isCompress ? _options.compressRatio : 1
    Object.assign(lrzOptions, { quality: compressRatio, width: 1024 })
    if (fileObject.files.length === 0) {
      hideLoading()
      return
    }
    lrz(fileObject.files[0], lrzOptions)
      .then(function (rst) { // 上传前的处理
        hideLoading()
        // 判断上传的图片是否超出限制的大小
        if (rst.origin.size / 1024 / 1024 > _options.limitSize && _options.limitSize !== -1) {
          ui.showTip(`上传的图片不能超过${_options.limitSize}M`, 2000)
          return
        }
        const index = Math.random().toString().split('.')[1] // 生成随机数，来定位上传的文件的位置
        _options.beforeComplete.call(null, rst.base64, index)
        Object.assign(rst, { index, index })
        return rst
      })
      .then(function (rst) { // 开始异步上传数据
        $.ajax({
          type: "post",
          url: _options.uploaderUrl,
          data: { photo: rst.base64 },
          dataType: "json",
          cache: !1,
          success: function (data) {
            if (data.resultCode == 0) {
              let picUrl = ''
              try {
                picUrl = data.data.filePath;
              } catch (e) {
                console.error('filePath没有')
              }
              _options.afterComplete.call(null, rst.index, picUrl);
            } else {
              _options.uploadError.call(null, rst.index);
            }
          },
          error: function () {
            _options.uploadError.call(null, rst.index);
          }
        })
      })
      .catch(function (err) { // 捕捉错误日志
        ui.showLoading('系统异常，请稍后再试', 2000)
      })
      .always(function () { // 什么情况都���进来的
        hideLoading()
      });
  }

  return {
    init(options = {}) {
      _options = Object.assign(_defaults, options)
      if (_options.fileInputWidthMode === 'small') {
        $(_options.fileInputWarp).addClass('kdui-uploader_small')
      }
      $(_options.fileInput).on('change', function () {
        _upload.call(null, this)
      })
    },
    // 默认在界面上组装图片【传入序号缩略图和原图】
    defaultBuildImgsData(index, thumbPhoto, photo) {
      return `
        <li id=${index} data-picurl=${photo} class="ml0 kdui-uploader__file ${_options.fileInputWidthMode === 'small' ? 'kdui-uploader_small' : ''}" style="background-image:url(${thumbPhoto})">
        </li>
      `
    },
    // 提供对外的删除方法
    deleteImg(index) {
      _options.afterDeleteComplete.call(null, index)
    },
    // 对外提供通用的获取当前页面所有的图片进行绑定click事件打开预览页面
    defaultBindAllPicClick() {
      $(_options.imageWarp).find('li').each(function (index) {
        $(this).on('click', function () {
          var photos = [];
          $(_options.imageWarp).find('li').each(function () {
            //注意需要兼容ios和android，ios下面[url()],android下面[url("")]
            let picurl = $(this).data('newupload') === '1' ?  $(this).css('backgroundImage').replace('url("', '').replace('")', '').replace('url(', '').replace(')', '') : $(this).data('picurl')
            let obj = { src: picurl }
            photos.push(obj)
          });
          var photo_swipe_options = {
            deleteEl: true,
            onDelete(index) {//这个index是列表数据的序号【0,1,2,3，...】
              photo_upload.deleteImg(index)
            }
          }
          var photoWiseInstance = photo_swipe.init(photos, photo_swipe_options)
          // 初始化话图片预览控件
          photoWiseInstance.openPhotoSwipe(index);
        })
      })
    }
  }
})()

/**
 * 由于涉及地方比较多，暂时不放在ui对象里面
 * @param targetid
 */
function toggle(targetid){
     if (document.getElementById){
         var target=document.getElementById(targetid);
             if (target.style.display=="block"){
                 target.style.display="none";
             } else {
                 target.style.display="block";
             }
     }
}

/*大部分通用组件js*/
var ui = function(){
	return {
		/**
		 * 显示提示
		 * @param top:距离浏览器顶部高度，为空的时候显示为默认170px
		 * @param content 显示的内容
		 */
		showTip : function(top, content, timeout) {
			var fastnote = document.querySelector('.fast_note');
			if(!Util.checkNull(top))
				fastnote.style.top = top +"px";
			fastnote.innerText = content;
			fastnote.style.display = "block";
			if(!Util.checkNull(timeout)){
				setTimeout(function(){
					 ui.hideTip();
				},timeout);
			}
		},
		/**
		 * 显示提示【默认距离浏览器高度为170px】
		 * @param content 显示的内容
		 */
		showTip : function(content, timeout) {
			var fastnote = document.querySelector('.fast_note');
			fastnote.innerText = content;
			fastnote.style.display = "block";
			if(!Util.checkNull(timeout)){
				setTimeout(function(){
					 ui.hideTip();
				},timeout);
			}
		},
		/**
		 * 隐藏提示
		 */
		hideTip : function(){
			document.querySelector('.fast_note').style.display = "none";
		},
		/**
		 * 设置tab状态
		 */
		setTabStatus : function(current){
			$('.kd-tab-nav>li').each(function(){
				var $this = $(this);
				if (current == $this.data("current")){
					$this.addClass('current');
				}
			});
		},
		/**
		 * tab切换 传入回调函数
		 */
		tabSelect : function(callback){
			$('.kd-tab-nav>li').click(function(){
				var $this = $(this);
				if ($this.hasClass('current')) {
					return;
				};
				$('.kd-tab-nav>li').removeClass('current');
				$this.addClass('current');
				callback.call(this);
			});
		}
	};
}();

/*由下滑出弹出框组件js*/
var actionsheet = (function(){

	var $cancleBtn;
	var $actionsheet;

	//默认配置
	var defaults = {
		title:"温馨提示",
		buttons:["确认"],
		cancelTitle:"取消",
		callback:function(){}
		};

	function _show_kdactionsheet(){
		$actionsheet.addClass("show");
	}
	function _hide_kdactionsheet(){
		$actionsheet.removeClass("show");
	}
	//重置
	function _reset(){
		$actionsheet.find('.actionsheet-btn').remove();
		$actionsheet.click(_hide_kdactionsheet);
	}
	//设置文字 
	 function _initText(options){
		$('.kd-actionsheet-cnt>h4').html(options.title);
		$cancleBtn.html(options.cancelTitle);
	}
	//初始化按钮
	 function _initBtn(buttons){
			for(var i = 0;i < buttons.length;i++){
				var $btn = $('<button/>');
				var button = buttons[i];
				$btn.text(button);
				$btn.addClass('actionsheet-btn');
				$cancleBtn.before($btn);
			}
		}
	//绑定回调函数
	function _bindEvent(callback){
		var $buttons = $('.kd-actionsheet').find('.actionsheet-btn');
		$buttons.unbind('click');
		$buttons.on('click', function(){
			this.index = $buttons.index($(this));
			callback.call(this);
		});
	}
	
	return {
		
		init : function(options){
			$cancleBtn = $('#cancleBtn');
			$actionsheet = $(".kd-actionsheet");
			
			options = $.extend({},defaults,options);
			_reset();
			_initBtn(options.buttons);
			_bindEvent(options.callback);
			_initText(options);
			return this;
		},
		show : function(){
			_show_kdactionsheet();
		},
		hide : function(){
			_hide_kdactionsheet();
		},
		bindEvent : function(callback){
			_bindEvent(callback);
			return this;
		}
	};
})();

/*直接弹出框组件js*/
var popup = (function(){
	var $cancleBtn;
	var $confirmBtn;
	var $topTitle;
	var $popupbottom;
	var $popup;
	//默认配置
	var defaults = {
		title:"温馨提示",
		confirmTile:"确认",
		cancelTitle:"取消",
		callback:function(){},
	};
	function _show_popup(){
		$popup.show();
	}
	function _hide_popup(){
		$popup.hide();
	}
	//设置文字 
	function _initText(options){
		$topTitle.html(options.title);
		$cancleBtn.html(options.cancelTitle);
		$confirmBtn.html(options.confirmTile);
		$popupbottom.on('click', function(){
				_hide_popup();
		});
	}
	//绑定回调函数
	function _bindEvent(callback){
		$confirmBtn.unbind('click');
		$confirmBtn.on('click', function(e){
			callback.call(this,e);
		});
	}
	//绑定回调函数
	function _bindEvents(target, callback){
        $(target).unbind('click');
        $(target).on('click', function(e){
            callback.call(this,e);
        });
    }
	return {
		init : function(options){
			$popup = $('#kd_pop_up');
			$cancleBtn = $('#cancelBtn');
			$confirmBtn = $("#confirmBtn");
			$topTitle = $("#kd_pop_up_top");
			$popupbottom = $("#kd_pop_up_bottom");
			_initText(options);
			_bindEvent(options.callback);
			if(options.callback_cancle) {
			     _bindEvents($cancleBtn, options.callback_cancle);
			}
			return this;
		},
		show : function(){
			_show_popup();
		},
		hide : function(){
			_hide_popup();
		},
		bindEvent : function(callback){
			_bindEvent(callback);
			return this;
		},
		appendContent : function(content){
			$("#kd_pop_up_center").html(content);
		},
		setPopupBottomMT : function(mt){
			$("#kd_pop_up_bottom").css("margin-top", mt);
		}
	};
})();

/*直接弹出框组件js*/
var popup2 = (function(){
	var $cancelBtn;
	var $confirmBtn;
	var $topTitle;
	var $popupbottom;
	var $popup;
	//默认配置
	var defaults = {
		title:"温馨提示",
		confirmTile:"确认",
		cancelTitle:"取消",
		callback:function(){},
	    isClose:true
	};
	function _show_popup(){
		$popup.show();
	}
	function _hide_popup(){
		$popup.hide();
	}
	//设置文字 
	function _initText(options){
		$topTitle.html(options.title);
		$cancleBtn.html(options.cancelTitle);
		$confirmBtn.html(options.confirmTile);
		$popupbottom.on('click', function(){
			if(defaults.isClose){
				_hide_popup();
			}

		});
	}
	//绑定回调函数
	function _bindEvent(callback){
		$confirmBtn.unbind('click');
		$confirmBtn.on('click', function(){
			callback.call();
		});
	}
	
	//绑定确定回调函数
	function _bindEvent(callback,isCloseWindow){
		$confirmBtn.unbind('click');
		$confirmBtn.on('click', function(e){
			if(!isCloseWindow)
				e.stopPropagation();
			callback.call();
		});
	}
	
	return {
		init : function(options){
			$popup = $('#kd_pop_up2');
			$cancleBtn = $('#cancelBtn2');
			$confirmBtn = $("#confirmBtn2");
			$topTitle = $("#kd_pop_up_top2");
			$popupbottom = $("#kd_pop_up_bottom2");
			options = $.extend({},defaults,options);
			_initText(options);
			_bindEvent(options.callback);
			return this;
		},
		show : function(){
			_show_popup();
		},
		hide : function(){
			_hide_popup();
		},
		bindEvent : function(callback){
			_bindEvent(callback);
			return this;
		},
		bindEvent : function(callback,isCloseWindow){
			_bindEvent(callback,isCloseWindow);
			return this;
		},
		appendContent : function(content){
			$("#kd_pop_up_center2").html(content);
		},
		setPopupBottomMT : function(mt){
			$("#kd_pop_up_bottom2").css("margin-top", mt);
		}
	};
})();

/*直接弹出框组件js*/
var popup_infomation = (function(){
    var $closeBtn;
    var $topTitle;
    var $popupbottom;
    var $popup_info;
    //默认配置
    var defaults = {
        title:"温馨提示",
        closeTile:"关闭",
        callback:function(){},
    };
    function _show_popup(){
        $popup_info.show();
    }
    function _hide_popup(){
        $popup_info.hide();
    }
    //设置文字 
    function _initText(options){
        $topTitle.html(options.title);
        $closeBtn.html(options.closeTile);
        $popupbottom.on('click', function(){
            _hide_popup();
        });
    }
    
    return {
        init : function(options){
            $popup_info = $('#kd_pop_up_information');
            $closeBtn = $('#kd_pop_up_information_bottom_close');
            $topTitle = $("#kd_pop_up_information_top");
            $popupbottom = $("#kd_pop_up_information_bottom");
            _initText(options);
            return this;
        },
        show : function(){
            _show_popup();
        },
        hide : function(){
            _hide_popup();
        },
        appendContent : function(content){
            $("#kd_pop_up_information_center").html(content);
        },
        setPopupBottomMT : function(mt){
            $("#kd_pop_up_information_bottom").css("margin-top", mt);
        },
        setPopupContentHeight : function(h){
            $("#wrapper_information").css("height", h);
        },
        setPopupContentCss : function(style){
            $(".kd_pop_up_content").css(style);
        }
    };
})();


/**
 * iscroll下拉自动加载通用js
 */
var iscroll_loadding = (function() {

	var $myScroll;
	//默认配置
	var defaults = {
		loadding: "加载中...", //加载中显示的字体
		last: "已全部加载", //全部加载完成显示的字体
		failed: "加载失败，请稍后再试", //加载失败显示的字体
		showStatusId: $("#loadding_status"), //显示加载状态的document id
		ajaxurl: "",//异步加载的url地址
		callback: function(datas) {} //异步加载数据成功后的回调方法
	};

	var options = {};

	//显示当前状态
	function _setLoaddingStatus(status, options) {
		var $showStatusId = options.showStatusId;
		$showStatusId.prev().hide();
		switch(status) {
			case 'loadding':
				console.log("loadding...");
				$showStatusId.html(options.loadding);
				$showStatusId.prev().show();
				$showStatusId.parent().show();
				break;
			case 'loaded':
				console.log("loaded");
				$showStatusId.parent().hide();
				break;
			case 'last':
				console.log("last");
				$showStatusId.html(options.last).parent().show();
				break;
			case 'failed':
				console.log("failed");
				$showStatusId.html(options.failed).parent().show();
				break;
		}
	}

	//异步加载数据
	function _ajaxNextPage(options) {
		_setLoaddingStatus("loadding", options);
		$.ajax({
			url: options.ajaxurl,
			data: $("#queryPageForm").serialize(),
			dataType: "json",
			method: "post",
			success: function(resp) {
				_setLoaddingStatus("loaded", options);
				if(resp.resultCode == '0') {
					var datas = resp.datas;
					var $pageNo = $("#queryPageForm input[name='pageIndex']");
					var $pageSize = $("#queryPageForm input[name='pageSize']");
					$pageNo.val(parseInt($pageNo.val())+1);
					//如果没有下一页或者返回的数据为空，则显示已全部加载完成
					if(datas == null || datas.length == 0 || datas.length < $pageSize.val()) {
						_setLoaddingStatus("last", options);
						$("#queryPageForm").data("hasnaxtpage", 0);
					}
					options.callback(datas);
				} else {
					_setLoaddingStatus("failed", options);
				}
				if($myScroll) $myScroll.refresh();
			},
			error: function() {
				_setLoaddingStatus("failed", options);
				if($myScroll) $myScroll.refresh();
			}
		});
	}
	
	return {
		initScrollLoadding : function (use_options) {
			options = $.extend({},defaults,use_options);
			var intervalId = setInterval(function() {
				if(myScroll) {
					$myScroll = myScroll;
					$myScroll.off("scrollEnd");
					$myScroll.on("scrollEnd", function() {
						if(this.y - 15 < this.maxScrollY) {
							console.log("end");
							//获取是否还有下一页的判段
							var isHasNextPage = $("#queryPageForm").data("hasnaxtpage");
							//如果有下一页才进行异步加载
							if(isHasNextPage == '1') {
								_ajaxNextPage(options);
							}
						}
					});
					clearInterval(intervalId);
				}
			}, 100);
			return this;
		}
	};
})();
/**
 * 前端js共用工具方法
 */
'use strict'
var Util = function () {
	return {
		/****获取项目路径【类似jsp页面的basepath】****/
		getBasePath: function () {
			var location = (window.location + '').split('/');
			var basePath = location[0] + '//' + location[2] + '/' + location[3];
			return basePath;
		},
		/**
		 * 去掉所有的空格
		 * value 传入的值
		 */
		allTrim: function (value) {
			var notValid = /\s/;
			while (notValid.test(value)) {
				value = value.replace(notValid, "");
			}
			return value;
		},
		/**
		 * 判断空值
		 * defValue 传入的值
		 */
		checkNull: function (defValue) {
			if (defValue == null)
				return true;

			var val = Util.allTrim(defValue);//把所有空格去掉
			if (val.length == 0 || val == "")
				return true;

			return false;
		},
		/**
		 * 检验手机号码的合法性
		 * phoneNo 传入的手机号码
		 */
		verifyPhoneNum: function (phoneNo) {
			var tempNum = Util.allTrim(phoneNo);//去掉所有的空格
			if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(tempNum))) {
				return false;
			}
			return true;
		},
		/**
		 * 验证身份证是否合法
		 * num 传入的身份证号
		 */
		verifyIdCard: function (num) {
			num = num.toUpperCase();
			num = Util.allTrim(num);
			if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
				return false;
			}
			// 校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
			// 下面分别分析出生日期和校验位
			var len, re; len = num.length;
			if (len == 15) {
				re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
				var arrSplit = num.match(re);  // 检查生日日期是否正确
				var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
				var bGoodDay; bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
				if (!bGoodDay) {
					return false;
				} else { // 将15位身份证转成18位 //校验位按照ISO 7064:1983.MOD
					// 11-2的规定生成，X可以认为是数字10。
					var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
					var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
					var nTemp = 0, i;
					num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
					for (i = 0; i < 17; i++) {
						nTemp += num.substr(i, 1) * arrInt[i];
					}
					num += arrCh[nTemp % 11];
					return true;
				}
			}
			if (len == 18) {
				re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
				var arrSplit = num.match(re);  // 检查生日日期是否正确
				var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
				var bGoodDay; bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
				if (!bGoodDay) {
					return false;
				}
				else { // 检验18位身份证的校验码是否正确。 //校验位按照ISO 7064:1983.MOD
					// 11-2的规定生成，X可以认为是数字10。
					var valnum;
					var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
					var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
					var nTemp = 0, i;
					for (i = 0; i < 17; i++) {
						nTemp += num.substr(i, 1) * arrInt[i];
					}
					valnum = arrCh[nTemp % 11];
					if (valnum != num.substr(17, 1)) {
						return false;
					}
					return true;
				}
			}
			return false;
		},
		/**
		 * 获取当前日期【支持yyyy-mm-dd和yyyy-mm-dd hh:mm:ss两种格式】
		 * formart 传入的格式【yyyy-mm-dd和yyyy-mm-dd hh:mm:ss】
		 */
		getCurrentDate: function (format) {
			var date = new Date();
			var month = date.getMonth() + 1;
			var day = date.getDate();
			if (month < 10)
				month = "0" + month;
			if (day < 10)
				day = "0" + day;
			var dateString = "";
			if (format == "yyyy-mm-dd") {
				dateString = date.getFullYear() + "-" + month + "-" + day;
			} else if (format == "yyyy-mm-dd hh:mm:ss") {
				dateString = date.getFullYear() + "-" + month + "-" + day + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
			}
			return dateString;
		},

		/**
		 * 获取当前时间
		 */
		getCurrentTime: function () {
			var date = new Date();
			var month = date.getMonth() + 1;
			var day = date.getDate();
			if (month < 10)
				month = "0" + month;
			if (day < 10)
				day = "0" + day;
			var dateString = date.getFullYear() + "-" + month + "-" + day + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

			return dateString;
		},
		/**
		 * 比较日期大小
		 * startdate 开始日期
		 * enddate 结束日期
		 */
		compareDate: function (startdate, enddate) {
			var arr = startdate.split("-");
			var starttime = new Date(arr[0], arr[1], arr[2]);
			var starttimes = starttime.getTime();

			var arrs = enddate.split("-");
			var lktime = new Date(arrs[0], arrs[1], arrs[2]);
			var lktimes = lktime.getTime();

			if (starttimes > lktimes)
				return false;
			else
				return true;
		},
		/**
		 * 获取两个日期相差的天数
		 * startdate 开始日期
		 * enddate 结束日期
		 */
		diffDate: function (startdate, enddate) {
			var arr = startdate.split("-");
			var starttime = new Date(arr[0], arr[1] * 1 - 1, arr[2]);
			var starttimes = starttime.getTime();

			var arrs = enddate.split("-");
			var lktime = new Date(arrs[0], arrs[1] * 1 - 1, arrs[2]);
			var lktimes = lktime.getTime();

			var time = lktimes - starttimes;
			var diff = parseInt(time / (1000 * 60 * 60 * 24));

			return diff;
		},

		//格式化
		formatDate: function (d) {
			return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
		},

		//自动添加天数
		AddDate: function (key, NumDay, dtDate) {
			var dtTmp = new Date(dtDate);
			if (isNaN(dtTmp))
				dtTmp = new Date();
			switch (key) {
				case "s": return new Date(Date.parse(dtTmp) + (1000 * NumDay));
				case "n": return new Date(Date.parse(dtTmp) + (60000 * NumDay));
				case "h": return new Date(Date.parse(dtTmp) + (3600000 * NumDay));
				case "d": return new Date(Date.parse(dtTmp) + (86400000 * NumDay));
				case "w": return new Date(Date.parse(dtTmp) + ((86400000 * 7) * NumDay));
				case "m": return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + NumDay, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
				case "y": return new Date((dtTmp.getFullYear() + NumDay), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
			}
		},

		/**
		 * 获取两个日期相差的天数
		 * starttime 开始日期
		 * endtime 结束日期
		 */
		getDisSecond: function (starttime, endtime) {
			var datetime = starttime.split(" ");
			var date = datetime[0].split("-");
			var time = datetime[1].split(":");
			var starttime = new Date(date[0], date[1] * 1 - 1, date[2], time[0], time[1], time[2]);
			var starttimes = starttime.getTime();//毫秒

			datetime = endtime.split(" ");
			date = datetime[0].split("-");
			time = datetime[1].split(":");
			var lktime = new Date(date[0], date[1] * 1 - 1, date[2], time[0], time[1], time[2]);
			var lktimes = lktime.getTime();//毫秒

			var res = lktimes / 1000 - starttimes / 1000;
			return res;
		},
		/**
		 * 把秒封装为时分秒格式
		 * s 传入的秒数
		 */
		secondToHour: function (s) {
			var timeObj = new Object;
			timeObj.day = "";
			timeObj.hour = "00";
			timeObj.min = "00";
			timeObj.sec = "00";

			var t;
			if (s > -1) {
				var hour = Math.floor(s / 3600);
				var min = Math.floor(s / 60) % 60;
				var sec = s % 60;
				var day = parseInt(hour / 24);
				if (day > 0) {
					hour = hour - 24 * day;
					t = day + "天 " + hour + "时";

					timeObj.day = day;
					timeObj.hour = hour;
				}
				else {
					if (hour > 0) {
						if (hour < 10) { t += "0"; }
						t = hour + "时";
					}
					timeObj.hour = hour;
				}

				if (min < 10)
					min = "0" + min;
				if (sec < 10)
					sec = "0" + sec;

				timeObj.min = min;
				timeObj.sec = sec;
			}
			return timeObj;
		},

		//获取前n个月的当前日期
		getLastMonth: function (date, num) {
			var date = new Date(date);
			var daysInMonth = new Array([0], [31], [28], [31], [30], [31], [30], [31], [31], [30], [31], [30], [31]);
			var strYear = date.getFullYear();
			var strDay = date.getDate();
			var strMonth = date.getMonth() + 1;
			if (strYear % 4 == 0 && strYear % 100 != 0) {
				daysInMonth[2] = 29;
			}
			if (strMonth - num <= 0) {
				strYear -= 1;
				strMonth = 12 - num + strMonth;
			}
			else {
				strMonth -= num;
			}
			strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth];
			if (strMonth < 10) {
				strMonth = "0" + strMonth;
			}
			if (strDay < 10) {
				strDay = "0" + strDay;
			}
			return strYear + "-" + strMonth + "-" + strDay;
		},
		isIos: function () {
			var e = navigator.userAgent;
			return e.match(/(iPad).*OS\s([\d_]+)/) || e.match(/(iPod)(.*OS\s([\d_]+))?/) || e.match(/(iPhone\sOS)\s([\d_]+)/)
		}
	}
}();

(function () {
	Date.prototype.Format  =  function  (fmt)  { //author: meizz 
		var  o  =  {
			"M+":  this.getMonth()  +  1, //月份 
			"d+":  this.getDate(), //日 
			"h+":  this.getHours(), //小时 
			"m+":  this.getMinutes(), //分 
			"s+":  this.getSeconds(), //秒 
			"q+":  Math.floor((this.getMonth()  +  3)  /  3), //季度 
			"S":  this.getMilliseconds() //毫秒 
		};
		if  (/(y+)/.test(fmt))  fmt  =  fmt.replace(RegExp.$1,  (this.getFullYear()  +  "").substr(4  -  RegExp.$1.length));
		for  (var  k  in  o)
			if  (new  RegExp("("  +  k  +  ")").test(fmt))  fmt  =  fmt.replace(RegExp.$1,  (RegExp.$1.length  ==  1)  ?  (o[k])  :  (("00"  +  o[k]).substr((""  +  o[k]).length)));
		return  fmt;
	}
})();