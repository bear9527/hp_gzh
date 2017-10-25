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
 * actionsheet 通用js封装
 * @Author: strong
 * @Date: 2017-06-04 14:52:03
 * @Last Modified by: strong
 * @Last Modified time: 2017-06-08 16:26:12
 */
const ui_actionsheet = (function () {
  let $actionsheet,
    $actionsheetMask,
    $actionsheetTitle,
    $actionsheetMenu,
    $actionsheetCancle
  let defaults = {
    actionsheetRoot: '#kdui-actionsheet__warp',
    actionsheetTitle: '',
    setActionsheetMeunsType: 'default',// 设置actionsheet菜单的方式【default：json数组方式组装，html:直接用html覆盖】
    actionsheetMeuns: [{ menuTitle: '确定', menuClass: '', menuAction: function () { } }],
    actionsheetCancle: '取消',
    triggeredIsClose: "true",//btn触发后是否关闭dialog，默认true
  }
  function _showActionsheet() {
    ui.enableMovetouchDefault()
    $actionsheet.addClass('kdui-actionsheet_toggle')
    $actionsheetMask.fadeIn(200)
    $.smartScroll($('#kdui-actionsheet__warp'), '.kdui-actionsheet__menu')
    $('html').addClass('noscroll')
  }
  function _hideActionsheet() {
    $actionsheet.removeClass('kdui-actionsheet_toggle')
    $actionsheetMask.fadeOut(200)
    ui.unenableMovetouchDefault();
    $('html').removeClass('noscroll')
  }
  function _initActionsheet(options) {
    if (Util.checkNull(options.actionsheetTitle)) {
      $actionsheetTitle.hide();
    } else {
      $actionsheetTitle.html(options.actionsheetTitle)
    }
    if (options.setActionsheetMeunsType === 'html') {
      _setActionsheetMenu(options)
      $actionsheetMenu.unbind('click')
    } else {
      $actionsheetMenu.html((options.actionsheetMeuns).map((menu, index) => `
    <div class="kdui-actionsheet__cell ${menu.menuClass}" id="actionsheet${index}">${menu.menuTitle}</div>`).join(''))
      $actionsheetCancle.html(options.actionsheetCancle)
      $actionsheetMenu.on('click', () => {
      if (options.triggeredIsClose)
        _hideActionsheet()
    })
    }
    $('.kdui-actionsheet__action').on('click', () => {
      if (options.triggeredIsClose)
        _hideActionsheet()
    })

    $actionsheetMask.on('click', () => {
      _hideActionsheet()
    })
  }
  //绑定回调函数
  function _bindEvent(target, callback) {
    $(target).unbind('click')
    $(target).on('click', () => {
      callback.call(this);
    })
  }
  function _setActionsheetMenu(options) {
    $actionsheetMenu.html(options.actionsheetMeuns)
  }
  return {
    /**
     * 初始化整个actionsheet
     * @param {any} options
     * @returns
     */
    init(options) {
      options = Object.assign({}, defaults, options)
      $actionsheet = $(options.actionsheetRoot).find('.kdui-actionsheet')
      $actionsheetMask = $(options.actionsheetRoot).find('.kdui-mask')
      $actionsheetTitle = $actionsheet.find('.kdui-actionsheet__title')
      $actionsheetMenu = $actionsheet.find('.kdui-actionsheet__menu')
      $actionsheetCancle = $actionsheet.find('.kdui-actionsheet__action').find('div')
      _initActionsheet(options);
      if (options.setActionsheetMeunsType !== 'html') {
        for (let [index, menu] of (options.actionsheetMeuns).entries()) {
          _bindEvent($(`#actionsheet${index}`), menu.menuAction)
        }
      }
      return this;
    },
    /**
     * 显示dialog
     */
    show() {
      _showActionsheet();
    },
    /**
     * 隐藏dialog
     */
    hide() {
      _hideActionsheet();
    }
  }
})()

/*
 * 级联选择器，常用于省市区选择
 * @Author: strong
 * @Date: 2017-06-09 15:34:20
 * @Last Modified by: strong
 * @Last Modified time: 2017-07-24 11:49:32
 */
const ui_cascade = (function () {
  let $cascade,
    $cascadeMask,
    $cascadeTitle,
    $cascadeContent,
    $cascadeTab,
    //cascadeScroll,
    _options;

  // 默认配置
  const defaults = {
    cascadeRoot: '#kdui-cascade__warp',
    cascadeTitle: '所在地区',
    level: 3, // 级别，默认三级
    initData: null, // 初始化话数据
    levelAjaxUrl: ['geoService!ajaxGetAllProvinces.do', 'geoService!ajaxGetProvince.do?provinceGeoId=', ''],//>1级传入的参数名（从第二级开始参入的参数名，不传的话从前一级的childs中获取）
    onSelectOver() { // 选完后的回调
    }
  }
  // 初始化cascade
  function _initCascade() {
    $cascadeTitle.html(_options.cascadeTitle)
    $cascadeContent.html('')
    $cascadeTab.html('')
    $cascadeMask.on('click', () => {
      _hide()
    })
  }
  // 显示cascade
  function _show(titleIndex) {
    ui.enableMovetouchDefault();
    ui.hideLoading()
    $cascade.addClass('kdui-cascade_toggle')
    $cascadeMask.fadeIn(200)
    $.smartScroll($('#kdui-cascade__warp'), '.kdui-cascade__content')
    $('html').addClass('noscroll')

    // 初始化数据
    let initData = JSON.parse(_options.initData)
    if (_options.initData/* && initData.length === _options.level*/) {
      let firstData = initData[titleIndex];
      $cascadeContent.find("div[name='" + firstData.name + "']").click();
    }
    /*if (cascadeScroll) {
      cascadeScroll.refresh()
    } else {
      ui.transitionEventEnd($cascade, () => {
        cascadeScroll = new IScroll('#kdui_wrapper__cascade', { hScrollbar: false, vScrollbar: true });
      })
    }*/
  }
  // 隐藏cascade
  function _hide() {
    ui.unenableMovetouchDefault();
    $cascade.removeClass('kdui-cascade_toggle')
    $cascadeMask.fadeOut(200)
    $('html').removeClass('noscroll')
  }
  // 组装获取的list数据
  function _buildListData(titleIndex, datas, titleEl) {
    // title
    $cascadeTab.find('li.kdui-tab__item').removeClass('kdui-tab__item_current')
    if (titleEl) {
      try{
        datas = JSON.parse(datas)
      } catch(e){
      }
      titleEl.addClass('kdui-tab__item_current')
    } else {
      if (titleIndex >= 1) {
        let onClickTitle = $cascadeTab.find(`li[data-title-index='${titleIndex - 1}']`)
        if (onClickTitle && onClickTitle.length > 0) {
          onClickTitle.nextAll().remove()
        }
      }
      $cascadeTab.append(`<li onclick='ui_cascade.onTitleClick(this)' data-title-index=${titleIndex} class="kdui-tab__item kdui-tab__item_current">请选择</li>`);
      $cascadeTab.find('li[data-title-index="' + titleIndex + '"]').data('childs', JSON.stringify(datas))
    }
    // item
    $cascadeContent.html(datas.map((data, index) =>
      `<div onclick='ui_cascade.onItemClick(this)' data-title-index=${titleIndex} name=${data.name} data-info=${JSON.stringify(data)} class="kdui-cascade__cell">${data.name}</div>`).join(''))
    if (titleEl) {
      var el = $cascadeContent.find("div[name='" + titleEl.html() + "']")
      el.parent().find("div").removeClass('kdui-text_blue')
      el.addClass('kdui-text_blue')
      /*if (cascadeScroll) {
        cascadeScroll.refresh()
      }*/
    } else {
      _show(titleIndex)
    }
  }

  // 异步获取数据的
  function _ajaxGetDatas(titleIndex, info = {}) {
    let ajaxUrl = (_options.levelAjaxUrl)[titleIndex]
    if (Util.checkNull(ajaxUrl)) {
      _buildListData(titleIndex, info.childs);
    } else {
      $.ajax({
        url: ajaxUrl + (Util.checkNull(info.id) ? '' : info.id),
        dataType: "json",
        success: function (resp) {
          if (null == resp) {
            console.log("加载cascade数据失败")
            ui.hideLoading()
            ui.showTip("加载数据失败,请稍后再试")
            return;
          }
          _buildListData(titleIndex, resp.childs ? resp.childs : resp);
        },
        error: function () {
          console.log("加载cascade数据失败")
          ui.hideLoading()
          ui.showTip("加载数据失败,请稍后再试")
        }
      });
    }
  }
  // item选中
  function _selectItemLi(el) {
    el.parent().find("div").removeClass('kdui-text_blue')
    el.addClass('kdui-text_blue')
    let titleIndex = el.data('titleIndex')
    $cascadeTab.find('li[data-title-index="' + titleIndex + '"]').data('info', JSON.stringify(el.data('info')))
    $cascadeTab.find('li[data-title-index="' + titleIndex + '"]').html(el.data('info').name)
    // 判断当前是否到了最后一级【或者当第三级数据为空的时候也自动结束，针对地址控件的情况】
    if (titleIndex + 1 === _options.level || (titleIndex + 1 === 2 && _options.level === 3 && (_options.levelAjaxUrl)[2] === "" && !el.data('info').childs)) {
      // 如果当前level为2、配置的总level为3，则需要把第三级移除
      if(titleIndex + 1 === 2) {
        $cascadeTab.find('li[data-title-index="' + (titleIndex + 1) + '"]').remove()
      }
      _onSelectOver()
    } else {
      ui.showLoading('数据加载中...')
      _ajaxGetDatas(titleIndex + 1, el.data('info'))
    }
  };

  // 点击title
  function _onTitleClick(obj) {
    if ($(obj).hasClass("kdui-tab__item_current")) return;
    let childs = $(obj).data("childs");
    _buildListData($(obj).data("titleIndex"), childs, $(obj));
  }

  // 点击item
  function _onItemClick(obj) {
    _selectItemLi($(obj))
  }

  // 选中完毕
  function _onSelectOver() {
    // 初始化数据的时候不隐藏
    if (_options.initData != null && _options.initData.length > 0) {
      _options.initData = null;
      return;
    }
    let data = [];
    $cascadeTab.find("li").each(function (index) {
      let d = $(this).data('info');
      try{
        d = JSON.parse(d)
      } catch(e){
      }
      data.push({ "id": d.id, "name": d.name });
    });
    if (_options.onSelectOver && $.isFunction(_options.onSelectOver)) {
      _options.onSelectOver(data);
    }
    setTimeout(() => {
      _hide()
    }, 300)
  }

  return {
    /**
     * 初始化整个cascade
     * @param {any} options 
     * @returns 
     */
    init(options) {
      _options = Object.assign({}, defaults, options)
      $cascade = $(_options.cascadeRoot).find('.kdui-cascade')
      $cascadeMask = $(_options.cascadeRoot).find('.kdui-mask')
      $cascadeTitle = $cascade.find('.kdui-cascade__title')
      $cascadeTab = $cascade.find('.kdui-cascade__tab')
      $cascadeContent = $cascade.find('.kdui-cascade__content')
      _initCascade()
      return this
    },
    /**
     * 项目点击后
     * @param {any} evt 
     */
    onItemClick(obj) {
      _onItemClick(obj)
    },
    /**
     * tab title点击后
     * @param {any} obj 
     */
    onTitleClick(obj) {
      _onTitleClick(obj)
    },
    /**
     * 显示cascade
     */
    show() {
      ui.showLoading('数据加载中...')
      _ajaxGetDatas(0)
    },
    /**
     * 隐藏cascade
     */
    hide() {
      _hide();
    }
  }
})();

/**
 * 由于涉及地方比较多，暂时不放在ui对象里面
 * @param targetid
 */
function toggle(targetid) {
  if (document.getElementById) {
    var target = document.getElementById(targetid);
    if (target.style.display == "block") {
      target.style.display = "none";
    } else {
      target.style.display = "block";
    }
  }
}

/*大部分通用组件js*/
var ui = function () {
  function _handler() {
    event.preventDefault();
  }
  function _checkSupportPassive() {
    var supportsPassive = false;
    try {
      var opts = Object.defineProperty({}, 'passive', {
        get: function () {
          supportsPassive = true;
        }
      });
      window.addEventListener("test", null, opts);
    } catch (e) { }
    return supportsPassive;
  }
  // 判断动画浏览器类型
  function _whichTransitionEvent() {
    let t;
    let el = document.createElement('fakeelement');
    let transitions = {
      'transition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd',
      'animationstart': 'animationend',
      'webkitAnimationStart': 'webkitAnimationEnd',
      'MSAnimationStart': 'MSAnimationEnd',
    }
    for (t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }
  }
  return {
		/**
     * 显示提示
     * @param {any} content
     * @param {number} [timeout=2000]
     */
    showTip(content, timeout = 2000) {
      const $toast = $('#toast');
      $('.kdui-toast__content').html(content)
      if (!$toast.hasClass('kdui-hide'))
        return
      $toast.removeClass('kdui-hide');
      $(".kdui-mask_transparent").on('click', () => {
        clearTimeout(timer);
        ui.hideTip();
      })
      let timer = setTimeout(function () {
        ui.hideTip();
      }, timeout);
    },
    /**
     * 隐藏提示
     */
    hideTip() {
      $(".kdui-mask_transparent").off('click');
      const $toast = $('#toast');
      $toast.addClass('kdui-hide');
    },
    /**
     * 显示loading
     * @param {string} [content='数据加载中...']
     */
    showLoading(content = '数据加载中...') {
      const $loadingToast = $('#loadingToast');
      $('.kdui-toast__content').html(content);
      if (!$loadingToast.hasClass('kdui-hide'))
        return
      $loadingToast.removeClass('kdui-hide');;
    },
    /**
     * 隐藏loading
     */
    hideLoading() {
      const $loadingToast = $('#loadingToast');
      $loadingToast.addClass('kdui-hide');
    },
    /**
       * 设置tab状态
       */
    setTabStatus: function (current) {
      $('.kdui-tab__item').each(function () {
        var $this = $(this);
        if (current == $this.data("current")) {
          $this.addClass('kdui-tab__item_current');
        }
      });
    },
		/**
		 * tab切换 传入回调函数
		 */
    tabSelect: function (callback) {
      $('.kdui-tab__item').click(function () {
        if ($(this).hasClass('kdui-tab__item_current')) {
          return;
        };
        $('.kdui-tab__item').removeClass('kdui-tab__item_current');
        $(this).addClass('kdui-tab__item_current');
        callback.call(this);
      });
    },
    /**
     * 阻止movetouch默认事件
     */
    unenableMovetouchDefault(target = document) {
      target.addEventListener('touchmove', _handler, _checkSupportPassive() ? { passive: false } : false);
    },
    /**
     * 启用movetouch默认事件
     */
    enableMovetouchDefault(target = document) {
      target.removeEventListener('touchmove', _handler, _checkSupportPassive() ? { passive: false } : false);
    },
    /**
     * 检测css动画结束
     * @param {any} target 目标元素
     * @param {any} callback 结束后回调
     */
    transitionEventEnd(target, callback) {
      var transitionEvent = _whichTransitionEvent();
      $(target)[0].addEventListener(transitionEvent, () => {
        callback.call(this)
      }
      )
    },
    /**
     * 取消高清解决方案
     */
    cancleHdSetting(){
      let metaEl = document.querySelector('meta[name="viewport"]')
      document.documentElement.style.fontSize = "50px"
      metaEl.setAttribute('content', `width=device-width,user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1`);
    },
    /**
     * 设置高清解决方案
     */
    settingHd(){
      flex(100, 1)
    },
    /**
     * 点击切换缩略方式
     */
    changeWrap(obj,class1,class2){
      $(obj).toggleClass(`${class1} ${class2}`)
      if(typeof(myScroll)!="undefined"){
        myScroll.refresh()
      }
    },
    /**
     * 处理数字输入的内容
     * @param {any} obj
     */
    clearNoNum(obj) {
      obj.value = obj.value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
      obj.value = obj.value.replace(/^\./g, ""); //验证第一个字符是数字而不是.
      obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的.
      obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
        if(obj.value.indexOf(".")< 0 && obj.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            obj.value= parseFloat(obj.value);
        }
    }

  };
}();

/*
 * dialog通用封装
 * @Author: strong
 * @Date: 2017-06-03 23:25:16
 * @Last Modified by: strong
 * @Last Modified time: 2017-07-05 10:03:15
 */
const ui_dialog = (function () {
  let $defaultBtn,
    $primaryBtn,
    $dialogTitle,
    $dialogBody,
    $dialog;
  let defaults = {
    dialogRoot: '.js_kdui-dialog',
    dialogBodyContent: '',
    dialogTitle: "温馨提示",
    defaultBtnTile: "取消",
    primaryBtnTitle: "确定",
    triggeredIsClose: true,//btn触发后是否关闭dialog，默认true
    defaultBtnCb() { },
    primaryBtnCb() { }
  }
  function _showDialog() {
    $dialog.fadeIn(200,() =>{
      ui.enableMovetouchDefault()
      $.smartScroll($dialog, '.kdui-dialog__bd')
      $('html').addClass('noscroll')
    })
  }
  function _hideDialog() {
    ui.unenableMovetouchDefault()
    $('html').removeClass('noscroll')
    $dialog.fadeOut(200)
  }
  //设置文字
  function _initText(options) {
    $('.kdui-dialog__ft').off('click')
    // 如果标题为空，则去掉顶部
    if(Util.checkNull(options.dialogTitle)) {
      $dialogTitle.parent().addClass('kdui-hide')
    } else {
      $dialogTitle.html(options.dialogTitle)
    }
    if(Util.checkNull(options.defaultBtnTile) && Util.checkNull(options.primaryBtnTitle)) { // 两个按钮都没有的情况
      $defaultBtn.parent().addClass('kdui-hide')
      $dialogBody.css('max-height','7.8rem')
      $dialog.on('click',() =>{
        _hideDialog();
      })
    } else if (Util.checkNull(options.defaultBtnTile)) {
      $defaultBtn.addClass('kdui-hide')
      $primaryBtn.css('width','100%')
    } else {
      if ($defaultBtn.hasClass('kdui-hide')){
        $defaultBtn.removeClass('kdui-hide')
        $primaryBtn.css('width','50%')
      }
      $defaultBtn.html(options.defaultBtnTile)
    }
    $primaryBtn.html(options.primaryBtnTitle)
    $dialogBody.html(options.dialogBodyContent)
    $('.kdui-dialog__ft').on('click', () => {
      if (options.triggeredIsClose)
        _hideDialog()
    })
  }
  //绑定回调函数
  function _bindEvent(target, callback) {
    $(target).off('click')
    $(target).on('click', () => {
      callback.call(this);
    })
  }
  return {
    /**
     * 初始化整个dialog
     * @param {any} options
     * @returns
     */
    init(options) {
      options = Object.assign({}, defaults, options)
      $dialog = $(options.dialogRoot)
      $defaultBtn = $dialog.find('.kdui-dialog__btn_default')
      $primaryBtn = $dialog.find('.kdui-dialog__btn_primary')
      $dialogTitle = $dialog.find('.kdui-dialog__title')
      $dialogBody = $dialog.find('.kdui-dialog__bd')
      $dialogTitle.parent().removeClass('kdui-hide')
      $defaultBtn.parent().removeClass('kdui-hide')
      $dialogBody.css('max-height','6rem')
      $dialog.off('click')
      _initText(options)
      _bindEvent($defaultBtn, options.defaultBtnCb)
      _bindEvent($primaryBtn, options.primaryBtnCb)
      return this;
    },
    /**
     * 显示dialog
     */
    show() {
      _showDialog();
    },
    /**
     * 隐藏dialog
     */
    hide() {
      _hideDialog();
    },
  }
})();

/*
 * 处理弹出框div滑动，body也跟着滑动的问题
 * @Author: strong
 * @Date: 2017-06-04 22:40:20
 * @Last Modified by: strong
 * @Last Modified time: 2017-06-05 09:42:20
 */
$.smartScroll = function (container, selectorScrollable) {
  // 如果没有滚动容器选择器，或者已经绑定了滚动时间，忽略
  if (!selectorScrollable || container.data('isBindScroll')) {
    return;
  }

  // 是否是搓浏览器
  // 自己在这里添加判断和筛选
  var isSBBrowser;

  var data = {
    posY: 0,
    maxscroll: 0
  };

  // 事件处理
  container.on({
    touchstart: function (event) {
      var events = event.touches[0] || event;

      // 先求得是不是滚动元素或者滚动元素的子元素
      var elTarget = $(event.target);

      if (!elTarget.length) {
        return;
      }

      var elScroll;

      // 获取标记的滚动元素，自身或子元素皆可
      if (elTarget.is(selectorScrollable)) {
        elScroll = elTarget;
      } else if ((elScroll = elTarget.parents(selectorScrollable)).length == 0) {
        elScroll = null;
      }

      if (!elScroll) {
        return;
      }

      // 当前滚动元素标记
      data.elScroll = elScroll;

      // 垂直位置标记
      data.posY = events.pageY;
      data.scrollY = elScroll.scrollTop();
      // 是否可以滚动
      data.maxscroll = elScroll[0].scrollHeight - elScroll[0].clientHeight;
    },
    touchmove: function () {
      // 如果不足于滚动，则禁止触发整个窗体元素的滚动
      if (data.maxscroll <= 0 || isSBBrowser) {
        // 禁止滚动
        event.preventDefault();
      }
      // 滚动元素
      var elScroll = data.elScroll;
      // 当前的滚动高度
      var scrollTop = elScroll.scrollTop();

      // 现在移动的垂直位置，用来判断是往上移动还是往下
      var events = event.touches[0] || event;
      // 移动距离
      var distanceY = events.pageY - data.posY;

      if (isSBBrowser) {
        elScroll.scrollTop(data.scrollY - distanceY);
        elScroll.trigger('scroll');
        return;
      }

      // 上下边缘检测
      if (distanceY > 0 && scrollTop == 0) {
        // 往上滑，并且到头
        // 禁止滚动的默认行为
        event.preventDefault();
        return;
      }

      // 下边缘检测
      if (distanceY < 0 && (scrollTop + 1 >= data.maxscroll)) {
        // 往下滑，并且到头
        // 禁止滚动的默认行为
        event.preventDefault();
        return;
      }
    },
    touchend: function () {
      data.maxscroll = 0;
    }
  });

  // 防止多次重复绑定
  container.data('isBindScroll', true);
};

/**
 * iscroll下拉自动加载通用js
 */
var iscroll_loadding = (function () {

	var $myScroll;
	//默认配置
	var defaults = {
		loadding: "加载中...", //加载中显示的字体
		last: "已全部加载", //全部加载完成显示的字体
		failed: "加载失败，请稍后再试", //加载失败显示的字体
		showStatusId: $("#loadding_status"), //显示加载状态的document id
		ajaxurl: "",//异步加载的url地址
    isRewriteAjaxSucess: false, // 是否重写ajax异步成功后的回调，重写的话需要配置ajaxSucess
    isNeedFirstLoad: false, //是否需要初始化时加载一次
		callback: function (datas) { }, //异步加载数据成功后的回调方法【指resultCode返回0的情况】
		ajaxSucess: function (resp) { } //ajax请求成功
	};

	var options = {};

	//显示当前状态
	function _setLoaddingStatus(status, options) {
		var $showStatusId = options.showStatusId;
		$showStatusId.prev().addClass('kdui-hide');
		switch (status) {
			case 'loaded':
				console.log("loaded");
				sessionStorage.setItem('isLoad', true)
				sessionStorage.setItem('loadStauts', "loaded")
				$showStatusId.parent().addClass('kdui-hide');
				break;
			case 'last':
				console.log("last");
				sessionStorage.setItem('isLoad', false)
				sessionStorage.setItem('loadStauts', "last")
				$showStatusId.html(options.last).parent().removeClass('kdui-hide');
				break;
			case 'failed':
				console.log("failed");
				sessionStorage.setItem('isLoad', true)
				sessionStorage.setItem('loadStauts', "failed")
				$showStatusId.html(options.failed).parent().show();
        break;
      default:
        sessionStorage.setItem('isLoad', false)
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
			success: function (resp) {
				if (options.isRewriteAjaxSucess && options.ajaxSucess && $.isFunction(options.ajaxSucess)) {
					options.ajaxSucess.call(null, resp)
				} else {
					_setLoaddingStatus("loaded", options);
					if (resp.resultCode == '0') {
						var datas = resp.datas;
						var $pageNo = $("#queryPageForm input[name='pageIndex']");
						var $pageSize = $("#queryPageForm input[name='pageSize']");
						$pageNo.val(parseInt($pageNo.val()) + 1);
						//如果没有下一页或者返回的数据为空，则显示已全部加载完成
						if (datas == null || datas.length == 0 || datas.length < $pageSize.val()) {
							_setLoaddingStatus("last", options);
							$("#queryPageForm").data("hasnaxtpage", 0);
						}
						options.callback(datas);
					} else {
						_setLoaddingStatus("failed", options);
					}
				}
			},
			error: function () {
				_setLoaddingStatus("failed", options);
			}
		});
	}

	return {
		initScrollLoadding (use_options) {
			const initialScale = localStorage.getItem('initial-scale')
			sessionStorage.setItem('isLoad', true) // 判断是否可以异步获取数据
			sessionStorage.setItem('loadStauts', "loadding")
			options = $.extend({}, defaults, use_options);
			var intervalId = setInterval(function () {
				if (myScroll) {
					$myScroll = myScroll;
					$myScroll.off("scrollEnd");
					$myScroll.on("scrollEnd", function () {
						if (this.y - 15 < this.maxScrollY) {
							console.log("end");
							//获取是否还有下一页的判段
							var isHasNextPage = $("#queryPageForm").data("hasnaxtpage");
							//如果有下一页才进行异步加载【并且数据加载没有结束，loaded和failed代表没有结束】
							if (isHasNextPage == '1' && sessionStorage.getItem('isLoad') === 'true') {
								console.log("loadding...");
								var $showStatusId = options.showStatusId;
								$showStatusId.html(options.loadding);
								$showStatusId.prev().removeClass('kdui-hide');
								$showStatusId.parent().removeClass('kdui-hide');
								if(sessionStorage.getItem("loadStauts") !== 'failed') {
									$myScroll.refresh();
									$myScroll.scrollBy(0, -30 / initialScale)
								}
								_ajaxNextPage(options);
							}
						}
					});
					clearInterval(intervalId);
				}
      }, 100);
      // 第一次进入先加载一次数据
      if(options.isNeedFirstLoad) {
        _ajaxNextPage(options);
      }
			return this;
		}
	};
})();

/*
 * 图片预览加载显示
 * @Author: strong 
 * @Date: 2017-05-12 14:35:36 
 * @Last Modified by: strong
 * @Last Modified time: 2017-07-03 02:31:56
 */

const photo_swipe = (function () {
  let _defaults = {
    resouceBaseSrc: "", // 加载资源文件的基础路径，默认为当前工程的路径
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
      ui_actionsheet.init({
        actionsheetTitle: '是否删除该张图片？',
        actionsheetMeuns: [{
          menuTitle: '确定删除', menuClass: '', menuAction: function () {
            ui.showTip('删除成功', 1000)
            const currentIndex = _photo_swipe_inst.getCurrentIndex()
            const itemNums = _photo_swipe_inst.options.getNumItemsFn()
            if (currentIndex + 1 === itemNums) {
              _photo_swipe_inst.prev()
            }
            _photo_swipe_inst.items.splice(currentIndex, 1)
            _photo_swipe_inst.invalidateCurrItems();
            _photo_swipe_inst.updateSize(true);

            // 最后一张的话关闭预览界面
            if (itemNums === 1) {
              _photo_swipe_inst.close();
            }
            _defaults.onDelete.call(this, currentIndex)
          }
        }]
      })
      ui_actionsheet.show()
    })
  }

  // 加载require.js后的回调
  function _loadRequireCb(picIndex) {
    if (typeof PhotoSwipe !== 'undefined' && typeof PhotoSwipeUI_Default !== 'undefined') {
      _loadPhotoSwipeCb(picIndex, PhotoSwipe, PhotoSwipeUI_Default)
    } else {
      require.config({
        baseUrl: `${Util.checkNull(_defaults.resouceBaseSrc) ? Util.getBasePath() : _defaults.resouceBaseSrc}/js/photoswipe`,
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
    ui.hideLoading();
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

    _photo_swipe_inst.listen('close', function() {
      //ui.settingHd()
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
        $(".pswp__bottom-bar").removeClass("kdui-hide")
      }
      _bindEvent()
      return this;
    },
    openPhotoSwipe(picIndex = 0) {
      //ui.cancleHdSetting(); // 取消高清解决方案
      ui.showLoading();
      if (typeof require !== 'undefined') {
        _loadRequireCb(picIndex)
      } else {
        $.getScript(`${Util.checkNull(_defaults.resouceBaseSrc) ? Util.getBasePath() : _defaults.resouceBaseSrc}/js/require/require.js`, function () {
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
 * @Last Modified time: 2017-07-18 10:53:14
 */
const photo_upload = (function () {
  // 实际使用的配置
  let _options = {}
  // 默认配置
  const _defaults = {
    jqAlias: $,
    resouceBaseSrc: "", // 加载资源文件的基础路径，默认为当前工程的路径
    imageWarp: "#kdui-uploader__warp", // 存放上传的图片的容器
    fileInputWarp: "#uploadInputWarp", // input最上层的div
    fileInput: "#uploadInput", // 点击触发图片选择的input
    fileInputWidthMode: "noraml", // 上传框的大小，默认noraml(75*75), small(50*50)
    uploaderUrl: "",// 上传图片服务器路径
    deleteUrl: "",// 删除图片服务器路径
    limitSize: 5,//图片大小限制 5M【-1表示不限】
    limitNum: 5,//图片数量限制【-1表示不限】
    isCompress: true, //是否需要压缩
    compressRatio: 0.7, //压缩比例
    beforeComplete(src, index) {
      _defaultBeforeComplete.call(null, src, index)
    }, //上传前处理
    beforeDefaultComplete(index) { // 使用默认上传前处理完成后的回调
    },
    afterComplete(index, picUrl, thumbPicUl = "") {
      _defaultAfterComplete.call(null, index, picUrl, thumbPicUl)
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
    const _currentImg = _options.jqAlias(_options.imageWarp).find('div')[index]
    const picurl = _options.jqAlias(_currentImg).data('picurl')
    _currentImg.remove()
    if (_options.jqAlias(_options.imageWarp).find('div').length < _options.limitNum || _options.limitNum !== -1) {
      _options.jqAlias(_options.fileInputWarp).show()
    }
    _options.jqAlias.ajax({
      type: "post",
      url: _options.deleteUrl,
      data: { imgUrl: picurl },
      dataType: "json",
      success: function (data) {
        if (data.resultCode == 0) {
          console.info(`删除成功picurl:${picurl}`)
          _options.jqAlias(_options.fileInput).val(""); // 清空inputvalue方便下次上传
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
      _options.jqAlias(`div#${index}`).remove()
    }, 1000)
  }

  // 上传后的处理
  function _defaultAfterComplete(index, picUrl) {
    _options.jqAlias(`div#${index}`).data('newupload', '1')
    _options.jqAlias(`div#${index}`).data('picurl', picUrl)
    _options.jqAlias(`div#${index}`).removeClass('kdui-uploader__file_status')
    _options.jqAlias(`div#${index} div.kdui-loading-wrap`).remove()
    _options.jqAlias(`div#${index}`).on('click', function () {
      let photos = []
      _options.jqAlias(_options.imageWarp).find('div').each(function () {
        //注意需要兼容ios和android，ios下面[url()],android下面[url("")]
        let picurl = _options.jqAlias(this).data('newupload') === '1' ? _options.jqAlias(this).css('backgroundImage').replace('url("', '').replace('")', '').replace('url(', '').replace(')', '') : _options.jqAlias(this).data('picurl')
        let obj = { src: picurl }
        // 获取当前页面缩放的比例，图片应该乘以这个比例，因为打开预览的时候需要处理
        //let initScale = localStorage.getItem("initial-scale")
        Object.assign(obj, { w: _options.jqAlias(this).data("imagew"), h: _options.jqAlias(this).data("imageh") })
        photos.push(obj)
      });
      const options = {
        resouceBaseSrc: _options.resouceBaseSrc,
        deleteEl: true,
        onDelete(index) {//这个index是列表数据的序号【0,1,2,3，...】
          _options.afterDeleteComplete.call(null, index)
        }
      }
      let photoWiseInstance = photo_swipe.init(photos, options)
      // 初始化话图片预览控件
      photoWiseInstance.openPhotoSwipe(_options.jqAlias(_options.imageWarp).find('div').index(this));
    })
    _options.afterDefaultComplete.call(null, index)
  }

  // 上传前的处理【默认处理，当没有自定义事件的时候】
  function _defaultBeforeComplete(src, index) {
    var image = new Image();
    image.onload = function () {
      _options.jqAlias(_options.imageWarp).append(`
        <div data-imageh="${image.height}" data-imagew="${image.width}" id=${index} class="kdui-uploader__file kdui-uploader__file_status ${_options.fileInputWidthMode === 'small' ? 'kdui-uploader_small' : ''}" style="background-image:url(${src})">
                  <div class="kdui-uploader__file-content kdui-loading-wrap">
            <i class='kdui-loading'></i>
          </div>
              </div>
      `)
      // 判断当前是否是否已经上传了规定张数的图片
      try {
        if (_options.jqAlias(_options.imageWarp).find('li').length >= _options.limitNum && _options.limitNum !== -1) {
          _options.jqAlias(_options.fileInputWarp).hide()
        }
      } catch (e) {
        console.log(e)
      }

      if (typeof myScroll !== "undefined") {
        myScroll.refresh()
      }
      _options.beforeDefaultComplete.call(null, index)
    }
    image.src = src;
  }

  // 图片上传
  function _upload(fileObject) {
    let _selfThis = this
    ui.showLoading()
    // 动态加载require.js
    if (typeof require !== 'undefined') {
      _requireCb.call(_selfThis, fileObject)
    } else {
      _options.jqAlias.getScript(`${Util.checkNull(_options.resouceBaseSrc) ? Util.getBasePath() : _options.resouceBaseSrc}/js/require/require.js`, function () {
        _requireCb.call(_selfThis, fileObject)
      })
    }
  }

  // require js加载完毕后的回调函数
  function _requireCb(fileObject) {
    let _selfThis = this
    if (typeof lrz !== 'undefined') {
      _loadLrzCb.call(_selfThis, fileObject)
    } else {
      require.config({
        baseUrl: `${Util.checkNull(_options.resouceBaseSrc) ? Util.getBasePath() : _options.resouceBaseSrc}/js/lrz`,
        paths: {
          "lrz": "lrz.min"
        }
      });
      require(['lrz'], function (lrz) {
        _loadLrzCb.call(_selfThis, fileObject)
      })
    }
  }

  // 加载lrz.js后的回调
  function _loadLrzCb(fileObject) {
    let _selfThis = this
    let lrzOptions = {}
    let compressRatio = _options.isCompress ? _options.compressRatio : 1
    Object.assign(lrzOptions, { quality: compressRatio, width: 1024 })
    if (fileObject.files.length === 0) {
      ui.hideLoading()
      return
    }
    lrz(fileObject.files[0], lrzOptions)
      .then(function (rst) { // 上传前的处理
        ui.hideLoading()
        // 判断上传的图片是否超出限制的大小
        if (rst.origin.size / 1024 / 1024 > _options.limitSize && _options.limitSize !== -1) {
          ui.showTip(`上传的图片不能超过_options.jqAlias{_options.limitSize}M`, 2000)
          return
        }
        const index = Math.random().toString().split('.')[1] // 生成随机数，来定位上传的文件的位置
        _options.beforeComplete.call(_selfThis, rst.base64, index)
        Object.assign(rst, { index, index })
        return rst
      })
      .then(function (rst) { // 开始异步上传数据
        _options.jqAlias.ajax({
          type: "post",
          url: _options.uploaderUrl,
          data: { photo: rst.base64 },
          dataType: "json",
          cache: !1,
          success: function (data) {
            if (data.resultCode == 0) {
              let picUrl = '',
                thumbPicUl = ''
              if (data.data) {
                picUrl = data.data.filePath;
                thumbPicUl = data.data.thumbPic;
                if(data.data.srcPic && !Util.checkNull(data.data.srcPic))
                  picUrl = data.data.srcPic;
              }
              _options.afterComplete.call(_selfThis, rst.index, picUrl, thumbPicUl);
            } else {
              _options.uploadError.call(_selfThis, rst.index);
            }
          },
          error: function () {
            _options.uploadError.call(_selfThis, rst.index);
          }
        })
      })
      .catch(function (err) { // 捕捉错误日志
        ui.hideLoading()
        ui.showTip('系统异常，请稍后再试', 2000)
      })
      .always(function () { // 什么情况都会进来的
        //ui.hideLoading()
      });
  }

  return {
    init(options = {}) {
      _options = Object.assign(_defaults, options)
      if (_options.fileInputWidthMode === 'small') {
        _options.jqAlias(_options.fileInputWarp).addClass('kdui-uploader_small')
      }
      _options.jqAlias(_options.fileInput).each(function () {
        $(this).on('change', function (event) {
          _upload.call(event.target, this)
        })
      })
    },
    // 默认在界面上组装图片【传入序号缩略图和原图】
    defaultBuildImgsData(index, thumbPhoto, photo) {
      return `
        <div id=${index} data-picurl=${photo} class="ml0 kdui-uploader__file ${_options.fileInputWidthMode === 'small' ? 'kdui-uploader_small' : ''}" style="background-image:url(${thumbPhoto})">
        </div>
      `
    },
    // 提供对外的删除方法
    deleteImg(index) {
      _options.afterDeleteComplete.call(null, index)
    },
    // 对外提供通用的获取当前页面所有的图片进行绑定click事件打开预览页面
    defaultBindAllPicClick() {
      _options.jqAlias(_options.imageWarp).find('li').each(function (index) {
        _options.jqAlias(this).on('click', function () {
          var photos = [];
          _options.jqAlias(_options.imageWarp).find('li').each(function () {
            //注意需要兼容ios和android，ios下面[url()],android下面[url("")]
            let picurl = _options.jqAlias(this).data('newupload') === '1' ? _options.jqAlias(this).css('backgroundImage').replace('url("', '').replace('")', '').replace('url(', '').replace(')', '') : _options.jqAlias(this).data('picurl')
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

/*
 * picker(单列、日期控件封装)
 * @Author: strong
 * @Date: 2017-06-06 15:36:31
 * @Last Modified by: strong
 * @Last Modified time: 2017-07-05 21:19:10
 */
const ui_picker = (function () {
  var $mobiscroll;
  //默认配置【显示样式为IOS弹出选择框，显示的方式在最下面，语言为中文】
  var defaults = {
    theme: "ios",//ios风格
    display: "bottom",//放在下面
    lang: "zh",//中文
    dateFormat: 'yy-mm-dd',//默认日期格式
    target: Object, // 目标
    jqAlias: $,
    onDestroy() {
      flex(100, 1)
    },
    onBeforeClose() {
      $mobiscroll.mobiscroll('destroy')
    },
    onBeforeShow() {

    }
  }
  return {
    /**
     * 初始化日期控件，异步加载js及css
     * @param {any} use_options 配置信息
     * @param {any} callback 加载完成后的回调
     * @param {string} [baseUrl=''] 读取文件的基础路径
     */
    initMobiscroll(use_options = '', callback = '', baseUrl = '') {
      if (use_options !== '' && callback !== '') {
        use_options = Object.assign({}, defaults, use_options)
        ui.showLoading('加载中...')
      }
      use_options.jqAlias.getScript(`${baseUrl}require/require.js`, function () {
        require.config({
          baseUrl: baseUrl,
          map: {
            '*': {
              'css': `${baseUrl}require/css.min.js`
            }
          }
        })
        require([`${baseUrl}mobiscroll3.0/js/mobiscroll.custom-3.0.0-beta2.min.js`, `css!${baseUrl}mobiscroll3.0/css/mobiscroll.custom-3.0.0-beta2.min.css`], function () {
          if (use_options !== '' && callback !== '') {
            ui.hideLoading()
            $mobiscroll = use_options.target
            let metaEl = document.querySelector('meta[name="viewport"]')
            document.documentElement.style.fontSize = "50px"
            metaEl.setAttribute('content', `width=device-width,user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1`);
            setTimeout(function () {
              callback.call(this, use_options)
            }, 200)
          }
        })
      })
    }
  }
})()

/*
 * 将ajax调用封装起来
 * @Author: strong
 * @Date: 2017-05-09 13:13:59
 * @Last Modified by: strong
 * @Last Modified time: 2017-07-26 12:00:14
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
			loadingType: '',// loading加载的方式，【line：页面某一行loading，block：页面级别的loading】
			successCb: (resp) => {
			},
			failCb: (resp) => {
				this._defaultFailCb(resp);
			},
			errorCb: () => {
				this._defaultErrorCb();
			}
		}
		Object.assign(this.options, options)
	}

	_defaultFailCb(resp) {
		// 这种情况下如果加载失败默认弹出提示框
		if (this.options.method === 'get' && this.options.loadingType === 'block') {
			let options = {
				dialogBodyContent: !Util.checkNull(resp.resultDesc) ? resp.resultDesc : this.options.resultDesc,
				dialogTitle: "温馨提示",
				defaultBtnTile: "返回",
				primaryBtnTitle: !Util.checkNull(this.options.retryMethod) ? '重试' : '',
				defaultBtnCb() {
					window.history.go(-1);
				},
				primaryBtnCb() {
					window.location.reload();
				}
  		}
			ui_dialog.init(options).show();
		} else if (this.options.method === 'get' || this.options.loadingType === 'line') {
			let retryButton = `<a href="javascript:;" onclick="${this.options.retryMethod}" class="kdui-text_blue">重试</a>`
			// 如果重试方法没有配置，则不显示重试按钮
			if (Util.checkNull(this.options.retryMethod)) {
				retryButton = '';
			}
			this.options.rootDiv.html(`<div class="kdui-loadmore">
			<p class="kdui-loadmore__text">${resp.resultDesc} ${retryButton}</p>
			</div>
			`);
		} else {
			ui.showTip(resp.resultDesc, 3000);
		}
	}


	_defaultErrorCb() {
		const resp = {
			resultDesc: this.options.resultDesc
		}
		this._defaultFailCb(resp)
	}

	// 页面的某一块显示没有数据
	defaultNullDataCbForPage(desc) {
		this.options.rootDiv.html(`<div class="kdui-loadmore">
			<p class="kdui-loadmore__text">${desc}</p>
			</div>
		`);
	}

	// 整个页面显示没有数据
	defaultNullDataCbForAllPage(desc) {
		this.options.rootDiv.addClass('kdui-msg__warp')
		this.options.rootDiv.html(`<div class="kdui-msg">
			<p class="kdui-msg__pic kdui-msg__pic-emptydata"></p>
			<p class="kdui-msg__desc">${desc}</p>
			</div>
		`);
	}

	// get方式异步获取ajax数据
	run() {
		if (Util.checkNull(this.options.ajaxUrl)) {
			console.error("异步获取数据没有配置异步调用地址ajaxUrl");
			return;
		}
		if (this.options.rootDiv.length < 1 && this.options.method === 'get' && this.options.loadingType != 'block') {
			console.error("页面rootDiv节点不存在或没有传入对应的根节点");
			return;
		}
		if (this.options.method === 'post' || this.options.loadingType === 'block') {
			ui.showLoading(this.options.loadingText);
		} else {
			this.options.rootDiv.html(`<div class="kdui-loadmore">
	    	<i class='kdui-loading'></i>
	    	<p class="kdui-loadmore__text">数据加载中...</p>
	    </div>
			`);
		}
		$.ajax({
			type: this.options.method,
			url: this.options.ajaxUrl,
			data: this.options.ajaxData,
			dataType: "json",
			success: (resp) => {
				if (this.options.method === 'post' || this.options.loadingType === 'block') {
					ui.hideLoading()
				}
				if (resp.resultCode == 0) {
					this.options.successCb(resp)
				} else {
					this.options.failCb(resp)
				}
			},
			error: () => {
				if (this.options.method === 'post' || this.options.loadingType === 'block') {
					ui.hideLoading()
				}
				this.options.errorCb()
			}
		});
	}
}

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
      let temp = d.getMonth() + 1
      let dayTemp = d.getDate()
      if(temp < 10){
        temp = `0${temp}`
      }
      if(dayTemp < 10) {
        dayTemp = `0${dayTemp}`
      }
      return d.getFullYear() + "-" + temp + "-" + dayTemp
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
    },
    /**
     * 将页面上的内容是“px”单位的转换为“rem”
     * @param {any} str 需要替换的你内容
     * @param {any} unit 转换单位
     */
    pxToRem(str, unit) {
      let reg = /(\d)+(px)/gi
      let arr = str.match(reg)
      if(!arr){
        return str
      }
      for (let i = 0, len = arr.length; i < len; i++) {
        str = str.replace(arr[i], parseInt(arr[i])/unit + 'rem')
      }
      return str
    },
    /**
     * 校验电子邮件
     * @param {any} email
     * @returns
     */
    checkEmail(email) {
      let reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
      return email.match(reg)
    },
    /**
     * 校验邮政编码
     * @param {any} postCode
     * @returns
     */
    checkPostCode(postCode) {
      let reg = /[1-9]\d{5}(?!\d)/
      return postCode.match(reg)
    }
  }
}();

(function () {
  Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
})();

/*
 * 封装一些form表单相关的方法及
 * @Author: strong
 * @Date: 2017-06-03 23:04:10
 * @Last Modified by: strong
 * @Last Modified time: 2017-09-18 14:31:31
 */
const util_form = (function () {
  return {
    /**
     * 给input赋值
     * @param {string} [formName='dataForm']
     * @param {any} inputName
     * @param {any} value
     */
    setInputValue(formName = 'dataForm', inputName, value) {
      $(`#${formName} input[name='${inputName}']`).val(value)
    },
    /**
     * 获取input的值
     * @param {string} [formName='dataForm']
     * @param {any} inputName
     * @returns
     */
    getInputValue(formName = 'dataForm', inputName) {
      return $(`#${formName} input[name='${inputName}']`).val()
    },
    /**
     * 计算textarea输入了多少文字
     * @param {any} obj
     */
    calcTextareaTextCounts(obj) {
      let len;
      if (obj) {
        len = obj.value.length;
        $(obj).next("div").find("span").eq(0).html(len);
      }
    },

    /**
     * 初始化自动换行的textarea
     */
    initTextareaAutoWrap() {
      if ($(".kdui-textarea_autotext_hidden").length > 0 && $(".kdui-textarea_autotext").length > 0) {
        $(".kdui-textarea_autotext_hidden").val($(".kdui-textarea_autotext").val())
        let textarea_hidden_h = $(".kdui-textarea_autotext_hidden")[0].scrollHeight
        let scale = localStorage.getItem('initial-scale')
        if (textarea_hidden_h >= 60 / scale) {
          $(".kdui-textarea_autotext").height(1.2 + 'rem')
        } else {
          $(".kdui-textarea_autotext").height(textarea_hidden_h)
        }
      }
    },

    /**
     * textarea自动换行处理
     */
    textareaAutoWrap() {
      $(".kdui-textarea_autotext_hidden").width($(".kdui-textarea_autotext").width())
      $(".kdui-textarea_autotext").on("input", util_form.initTextareaAutoWrap);
    },
    /**
     * checkbox控制子类的显示和隐藏
     * @param {string} [checkboxParent='.js_kdui-check__parent'] checkbox父类节点
     * @param {string} [checnkboxChilds='.js_kdui-check__childs'] 子类节点
     */
    checkboxSlideToggle(checkboxParent = '.js_kdui-check__parent', checnkboxChilds = '.js_kdui-check__childs', callback = function(){}) {
      $(checkboxParent).on('change', function () {
        $(this).siblings(checnkboxChilds).slideToggle(300, function () {
          if (typeof myScroll != 'undefined')
            myScroll.refresh();
          callback.call(this);
        })
      })
    },
    /**
     * checkbox控制子类的显示和隐藏(针对顶部的下拉)
     * @param {string} [checkboxParent='.js_topbar__parent']
     * @param {string} [checnkboxChilds='.js_topbar__childs']
     */
    checkboxTopbarSlideToggle(checkboxParent = '.js_topbar__parent', checnkboxChilds = '.js_topbar__childs') {
      $(checkboxParent).on('change', function () {
        let $self = $(this)
        $self.prop('checked') ? $self.parent('div').removeClass('kdui-border_b') : ''
        $(checnkboxChilds).slideToggle()
        $(checnkboxChilds).children('div.kdui-topbar').slideToggle(300, function () {
          $self.prop('checked') ? '' : $self.parent('div').addClass('kdui-border_b')
        })
      })
    }
  }
})()


/*
 * 将字符转换成HTMLEntites，以对抗XSS。
 * @Author: strong 
 * @Date: 2017-06-29 14:38:25 
 * @Last Modified by: strong
 * @Last Modified time: 2017-07-13 02:45:13
 */
var HtmlEncode = function(str){
    var hex = new Array('0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f');
    var preescape = str;
    var escaped = "";
    for(var i = 0; i < preescape.length; i++){
        var p = preescape.charAt(i);
        escaped = escaped + escapeCharx(p);
    }
    
    return escaped;
                    
    function escapeCharx(original){
        var found=true;
        var thechar=original.charCodeAt(0);
        switch(thechar) {
            case 10: return "<br/>"; break; //newline
            case 32: return "&nbsp;"; break; //space
            case 34:return "&quot;"; break; //"
            case 38:return "&amp;"; break; //&
            case 39:return "&#x27;"; break; //'
            case 47:return "&#x2F;"; break; // /
            case 60:return "&lt;"; break; //<
            case 62:return "&gt;"; break; //>
            /*case 198:return "&AElig;"; break;
            case 193:return "&Aacute;"; break;
            case 194:return "&Acirc;"; break; 
            case 192:return "&Agrave;"; break; 
            case 197:return "&Aring;"; break; 
            case 195:return "&Atilde;"; break; 
            case 196:return "&Auml;"; break; 
            case 199:return "&Ccedil;"; break; 
            case 208:return "&ETH;"; break;
            case 201:return "&Eacute;"; break; 
            case 202:return "&Ecirc;"; break; 
            case 200:return "&Egrave;"; break; 
            case 203:return "&Euml;"; break;
            case 205:return "&Iacute;"; break;
            case 206:return "&Icirc;"; break; 
            case 204:return "&Igrave;"; break; 
            case 207:return "&Iuml;"; break;
            case 209:return "&Ntilde;"; break; 
            case 211:return "&Oacute;"; break;
            case 212:return "&Ocirc;"; break; 
            case 210:return "&Ograve;"; break; 
            case 216:return "&Oslash;"; break; 
            case 213:return "&Otilde;"; break; 
            case 214:return "&Ouml;"; break;
            case 222:return "&THORN;"; break; 
            case 218:return "&Uacute;"; break; 
            case 219:return "&Ucirc;"; break; 
            case 217:return "&Ugrave;"; break; 
            case 220:return "&Uuml;"; break; 
            case 221:return "&Yacute;"; break;
            case 225:return "&aacute;"; break; 
            case 226:return "&acirc;"; break; 
            case 230:return "&aelig;"; break; 
            case 224:return "&agrave;"; break; 
            case 229:return "&aring;"; break; 
            case 227:return "&atilde;"; break; 
            case 228:return "&auml;"; break; 
            case 231:return "&ccedil;"; break; 
            case 233:return "&eacute;"; break;
            case 234:return "&ecirc;"; break; 
            case 232:return "&egrave;"; break; 
            case 240:return "&eth;"; break; 
            case 235:return "&euml;"; break; 
            case 237:return "&iacute;"; break; 
            case 238:return "&icirc;"; break; 
            case 236:return "&igrave;"; break; 
            case 239:return "&iuml;"; break; 
            case 241:return "&ntilde;"; break; 
            case 243:return "&oacute;"; break;
            case 244:return "&ocirc;"; break; 
            case 242:return "&ograve;"; break; 
            case 248:return "&oslash;"; break; 
            case 245:return "&otilde;"; break;
            case 246:return "&ouml;"; break; 
            case 223:return "&szlig;"; break; 
            case 254:return "&thorn;"; break; 
            case 250:return "&uacute;"; break; 
            case 251:return "&ucirc;"; break; 
            case 249:return "&ugrave;"; break; 
            case 252:return "&uuml;"; break; 
            case 253:return "&yacute;"; break; 
            case 255:return "&yuml;"; break;
            case 162:return "&cent;"; break; 
            case '\r': break;*/
            default:
                found=false;
                break;
        }
        if(!found){
            /*if(thechar>127) {
                var c=thechar;
                var a4=c%16;
                c=Math.floor(c/16); 
                var a3=c%16;
                c=Math.floor(c/16);
                var a2=c%16;
                c=Math.floor(c/16);
                var a1=c%16;
                return "&#x"+hex[a1]+hex[a2]+hex[a3]+hex[a4]+";";        
            }
            else{*/
                return original;
            //}
        }    
    }
    //return str;
}
/*
 * 使用“\”对特殊字符进行转义，除数字字母之外，小于127的字符编码使用16进制“\xHH”的方式进行编码，大于用unicode（非常严格模式）。
 * @Author: strong 
 * @Date: 2017-06-29 14:37:41 
 * @Last Modified by: strong
 * @Last Modified time: 2017-07-13 02:16:27
 */
const JavaScriptEncode = function(str){
    /*var hex=new Array('0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'); 
    function changeTo16Hex(charCode){
        return "\\x" + charCode.charCodeAt(0).toString(16);
    }
    function encodeCharx(original) {
        
        var found = true;
        var thecharchar = original.charAt(0);
        var thechar = original.charCodeAt(0);
        switch(thecharchar) {
            case '\n': return "\\n"; break; //newline
            case '\r': return "\\r"; break; //Carriage return
            case '\'': return "\\'"; break;
            case '"': return "\\\""; break;
            case '\&': return "\\&"; break;
            case '\\': return "\\\\"; break;
            case '\t': return "\\t"; break;
            case '\b': return "\\b"; break;
            case '\f': return "\\f"; break;
            case '/': return "\\x2F"; break;
            case '<': return "\\x3C"; break;
            case '>': return "\\x3E"; break;
            default:
                found=false;
                break;
        }
        if(!found){
            if(thechar > 47 && thechar < 58){ //数字
                return original;
            }
            
            if(thechar > 64 && thechar < 91){ //大写字母
                return original;
            }

            if(thechar > 96 && thechar < 123){ //小写字母
                return original;
            }        
            
            if(thechar>127) { //大于127用unicode
                var c = thechar;
                var a4 = c%16;
                c = Math.floor(c/16); 
                var a3 = c%16;
                c = Math.floor(c/16);
                var a2 = c%16;
                c = Math.floor(c/16);
                var a1 = c%16;
                return "\\u"+hex[a1]+hex[a2]+hex[a3]+hex[a4]+"";        
            }
            else {
                return changeTo16Hex(original);
            }
            
        }
    }     
  
    var preescape = str;
    var escaped = "";
    var i=0;
    for(i=0; i < preescape.length; i++){
        escaped = escaped + encodeCharx(preescape.charAt(i));
    }
    return escaped;*/
    return str;
}