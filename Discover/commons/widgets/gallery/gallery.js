/*global define,dojo,alert,unescape,ItemInfoPage */
define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "dojo/dom-attr",
    "dojo/dom",
    "dojo/text!./templates/gallery.html",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/query",
    "dojo/dom-class",
    "dojo/on",
    "dojo/Deferred",
    "dojo/number",
    "dojo/topic",
    "dojo/dom-style",
    "dojo/dom-geometry"
], function (declare, domConstruct, lang, domAttr, dom,template, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, query, domClass, on, Deferred, number, topic, domStyle, domGeom) {

    declare("ItemGallery", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        nls: {},
        /**
        *@class
        *@name  widgets/gallery/gallery
        */
        postCreate: function () {
            //20150826 wfh
            domConstruct.place(this.galleryView, query(".esriCTGalleryContent")[0]);
            this.own(topic.subscribe("createPods", lang.hitch(this, this.createItemPods)));
            //20150817 用观察者模式调用函数还是挺好的 start
            this.own(topic.subscribe("setDetailHeaderIcon",lang.hitch(this,this._setDetailHeaderIcon)));//设置详情页面的 HeaderIcon
//            this.own(topic.subscribe("setDetailHeaderIcon",lang.hitch(this,this._setDetailHeaderIcon())));//this._setDetailHeaderIcon()是错误的！！
            this.own(topic.subscribe("setInitialHeaderIcon",lang.hitch(this,this._setInitialHeaderIcon)));//重新设置 HeaderIcon
            //20150817 用观察者模式调用函数还是挺好的 end
            if (dojo.configData.values.defaultLayout.toLowerCase() === "list") {
//                dojo.gridView = false;
//                domClass.replace(query(".icon-header")[0], "icon-grid", "icon-list");
//                alert("如果是列表视图");
                dojo.gridView = true;
//                domClass.replace(query(".icon-header")[0], "icon-list", "icon-grid");
                var e = dom.byId("layoutTitleId");
                domClass.remove(e,"icon-grid");//样式问题  修改样式！！ 20150608
                domClass.add(e, "icon-list");
            } else {
//                alert("如果是网格视图");
//                dojo.gridView = true;
//                domClass.replace(query(".icon-header")[0], "icon-list", "icon-grid");
                dojo.gridView = false;
                domClass.replace(query(".icon-header")[0], "icon-grid", "icon-list");
            }
            if (query(".esriCTSignInIcon")[0]) {
                if (domStyle.get(query(".esriCTSignInIcon")[0], "display") === "none") {
                    dojo.gridView = false;
                }
            }

            this.own(on(this.galleryNext, "click", lang.hitch(this, function () {
                var defObj, _self;
//                topic.publish("showProgressIndicator");
                defObj = new Deferred();
                _self = this;
                topic.publish("queryGroupItem", null, null, null, defObj, dojo.nextQuery);
                defObj.then(function (data) {
                    var i;
                    dojo.nextQuery = data.nextQueryParams;
                    for (i = 0; i < data.results.length; i++) {
                        dojo.results.push(data.results[i]);
                    }
                    _self.createItemPods(data.results);
                }, function (err) {
                    topic.publish("hideProgressIndicator");
                    alert(err.message);
                });
            })));

            this.own(on(query(".esriCTMenuTabLeft")[0], "click", lang.hitch(this, function () {
//                alert("jjjjjjjjjjjjjjjjjjjjjjjj");//原来在这里  click 表头的事件 代码  是在postCreate 里生成的！！ 一开始 就生成了。
                topic.publish("setInitialHeaderIcon");//重新设置 HeaderIcon
                domClass.remove(query(".esriCTLeftPanel")[0],"esriCTDisplayNone");
                if (query(".esriCTitemDetails")[0]) {
//                if (!query(".esriCTitemDetails")[0]) {
                    //详细
//                    alert(1);//没进入
//                    alert("不用返回query(.esriCTitemDetails)[0]："+query(".esriCTitemDetails")[0]);
                    dojo.destroy(query(".esriCTitemDetails")[0]);
                    domClass.remove(query(".esriCTGalleryContent")[0], "displayNoneAll");
                    domClass.remove(query(".esriCTApplicationIcon")[0], "esriCTCursorPointer");
                    domClass.remove(query(".esriCTMenuTabLeft")[0], "esriCTCursorPointer");
                }
                if (query(".esriCTInnerRightPanelDetails")[0] && (!query(".esriCTNoResults")[0])) {
                    //主页
//                    alert(2);//进入
//                    alert("返回query(.esriCTInnerRightPanelDetails)[0]："+query(".esriCTInnerRightPanelDetails")[0]+",,,"+"query(.esriCTNoResults)[0]):"+query(".esriCTNoResults")[0]);
                    domClass.replace(query(".esriCTMenuTabRight")[0], "displayBlockAll", "displayNoneAll");
                    domClass.add(query(".esriCTInnerRightPanelDetails")[0], "displayNoneAll");
                    domClass.remove(query(".esriCTGalleryContent")[0], "displayNoneAll");
                    domClass.remove(query(".esriCTInnerRightPanel")[0], "displayNoneAll");
                    domClass.remove(query(".esriCTApplicationIcon")[0], "esriCTCursorPointer");
                    domClass.remove(query(".esriCTMenuTabLeft")[0], "esriCTCursorPointer");
                }
            })));

            //这个地方是响应式！！！  原来如此 值得学习！  start
            on(window, "resize", lang.hitch(this, function () {
                //测试 何时隐藏掉 导航栏 start  优先保证1024分辨率下 应用和导航栏不重叠的width值
//                var eTest = dom.byId("resizeTest");
//////               !!! domAttr.set(eTest,"innerHTML",window.screen.width);//一直是1600  这个是分辨率  不是窗口的width
//                var heightValueTest = dojo.window.getBox().h+"px";
//                var widthValueTest = dojo.window.getBox().w;
//                var widthValueStrTest = widthValueTest+"px";
//                domAttr.set(eTest,"innerHTML",widthValueStrTest);
                //测试 何时隐藏掉 导航栏 end

                //设置 导航栏、登录按钮、导航栏横向标识、搜索框 隐藏 start 20150814
                var widthValue = dojo.window.getBox().w;
                var widthValueStr = widthValue+"px";
                var screenWidth = window.screen.width;
                if(screenWidth == "960"){//每行2个
                    if(widthValue<760){
                        this.displayNoneElementLayout();
                    }else{
                        this.displayBlockElementLayout();
                    }
                    if(widthValue<640){
                        this.displayNoneElementSearch();
                    }else{
                        this.displayBlockElementSearch();
                    }
                }else if(screenWidth == "1024"){//每行3个
                    if(widthValue<740){
                        this.displayNoneElementLayout();
                    }else{
                        this.displayBlockElementLayout();
                    }
                    if(widthValue<640){
                        this.displayNoneElementSearch();
                    }else{
                        this.displayBlockElementSearch();
                    }
                }else if(screenWidth == "1280"){//每行3个
                    if(widthValue<740){
                        this.displayNoneElementLayout();
                    }else{
                        this.displayBlockElementLayout();
                    }
                    if(widthValue<640){
                        this.displayNoneElementSearch();
                    }else{
                        this.displayBlockElementSearch();
                    }
                }else if(screenWidth == "1360"){//每行3个
                    if(widthValue<740){
                        this.displayNoneElementLayout();
                    }else{
                        this.displayBlockElementLayout();
                    }
                    if(widthValue<640){
                        this.displayNoneElementSearch();
                    }else{
                        this.displayBlockElementSearch();
                    }
                }else if(screenWidth == "1366"){//每行3个
                    if(widthValue<740){
                        this.displayNoneElementLayout();
                    }else{
                        this.displayBlockElementLayout();
                    }
                    if(widthValue<640){
                        this.displayNoneElementSearch();
                    }else{
                        this.displayBlockElementSearch();
                    }
                }else if(screenWidth == "1440"){//每行4个
                    if(widthValue<740){
                        this.displayNoneElementLayout();
                    }else{
                        this.displayBlockElementLayout();
                    }
                    if(widthValue<640){
                        this.displayNoneElementSearch();
                    }else{
                        this.displayBlockElementSearch();
                    }
                }else if(screenWidth == "1600"){//每行4个
                    if(widthValue<740){
                        this.displayNoneElementLayout();
                    }else{
                        this.displayBlockElementLayout();
                    }
                    if(widthValue<640){
                        this.displayNoneElementSearch();
                    }else{
                        this.displayBlockElementSearch();
                    }
                }else if(screenWidth == "1680"){//每行4个
                    if(widthValue<740){
                        this.displayNoneElementLayout();
                    }else{
                        this.displayBlockElementLayout();
                    }
                    if(widthValue<640){
                        this.displayNoneElementSearch();
                    }else{
                        this.displayBlockElementSearch();
                    }
                }else if(screenWidth == "1920"){//每行5个
                    if(widthValue<740){
                        this.displayNoneElementLayout();
                    }else{
                        this.displayBlockElementLayout();
                    }
                    if(widthValue<640){
                        this.displayNoneElementSearch();
                    }else{
                        this.displayBlockElementSearch();
                    }
                }
                //设置 导航栏、登录按钮 隐藏 end
                var leftPanelDescHeight, containerHeight, innerLeftPanelHeight, tagContainerHeight, descHeight, descContainerHeight;
                if (domClass.contains(query(".esriCTInnerLeftPanelBottom")[0], "esriCTInnerLeftPanelBottomShift")) {
                    innerLeftPanelHeight = dojo.window.getBox().h + "px";
                    domStyle.set(query(".esriCTInnerLeftPanelBottom")[0], "height", innerLeftPanelHeight);
                }
                if (dojo.configData.groupDescription) {
                    if (domStyle.get(query(".esriCTSignInIcon")[0], "display") !== "none") {
                        descHeight = window.innerHeight / 5;
                        leftPanelDescHeight = window.innerHeight - (domGeom.position(query(".esriCTMenuTab")[0]).h + domGeom.position(query(".esriCTInnerLeftPanelBottom")[0]).h - descHeight) + "px";
                        domStyle.set(query(".esriCTGroupDesc")[0], "height", leftPanelDescHeight);
                    }
                }
                containerHeight = (window.innerHeight - domGeom.position(query(".esriCTMenuTab")[0]).h - 20) + "px";
                domStyle.set(query(".esriCTInnerRightPanel")[0], "height", containerHeight);

                if (dojo.configData.groupDescription) {
                    if (domStyle.get(query(".esriCTSignInIcon")[0], "display") === "none") {
                        domClass.remove(query(".esriCTGroupDesc")[0], "esriCTLeftTextReadLess");
                        domStyle.set(query(".esriCTExpand")[0], "display", "none");
                        descContainerHeight = window.innerHeight - (domGeom.position(query(".esriCTGalleryNameSample")[0]).h + 100) + "px";
                        domStyle.set(query(".esriCTGroupDesc")[0], "height", descContainerHeight);
                    } else {
                        domStyle.set(query(".esriCTGroupDesc")[0], "height", "");
                        if (query(query(".esriCTGroupDesc")[0]).text().length > 400) {
                            domClass.add(query(".esriCTGroupDesc")[0], "esriCTLeftTextReadLess");
                        }
                        domStyle.set(query(".esriCTExpand")[0], "display", "block");
                    }
                }
                if (dojo.configData.values.showTagCloud) {
                    if (domClass.contains(query(".esriCTSignIn")[0], "displayNone")) {
                        tagContainerHeight = window.innerHeight - (domGeom.position(query(".sortByLabelMbl")[0]).h + domGeom.position(query(".esriCTCategoriesHeader")[0]).h + 40) + "px";
                        domStyle.set(query(".esriCTPadding")[0], "height", tagContainerHeight);
                    } else {
                        tagContainerHeight = window.innerHeight - (domGeom.position(query(".esriCTCategoriesHeader")[0]).h + domGeom.position(query(".esriCTMenuTab")[0]).h + domGeom.position(query(".esriCTInnerLeftPanelTop")[0]).h + 30) + "px";
                        domStyle.set(query(".esriCTPadding")[0], "height", tagContainerHeight);
                    }
                }
            }));
            var panelHeight = (window.innerHeight - domGeom.position(query(".esriCTMenuTab")[0]).h - 20) + "px";
            domStyle.set(query(".esriCTInnerRightPanel")[0], "height", panelHeight);
        },
        //这个地方是响应式！！！  原来如此 值得学习！  end
        displayNoneElementLayout:function(){
            var layout = query(".esriCTLayout")[0];//布局（列表 格网）
            layout.style.display = "none";
            var sort = query(".esriCTSortViews")[0];//排序  使用 样式 来查找 元素
            sort.style.display = "none";
        },
        displayBlockElementLayout:function(){
            var layout = query(".esriCTLayout")[0];//布局（列表 格网）
            layout.style.display = "block";
            var sort = query(".esriCTSortViews")[0];//排序  使用 样式 来查找 元素
            sort.style.display = "block";
        },
        displayNoneElementSearch:function(){
            dom.byId("esriCTMenuTabTableId").style.display = "none";//搜索框
        },
        displayBlockElementSearch:function(){
            dom.byId("esriCTMenuTabTableId").style.display = "block";//搜索框
        },
        /**
        * Creates the gallery item pods
        * @memberOf widgets/gallery/gallery
        */
        createItemPods: function (itemResults, clearContainerFlag) {//clearContainerFlag是用来判断 是否清空itemPodsList（查询不到的时候就清空）
            var i, divPodParentList, divPodParent;
            if(itemResults.length != 0){//如果查询到结果
                if (clearContainerFlag) {
                    domConstruct.empty(this.itemPodsList);
                }
                if (query(".esriCTShowMoreResults")[0]) {
                    if (itemResults.length < 100 || (itemResults.length === 100 && dojo.groupItems.length === 100)) {
                        domClass.replace(query(".esriCTShowMoreResults")[0], "displayNoneAll", "displayBlockAll");
                    } else {
                        domClass.replace(query(".esriCTShowMoreResults")[0], "displayBlockAll", "displayNoneAll");
                    }
                }
                for (i = 0; i < itemResults.length; i++) {
                    if (!dojo.gridView) {
//                    alert("进行list视图构造");
                        dom.byId("itemPodsListId").style.marginLeft = "244px";
                        divPodParentList = domConstruct.create('div', { "class": "esriCTApplicationListBox" }, this.itemPodsList);
                        this._createThumbnails(itemResults[i], divPodParentList);
                        this._createListItemOverviewPanel(itemResults[i], divPodParentList);
                    } else {
//                    alert("进行grid视图构造");
                        dom.byId("itemPodsListId").style.marginLeft = "0px";
                        //默认是 last 最后面  新创建的div 按顺序添加在应用的最后面。 ！！！ OK
                        divPodParent = domConstruct.create('div', { "class": "esriCTApplicationBox" }, this.itemPodsList);
                        this._createThumbnails(itemResults[i], divPodParent);
                        this._createGridItemOverview(itemResults[i], divPodParent);
                    }
                }
//                loadNavigatorEffect();//重新执行一遍 加载 导航效果的代码!!!!!!!!!!!
                var t = dom.byId("mainOverFlowDiv");
                //------------------不同分辨率下 横向导航、logo样式调整 start---------------------
                var screenWidth = window.screen.width;
                // banner样式 调整
                var bannerElement = dom.byId("bannerImageDivId");// banner 元素
                // 横向导航 元素  调整
                var parentElement = dom.byId("esriCTMarkId");
//                var itemPodsListElement = dom.byId("itemPodsListId");
                if(screenWidth == "1024"){//每行3个
                    parentElement.style.width = "70%";
                    bannerElement.style.backgroundPosition = "50% 30%";//20150814
                }else if(screenWidth == "1600"){//每行4个  图片的尾和应用的尾对齐
                    parentElement.style.width = "75.5%";//调整排序，视图 工具条 那行
                    bannerElement.style.backgroundPosition = "50% 30%";//20150814
                }else if(screenWidth == "1920"){//每行6个 图片的头和应用的头对齐
                    parentElement.style.width = "78.8%";
                    bannerElement.style.backgroundPosition = "50% 30%";//20150814
                }else if(screenWidth == "1680"){//每行5个
                    parentElement.style.width = "75.3%";
                    bannerElement.style.backgroundPosition = "50% 30%";//20150814
                }else if(screenWidth == "1440"){//每行4个
                    parentElement.style.width = "66.8%";
                    bannerElement.style.backgroundPosition = "50% 30%";//20150814
                }else if(screenWidth == "1366"){//每行4个
                    parentElement.style.width = "70.4%";
                    bannerElement.style.backgroundPosition = "50% 30%";//20150814
                }else if(screenWidth == "1360"){//每行4个
                    parentElement.style.width = "70.8%";
                    bannerElement.style.backgroundPosition = "50% 30%";//20150814
                }else if(screenWidth == "1280"){//每行4个
                    parentElement.style.width = "75.3%";
                    bannerElement.style.backgroundPosition = "50% 30%";//20150814
                }else if(screenWidth == "960"){//每行2个
                    parentElement.style.width = "49.2%";
                    bannerElement.style.backgroundPosition = "50% 30%";//20150814
                }
                //------------------不同分辨率下 横向导航、logo样式调整 end---------------------
                //部件 重新调整位置 start
                //布局 部件
                var layout = query(".esriCTLayout")[0];
                layout.style.display = "block";
                domConstruct.place(layout,parentElement);
                var layoutTitle = dom.byId("layoutTitleId");
                layoutTitle.style.color = "#919599";
                //排序 部件
                var sort = query(".esriCTSortViews")[0];//使用 样式 来查找 元素
                sort.style.display = "block";
                domConstruct.place(sort,parentElement);
                //部件 重新调整位置 end
                topic.publish("hideProgressIndicator");
                //取消 进度条 wfh 20150805 start
//               var spinner = dojo.spinData;
//               spinner.stop();
                doStopSpinner();
                //取消 进度条 wfh 20150805 end
                //增加顶部分界线 wfh 20160317 start
                dom.byId("MenuTabId").style.borderBottom = "solid 1px #5ac8fa";
                //增加顶部分界线 wfh 20160317 end
            }
            else{//如果未查询到结果
                if (clearContainerFlag) {
                    domConstruct.empty(this.itemPodsList);//那么先清空 itemPodsList
                }
                if (!dojo.gridView) {
                    divPodParent = domConstruct.create('div', { "class": "esriCTApplicationBox" }, this.itemPodsList);
                    domAttr.set(divPodParent,"innerHTML","未查询到任何结果，请重新选择。");
                } else {
                    divPodParent = domConstruct.create('div', { "class": "esriCTApplicationBox" }, this.itemPodsList);
                    domAttr.set(divPodParent,"innerHTML","未查询到任何结果，请重新选择。");
                }
                dojo.results = [];//20150811 wfh  用于修复  未查询到结果的情况下 点击 视图切换按钮 显示上次查询成功的 应用列表 的bug
//                loadNavigatorEffect();//重新加载 导航栏鼠标移动上去的事件
                topic.publish("hideProgressIndicator");
            }
        },
        /**
        * Create HTML for grid layout
        * @memberOf widgets/gallery/gallery
        */
        _createGridItemOverview: function (itemResult, divPodParent) {
            var divItemTitleRight, divItemTitleText, divItemType, spanItemType, divItemWatchEye, spanItemWatchEyeText;
            var divItemHref, detailItemHref, dividingLine,demoItemHref;

            divItemTitleRight = domConstruct.create('div', { "class": "esriCTDivClear" }, divPodParent);
            divItemTitleText = domConstruct.create('div', { "class": "esriCTListAppTitle esriCTGridTitleContent esriCTCursorPointer" }, divItemTitleRight);
            domAttr.set(divItemTitleText, "innerHTML", (itemResult.title) || (nls.showNullValue));
            domAttr.set(divItemTitleText, "title", (itemResult.title) || (nls.showNullValue));
            divItemType = domConstruct.create('div', { "class": "esriCTGridItemType" }, divItemTitleRight);//display:none
            spanItemType = domConstruct.create('div', { "class": "esriCTInnerGridItemType" }, divItemType);
            domAttr.set(spanItemType, "innerHTML", (itemResult.type) || (nls.showNullValue));
            domAttr.set(spanItemType, "title", (itemResult.type) || (nls.showNullValue));
            //增加一行  详情 | Demo    start--------------------用div
            divItemHref = domConstruct.create('div',{"class":"esriCTGridItemHref"},divItemTitleRight);
            detailItemHref = domConstruct.create('div',{"class":"esriCTListHref esriCTGridHref esriCTCursorPointer"},divItemHref);
            domAttr.set(detailItemHref,"innerHTML",nls.detailItem);
            dividingLine = domConstruct.create('div',{"class":"esriCTListHref esriCTGridHref esriCTCursorPointer"},divItemHref);
            domAttr.set(dividingLine,"innerHTML",nls.dividingLine);
            demoItemHref = domConstruct.create('div',{"class":"esriCTListHref esriCTGridHref esriCTCursorPointer"},divItemHref);
            domAttr.set(demoItemHref,"innerHTML",nls.demoItem);
            //构造 详细、打开时 也要控制 是否可以打开  start //20150812 wfh
            if(itemResult.url == null){
                demoItemHref.style.color = "gray";
                demoItemHref.style.cursor = "not-allowed";
            }else{//如果 url值 不为null 还得把样式 调整回来！
                demoItemHref.style.color = "#5AC8FA";//原来的蓝色  esriCTListHref 里面的属性
                demoItemHref.style.cursor = "pointer";
                //只有 url 不为null的应用 才设置 click事件
                this.own(on(demoItemHref, "click", lang.hitch(this, function () {
                    window.open(itemResult.url,'_blank');
//                this.showInfoPage(this, itemResult, false);
                })));
            }
            //构造 详细、打开时 也要控制 是否可以打开  end //20150812 wfh
            this.own(on(detailItemHref, "click", lang.hitch(this, function () {
                topic.publish("setDetailHeaderIcon");//设置详情页面的 HeaderIcon
                this.showInfoPage(this, itemResult, true);
            })));
            //增加一行  详情 | Demo    end--------------------
            if (dojo.configData.values.showViews) {
                divItemWatchEye = domConstruct.create('div', { "class": "esriCTEyeNumViews esriCTEyeNumViewsGrid" }, divItemType);
                domConstruct.create('span', { "class": "esriCTEyeIcon icon-eye" }, divItemWatchEye);
                spanItemWatchEyeText = domConstruct.create('span', { "class": "view" }, divItemWatchEye);
                domAttr.set(spanItemWatchEyeText, "innerHTML", (itemResult.numViews >= 0) ? (number.format(parseInt(itemResult.numViews, 10))) : (nls.showNullValue));
                domClass.add(spanItemType, "esriCTGridItemTypeViews");
            } else {
                domClass.add(spanItemType, "esriCTGridItemTypeNoViews");
            }
            this.own(on(divItemTitleText, "click", lang.hitch(this, function () {
                topic.publish("setDetailHeaderIcon");//设置详情页面的 HeaderIcon
                this.showInfoPage(this, itemResult, true);
            })));
        },
        _showDetailPrepare:function(){
            var applicationHeaderIconElement = dom.byId("applicationHeaderIconId");
            if(window.screen.width == 1024){
//                applicationHeaderIconElement.style.marginLeft = "132%";
            }else if(window.screen.width == 1600){
//                applicationHeaderIconElement.style.marginLeft = "68.5%";
                applicationHeaderIconElement.style.marginLeft = "236px";
            }else if(window.screen.width == 1920){
                applicationHeaderIconElement.style.marginLeft = "249%";
            }
            else{
            }
            domClass.add(query(".esriCTLeftPanel")[0],"esriCTDisplayNone");
//            topic.publish("showProgressIndicator");
        },
        _setDetailHeaderIcon:function(){
            // 计算  根据  1600 下  236px  列方程计算！　　我来了。是的 王院长的话意味深长 20150608星期一   start--------------
            var applicationHeaderIconElement = dom.byId("applicationHeaderIconId");
            var screenWidth = window.screen.width;
            var setLeft;
            setLeft = screenWidth*236/1600;
            applicationHeaderIconElement.style.marginLeft = setLeft+"px";
        },
        _setInitialHeaderIcon:function(){
            //进行返回 操作
            // 计算  根据  1600 下  204px  列方程计算！　　我来了。是的 20150608星期一   start--------------
//            var applicationHeaderIconElement = dom.byId("applicationHeaderIconId");
//            var screenWidth = window.screen.width;
//            var setLeft;
//            setLeft = screenWidth*204/1600;
//            applicationHeaderIconElement.style.marginLeft = setLeft+"px";
//            if(screenWidth == "1024"){//因为1024下 重新设计了！
//                applicationHeaderIconElement.style.marginLeft = "75px";
//            }
            //因为是重新 设置了 导航栏的 位置 靠左  所以，好放了 离左面的距离是固定的了。
            var applicationHeaderIconElement = dom.byId("applicationHeaderIconId");
            applicationHeaderIconElement.style.marginLeft = "244px";
        },
        /**
        * Create the thumbnails displayed for gallery items
        * @memberOf widgets/gallery/gallery
        */
        _createThumbnails: function (itemResult, divPodParent) {
            var divThumbnail, divThumbnailImage, divTagContainer, divTagContent, dataType;

            if (!dojo.gridView) {
                divThumbnail = domConstruct.create('div', { "class": "esriCTImageContainerList" }, divPodParent);
            } else {
                divThumbnail = domConstruct.create('div', { "class": "esriCTImageContainer" }, divPodParent);
            }

            divThumbnailImage = domConstruct.create('div', { "class": "esriCTAppImage" }, divThumbnail);
            if (itemResult.thumbnailUrl) {
                domStyle.set(divThumbnailImage, "background", 'url(' + itemResult.thumbnailUrl + ') no-repeat center center');
            } else {
                domClass.add(divThumbnailImage, "esriCTNoThumbnailImage");
            }

            divTagContainer = domConstruct.create('div', { "class": "esriCTSharingTag" }, divThumbnailImage);
            divTagContent = domConstruct.create('div', { "class": "esriCTTag" }, divTagContainer);

            if (dojo.configData.values.displaySharingAttribute) {
                this._accessLogoType(itemResult, divTagContent);
            }

            this.own(on(divThumbnailImage, "click", lang.hitch(this, function () {
                topic.publish("setDetailHeaderIcon");//设置详情页面的 HeaderIcon
//                topic.publish("showProgressIndicator");
                this.showInfoPage(this, itemResult, true);
            })));
        },

        /**
        * Executed when user clicks on a item thumbnail or clicks the button on the item info page. It performs a query to fetch the type of the selected item.
        * @memberOf widgets/gallery/gallery
        */
        _showItemOverview: function (itemId, thumbnailUrl, itemResult, data) {
//            alert("进入应用");//这个函数执行了两遍
            var itemDetails, dataType, tokenString2, downloadPath, tokenString, itemUrl, defObject;
            if (data) {
                data.thumbnailUrl = thumbnailUrl;
                dataType = data.type.toLowerCase();
                if ((dataType === "map service") || (dataType === "web map") || (dataType === "feature service") || (dataType === "image service") || (dataType === "kml") || (dataType === "wms")) {
                    if ((dataType === "web map") && dojo.configData.values.mapViewer.toLowerCase() === "arcgis") {
                        topic.publish("hideProgressIndicator");
                        window.open(dojo.configData.values.portalURL + '/home/webmap/viewer.html?webmap=' + itemId, "_self");
                    } else {
                        itemDetails = new ItemDetails({ data: data });
                        itemDetails.startup();
                    }
                    if (dojo.downloadWindow) {
                        dojo.downloadWindow.close();
                    }
                } else {
                    topic.publish("hideProgressIndicator");
                    if (data.url) {
                        dojo.downloadWindow.location = data.url;
                    } else if (data.itemType.toLowerCase() === "file" && data.type.toLowerCase() === "cityengine web scene") {
                        dojo.downloadWindow.location = dojo.configData.values.portalURL + "/apps/CEWebViewer/viewer.html?3dWebScene=" + data.id;
                    } else if (data.itemType.toLowerCase() === "file") {
                        if (dojo.configData.values.token) {
                            tokenString2 = "?token=" + dojo.configData.values.token;
                        } else {
                            tokenString2 = '';
                        }
                        downloadPath = dojo.configData.values.portalURL + "/sharing/content/items/" + itemId + "/data" + tokenString2;
                        dojo.downloadWindow.location = downloadPath;
                    } else if (dataType === "operation view" && data.itemType.toLowerCase() === "text") {
                        if (dojo.configData.values.token) {
                            tokenString = "&token=" + dojo.configData.values.token;
                        } else {
                            tokenString = '';
                        }
                        itemUrl = dojo.configData.values.portalURL + "/sharing/rest/content/items/" + data.id + "/data?f=json" + tokenString;
                        defObject = new Deferred();
                        topic.publish("queryItemInfo", itemUrl, defObject);
                        defObject.then(lang.hitch(this, function (result) {
                            if (dojo.configData.values.token) {
                                tokenString = "?token=" + dojo.configData.values.token;
                            } else {
                                tokenString = '';
                            }
                            if (result.desktopLayout) {
                                downloadPath = dojo.configData.values.portalURL + "/opsdashboard/OperationsDashboard.application?open=" + data.id;
                                dojo.downloadWindow.location = downloadPath;
                            } else if (result.tabletLayout) {
                                downloadPath = dojo.configData.values.portalURL + "/apps/dashboard/index.html#/" + data.id;
                                dojo.downloadWindow.location = downloadPath;
                            }
                        }));
                    } else {
                        alert(nls.errorMessages.unableToOpenItem);
                        if (dojo.downloadWindow) {
                            dojo.downloadWindow.close();
                        }
                    }
                }
            }
        },

        /**
        * Create a tag on the thumbnail image to indicate the access type of the item
        * @memberOf widgets/gallery/gallery
        */
        _accessLogoType: function (itemResult, divTagContent) {
            var title;
            if (itemResult.access === "public") {
                title = nls.allText;
            } else if (itemResult.access === "org") {
                title = nls.orgText;
            } else {
                title = nls.grpText;
            }
            if (divTagContent) {
                domAttr.set(divTagContent, "innerHTML", title);
            }
        },

        /**
        * Create HTML for list layout
        * @memberOf widgets/gallery/gallery
        */
        _createListItemOverviewPanel: function (itemResult, divPodParent) {
            var divContent, divTitle, divItemTitle, divItemTitleRight, divItemTitleText, divItemInfo, divItemType,
                divRatings, numberStars, i, imgRating, divItemWatchEye, spanItemWatchEyeText, divItemContent,
                divItemSnippet, spanItemReadMore, divEyeIcon;
            var divItemHref, detailItemHref, dividingLine,demoItemHref;
            divContent = domConstruct.create('div', { "class": "esriCTListContent" }, divPodParent);
            divTitle = domConstruct.create('div', { "class": "esriCTAppListTitle" }, divContent);

            divItemTitle = domConstruct.create('div', { "class": "esriCTAppListTitleRight" }, divTitle);
            divItemTitleRight = domConstruct.create('div', { "class": "esriCTDivClear" }, divItemTitle);
            divItemTitleText = domConstruct.create('div', { "class": "esriCTListAppTitle esriCTCursorPointer" }, divItemTitleRight);
            domAttr.set(divItemTitleText, "innerHTML", (itemResult.title) || (nls.showNullValue));

            divItemInfo = domConstruct.create('div', {}, divItemTitle);

            divItemType = domConstruct.create('div', { "class": "esriCTListItemType" }, divItemInfo);//display:none
            domAttr.set(divItemType, "innerHTML", (itemResult.type) || (nls.showNullValue));
            //增加一行  详情 | Demo    start--------------------用div
            divItemHref = domConstruct.create('div',{"class":"esriCTGridItemHref"},divItemTitleRight);
            detailItemHref = domConstruct.create('div',{"class":"esriCTListHref esriCTGridHref esriCTCursorPointer"},divItemHref);
            domAttr.set(detailItemHref,"innerHTML",nls.detailItem);
            dividingLine = domConstruct.create('div',{"class":"esriCTListHref esriCTGridHref esriCTCursorPointer"},divItemHref);
            domAttr.set(dividingLine,"innerHTML",nls.dividingLine);
            demoItemHref = domConstruct.create('div',{"class":"esriCTListHref esriCTGridHref esriCTCursorPointer"},divItemHref);
            domAttr.set(demoItemHref,"innerHTML",nls.demoItem);
            //构造 详细、打开时 也要控制 是否可以打开  start //20150812 wfh
            if(itemResult.url == null){
                demoItemHref.style.color = "gray";
                demoItemHref.style.cursor = "not-allowed";
            }else{//如果 url值 不为null 还得把样式 调整回来！
                demoItemHref.style.color = "#5AC8FA";//原来的蓝色  esriCTListHref 里面的属性
                demoItemHref.style.cursor = "pointer";
                //只有 url 不为null的应用 才设置 click事件
                this.own(on(demoItemHref, "click", lang.hitch(this, function () {
                    window.open(itemResult.url,'_blank');
//                this.showInfoPage(this, itemResult, false);
                })));
            }
            //构造 详细、打开时 也要控制 是否可以打开  end //20150812 wfh
            this.own(on(detailItemHref, "click", lang.hitch(this, function () {
              topic.publish("setDetailHeaderIcon");//设置详情页面的 HeaderIcon
              this.showInfoPage(this, itemResult, true);
            })));
            //增加一行  详情 | Demo    end--------------------
            if (dojo.configData.values.showRatings) {
                divRatings = domConstruct.create('div', { "class": "esriCTRatingsDiv" }, divItemInfo);
                numberStars = Math.round(itemResult.avgRating);
                for (i = 0; i < 5; i++) {
                    imgRating = document.createElement("span");
                    imgRating.value = (i + 1);
                    divRatings.appendChild(imgRating);
                    if (i < numberStars) {
                        domClass.add(imgRating, "icon-star esriCTRatingStarIcon esriCTRatingStarIconColor");
                    } else {
                        domClass.add(imgRating, "icon-star-empty esriCTRatingStarIcon esriCTRatingStarIconColor");
                    }
                }
            }
            if (dojo.configData.values.showViews) {
                divItemWatchEye = domConstruct.create('div', { "class": "esriCTEyeNumViews esriCTEyeNumViewsList" }, divItemInfo);
                divEyeIcon = domConstruct.create('span', { "class": "esriCTEyeIcon icon-eye" }, divItemWatchEye);
                if (dojo.configData.values.showRatings) {
                    domClass.add(divEyeIcon, "esriCTEyeIconPadding");
                }
                spanItemWatchEyeText = domConstruct.create('span', { "class": "view" }, divItemWatchEye);
                domAttr.set(spanItemWatchEyeText, "innerHTML", (itemResult.numViews >= 0) ? (number.format(parseInt(itemResult.numViews, 10))) : (nls.showNullValue));
            }
            divItemContent = domConstruct.create('div', { "class": "esriCTListAppContentList" }, divContent);
            divItemSnippet = domConstruct.create('div', { "class": "esriCTAppHeadline" }, divItemContent);
            if (itemResult.snippet) {
                spanItemReadMore = domConstruct.create('span', {}, divItemSnippet);
                domAttr.set(spanItemReadMore, "innerHTML", itemResult.snippet);
            }
            this.own(on(divItemTitleText, "click", lang.hitch(this, function () {
                topic.publish("setDetailHeaderIcon");//设置详情页面的 HeaderIcon
                domClass.add(query(".esriCTLeftPanel")[0],"esriCTDisplayNone");
//                topic.publish("showProgressIndicator");
                this.showInfoPage(this, itemResult, true);
            })));
        },

        showInfoPage: function (_self, itemResult, itemFlag) {
//            alert("itemFlag:"+itemFlag+",,self:"+self);//window
            var infoPage = new ItemInfoPage();
            infoPage.displayPanel(itemResult, _self, itemFlag);
        }
    });

    declare("ItemInfoPage", null, {
        /**
        * Create the HTML for item info page
        * @memberOf widgets/gallery/gallery
        */
        displayPanel: function (itemResult, _self, itemFlag) {
            var numberOfComments, numberOfRatings, numberOfViews, itemReviewDetails, itemDescription, accessContainer, accessInfo, itemCommentDetails, itemViewDetails, itemText, containerHeight, dataArray, itemUrl, defObject, tokenString, dataType;

            if (dojo.configData.values.token) {
                tokenString = "&token=" + dojo.configData.values.token;
//                alert(" if (dojo.configData.values.token:"+tokenString);//没进入
            } else {
                tokenString = '';
//                alert("not  if (dojo.configData.values.token:"+tokenString);//进入了
            }
            itemUrl = dojo.configData.values.portalURL + "/sharing/content/items/" + itemResult.id + "?f=json" + tokenString;
            defObject = new Deferred();
            defObject.then(lang.hitch(this, function (data) {
                if (data) {
                    dataArray = {};
                    if (data.itemType === "file" && data.type.toLowerCase() !== "kml" && data.type.toLowerCase() !== "cityengine web scene") {//没进入
                        domAttr.set(_self.btnTryItNow, "innerHTML", nls.downloadButtonText);
                        domClass.add(_self.btnTryItNow, "esriCTDownloadButton");
                    } else if (data.type.toLowerCase() === "operation view") {//没进入
                        if (dojo.configData.values.token) {
                            tokenString = "&token=" + dojo.configData.values.token;
                        } else {
                            tokenString = '';
                        }
                        itemUrl = dojo.configData.values.portalURL + "/sharing/content/items/" + data.id + "/data?f=json" + tokenString;
                        defObject = new Deferred();
                        topic.publish("queryItemInfo", itemUrl, defObject);
                        defObject.then(lang.hitch(this, function (result) {
                            if (result.desktopLayout) {
                                domAttr.set(_self.btnTryItNow, "innerHTML", nls.downloadButtonText);
                            } else if (result.tabletLayout) {
                                domAttr.set(_self.btnTryItNow, "innerHTML", nls.tryItButtonText);
                                domAttr.set(_self.btnBackToAppViewNow, "innerHTML", nls.backToAppViewButtonText);//这行代码没进来
                            }
                        }));
                    } else {//进入了
                        domAttr.set(_self.btnTryItNow, "innerHTML", nls.tryItButtonText);
                        domAttr.set(_self.btnBackToAppViewNow, "innerHTML", nls.backToAppViewButtonText);//这行代码先起作用。
                        domClass.remove(_self.btnTryItNow, "esriCTDownloadButton");
                        //如果 item 没有 URL 值 就变黑，鼠标移动上去不变小手，而且不让打开  start //20150811 wfh
//                    if(itemResult.URL == null){  URL 不对
                        if(itemResult.url == null){
                            _self.btnTryItNow.style.color = "gray";//设置 打开 button  的颜色
                            _self.btnTryItNow.style.cursor = "not-allowed";//设置 打开 button 能否打开
//                        domAttr.set(_self.btnTryItNow, "color", "gray");
//                        domAttr.set(_self.btnTryItNow, "cursor", "not-allowed");// text  no-drop default not-allowed
                            _self.appThumbnail.style.cursor = "not-allowed";//设置缩略图 能否打开 20150812
                        }else{//如果 url值 不为null 还得把样式 调整回来！
                            _self.btnTryItNow.style.color = "#007AC2";
                            _self.btnTryItNow.style.cursor = "pointer";
                            _self.appThumbnail.style.cursor = "pointer";
                        }
                        //如果 item 没有 URL 值 就变黑，鼠标移动上去不变小手，而且不让打开  end //20150811 wfh
                    }

                    dataArray = {
                        id: data.id,
                        itemType: data.itemType,
                        type: data.type,
                        url: data.url,
                        title: data.title,
                        description: data.description
                    };

                    if (itemFlag) {
                        this._createPropertiesContent(data, _self.detailsContent);
                    } else {
//                        alert("hello");
//                        aler("hello");//我说怎么不往下执行了！ 原来是这里出错了！
                        _self._showItemOverview(itemResult.id, itemResult.thumbnailUrl, itemResult, dataArray);
                    }

                    /**
                    * if showComments flag is set to true in config file
                    */
                    if (dojo.configData.values.showComments) {
                        this._createCommentsContainer(itemResult, _self.detailsContent);
                    }
                }else{
                    alert("noData:"+data);
                }
                //隐藏 标题 指引   这行不能删
                topic.publish("hideProgressIndicator");//通过发布 主题的方式 触发函数（触发订阅者的函数！！！如下，appHeader.js文件里有对该主题的订阅！！！ 所以，会触发 相应的操作。）
//                topic.subscribe("showProgressIndicator", lang.hitch(this, this.showProgressIndicator));
//                topic.subscribe("hideProgressIndicator", lang.hitch(this, this.hideProgressIndicator));
            }), function (err) {
                alert(err.message);
                topic.publish("hideProgressIndicator");
            });
            topic.publish("queryItemInfo", itemUrl, defObject);

            if (itemFlag) {
//                alert("itemFlag是什么？"+itemFlag);   //true
                //替换为小手形状（主页图标、各个小部件：搜索，排序...而中间的文本没有变成小手！！），但是主页图标 点击没有反应！
                domClass.replace(query(".esriCTApplicationIcon")[0], "esriCTCursorPointer", "esriCTCursorDefault");
                domClass.replace(query(".esriCTMenuTabLeft")[0], "esriCTCursorPointer", "esriCTCursorDefault");//中间的文本变小手
                domClass.replace(query(".esriCTMenuTabRight")[0], "displayNoneAll", "displayBlockAll");//移除 标头panel 其它的部件（搜索，排序，布局，登录）
                domClass.replace(query(".esriCTInnerRightPanel")[0], "displayNoneAll", "displayBlockAll");//这行注释掉后 进不去应用了。
                domClass.remove(query(".esriCTInnerRightPanelDetails")[0], "displayNoneAll");//注释掉这行，进去应用 但是是空白    返回操作仍然可以。
                //使用domConstruct.destroy可以销毁节点及其所有子节点，而domConstruct.empty则只销毁所给节点的子节点，其参数为DOM节点或节点的ID字符串。
                domConstruct.empty(_self.detailsContent);//这两行是用来 销毁 描述的子节点的（里面有应用的描述内容，如果不销毁，下一个应用的描述不会更新！！）
                domConstruct.empty(_self.ratingsContainer);
                containerHeight = (window.innerHeight - domGeom.position(query(".esriCTMenuTab")[0]).h - 25) + "px";
                domStyle.set(query(".esriCTInnerRightPanelDetails")[0], "height", containerHeight);

                if (itemResult.thumbnailUrl) {
                    domClass.remove(_self.appThumbnail, "esriCTNoThumbnailImage");
                    domStyle.set(_self.appThumbnail, "background", 'url(' + itemResult.thumbnailUrl + ') no-repeat center center');
                } else {
                    domClass.add(_self.appThumbnail, "esriCTNoThumbnailImage");
                }

                domAttr.set(_self.applicationType, "innerHTML", (itemResult.type) || (nls.showNullValue));
                domAttr.set(_self.applicationAPI, "innerHTML", (itemResult.typeKeywords[0]) || (nls.showNullValue));
//                domAttr.set(_self.applicationTwoDCode, "innerHTML", (itemResult.typeKeywords[0]) || (nls.showNullValue));
                //拼接 二维码 图片  地址  start
                //如果 标签里有  “二维码” 这个标签   就拼接 二维码图片地址，并显示 手机扫一扫 这5个字    否则 就隐藏掉  手机扫一扫 这5个字
                var phoneScanElement = dom.byId("phoneScanId");
                var tagsArray = itemResult.tags;
                if(tagsArray.indexOf("二维码") != -1){
                    phoneScanElement.style.display = "block";
                }else{
                    phoneScanElement.style.display = "none";
                }
                var itemTitle = itemResult.title;
                var backgroundImageVar = 'http://solutions.arcgisonline.cn/portal/home/images/qrcode/'+itemTitle+'.png';
                var backgroundImageVarNew = encodeURI(backgroundImageVar);//对字符串 进行编码！ 20150821 星期五 wfh
                var backgroundImageElement = dom.byId("applicationTwoDCodeId");
                backgroundImageElement.style.backgroundImage = 'url('+backgroundImageVarNew+')';
                backgroundImageElement.style.color = "blue";
                //拼接 二维码 图片  地址  end
                domAttr.set(_self.appTitle, "innerHTML", itemResult.title || "");
                if (dojo.configData.values.showViews) {
                    numberOfComments = (itemResult.numComments) || "0";
                    numberOfRatings = (itemResult.numRatings) || "0";
                    numberOfViews = (itemResult.numViews) ? (number.format(parseInt(itemResult.numViews, 10))) : "0";
                    if (dojo.configData.values.showComments) {
                        itemCommentDetails = numberOfComments + " " + nls.numberOfCommentsText + ", ";
                    } else {
                        itemCommentDetails = "";
                    }
                    if (dojo.configData.values.showRatings) {
                        itemReviewDetails = numberOfRatings + " " + nls.numberOfRatingsText + ", ";
                    } else {
                        itemReviewDetails = "";
                    }
                    itemViewDetails = numberOfViews + " " + nls.numberOfViewsText;
                    itemText = "(" + itemCommentDetails + itemReviewDetails + itemViewDetails + ")";
                    domAttr.set(_self.numOfCommentsViews, "innerHTML", itemText);
                }
                domAttr.set(_self.itemSnippet, "innerHTML", itemResult.snippet || "");
                //动态生成  描述
                domConstruct.create('div', { "class": "esriCTReviewHeader", "innerHTML": nls.appDesText }, _self.detailsContent);
                itemDescription = domConstruct.create('div', { "class": "esriCTText esriCTReviewContainer esriCTBottomBorder" }, _self.detailsContent);
                if (dojo.configData.values.showLicenseInfo) {
                    accessContainer = domConstruct.create('div', { "class": "esriCTReviewContainer esriCTBottomBorder" }, _self.detailsContent);
                    domConstruct.create('div', { "class": "esriCTReviewHeader", "innerHTML": nls.accessConstraintsText }, accessContainer);
                    accessInfo = domConstruct.create('div', { "class": "esriCTText" }, accessContainer);
                    domAttr.set(accessInfo, "innerHTML", itemResult.licenseInfo || "");
                }
                domAttr.set(_self.btnTryItNow, "innerHTML", "");//先设置 为 ""
                this._createItemDescription(itemResult, _self, itemDescription);
                if (_self._btnTryItNowHandle) {
                    /** 再移除监听
                    * remove the click event handler if it already exists, to prevent the binding of the event multiple times
                    */
                    _self._btnTryItNowHandle.remove();
                }
                //移除 返回应用视图 按钮 的 监听事件  事件也是属性！ start
//                if (_self.btnBackToAppViewNow) {
//                    /**这个就把 按钮移除了！！！！！！！！！！！！！！！！
//                     * remove the click event handler if it already exists, to prevent the binding of the event multiple times
//                     */
//                    _self.btnBackToAppViewNow.remove();
//                }
                if (_self._btnBackToAppViewNowHandle) {
                    /**
                     * remove the click event handler if it already exists, to prevent the binding of the event multiple times
                     */
                    _self._btnBackToAppViewNowHandle.remove();
                }
                //移除 返回应用视图 按钮 的 监听事件  end
                //详细页面中 控制 打开button是否添加click事件  start //20150812 wfh
                if(itemResult.url == null){

                }else{
                    dataType = itemResult.type.toLowerCase();
                    _self._btnTryItNowHandle = on(_self.btnTryItNow, "click", lang.hitch(this, function () {
                        if ((domAttr.get(_self.btnTryItNow, "innerHTML") === nls.downloadButtonText) || ((dataType !== "map service") && (dataType !== "web map") && (dataType !== "feature service") && (dataType !== "image service") && (dataType !== "kml") && (dataType !== "wms"))) {
                            dojo.downloadWindow = window.open('', "_blank");
                        }
                        this._showTryItNowView(_self.btnTryItNow, itemResult, _self, dataArray);
                    }));
                }
                //详细页面中 控制 打开button是否添加click事件  end //20150812 wfh

                //添加 返回应用视图的 点击事件  start
                _self._btnBackToAppViewNowHandle = on(_self.btnBackToAppViewNow, "click", lang.hitch(this, function () {
                    //下面这个if判断执行了！！！ 先去掉
//                    if ((domAttr.get(_self.btnBackToAppViewNow, "innerHTML") === nls.downloadButtonText) || ((dataType !== "map service") && (dataType !== "web map") && (dataType !== "feature service") && (dataType !== "image service") && (dataType !== "kml") && (dataType !== "wms"))) {
//                        dojo.downloadWindow = window.open('', "_blank");
//                    }
                    topic.publish("setInitialHeaderIcon");//重新设置 HeaderIcon
                    domClass.remove(query(".esriCTLeftPanel")[0],"esriCTDisplayNone");
                    if (query(".esriCTitemDetails")[0]) {
//                        alert("不用返回query(.esriCTitemDetails)[0]："+query(".esriCTitemDetails")[0]);
                        dojo.destroy(query(".esriCTitemDetails")[0]);
                        domClass.remove(query(".esriCTGalleryContent")[0], "displayNoneAll");
                        domClass.remove(query(".esriCTApplicationIcon")[0], "esriCTCursorPointer");
                        domClass.remove(query(".esriCTMenuTabLeft")[0], "esriCTCursorPointer");
                    }
                    if (query(".esriCTInnerRightPanelDetails")[0] && (!query(".esriCTNoResults")[0])) {
//                        alert("返回query(.esriCTInnerRightPanelDetails)[0]："+query(".esriCTInnerRightPanelDetails")[0]+",,,"+"query(.esriCTNoResults)[0]):"+query(".esriCTNoResults")[0]);
                        domClass.replace(query(".esriCTMenuTabRight")[0], "displayBlockAll", "displayNoneAll");
                        domClass.add(query(".esriCTInnerRightPanelDetails")[0], "displayNoneAll");
                        domClass.remove(query(".esriCTGalleryContent")[0], "displayNoneAll");
                        domClass.remove(query(".esriCTInnerRightPanel")[0], "displayNoneAll");
                        domClass.remove(query(".esriCTApplicationIcon")[0], "esriCTCursorPointer");
                        domClass.remove(query(".esriCTMenuTabLeft")[0], "esriCTCursorPointer");
                    }
                }));
                //添加 返回应用视图的 点击事件  end
                if (_self._appThumbnailClickHandle) {
                    /**
                    * remove the click event handler if it already exists, to prevent the binding of the event multiple times
                    */
                    _self._appThumbnailClickHandle.remove();
                }
                //详细页面中 控制 缩略图 是否添加click事件  start //20150812 wfh
                if(itemResult.url == null){

                }else{
                    _self._appThumbnailClickHandle = on(_self.appThumbnail, "click", lang.hitch(this, function () {
                        if ((dataType !== "map service") && (dataType !== "web map") && (dataType !== "feature service") && (dataType !== "image service") && (dataType !== "kml") && (dataType !== "wms")) {
                            dojo.downloadWindow = window.open('', "_blank");
                        }
                        this._showTryItNowView(_self.appThumbnail, itemResult, _self, dataArray);
                    }));
                }
                //详细页面中 控制 缩略图 是否添加click事件  end //20150812 wfh
            }else{
            }
        },

        _showTryItNowView: function (container, itemResult, _self, dataArray) {
            var itemId, thumbnailUrl;
//            topic.publish("showProgressIndicator");
            itemId = domAttr.get(container, "selectedItem");
            thumbnailUrl = domAttr.get(container, "selectedThumbnail");
            _self._showItemOverview(itemId, thumbnailUrl, itemResult, dataArray);
        },

        /**
        * Extract the item info (tags, extent) and display it in the created properties container
        * @memberOf widgets/gallery/gallery
        */
        _createPropertiesContent: function (itemInfo, detailsContent) {
            var tagsContent, i, itemTags, sizeContent, itemSizeValue, itemSize, tagsContainer, sizeContainer;

            tagsContainer = domConstruct.create('div', { "class": "esriCTReviewContainer esriCTBottomBorder" }, detailsContent);
            // wfh 5 5.1 标签
//            domConstruct.create('div', { "innerHTML": nls.tagsText, "class": "esriCTReviewHeader" }, tagsContainer);
//            tagsContent = domConstruct.create('div', {}, tagsContainer);
//            for (i = 0; i < itemInfo.tags.length; i++) {
//                if (i === 0) {
//                    itemTags = itemInfo.tags[i];
//                } else {
//                    itemTags = itemTags + ", " + itemInfo.tags[i];
//                }
//            }
//            domConstruct.create('div', { "class": "esriCTText", "innerHTML": itemTags }, tagsContent);
//            sizeContainer = domConstruct.create('div', { "class": "esriCTReviewContainer esriCTBottomBorder" }, detailsContent);
            // wfh 5 5.2 大小
//            domConstruct.create('div', { "class": "esriCTReviewHeader", "innerHTML": nls.sizeText }, sizeContainer);
//            sizeContent = domConstruct.create('div', {}, sizeContainer);
//            if (itemInfo.size > 1048576) {
//                itemSizeValue = itemInfo.size / 1048576;
//                itemSize = Math.round(itemSizeValue) + " " + nls.sizeUnitMB;
//            } else {
//                itemSizeValue = itemInfo.size / 1024;
//                itemSize = Math.round(itemSizeValue) + " " + nls.sizeUnitKB;
//            }
//            domConstruct.create('div', { "class": "esriCTText", "innerHTML": itemSize }, sizeContent);
        },

        /**
        * Create the item description container
        * @memberOf widgets/gallery/gallery
        */
        _createItemDescription: function (itemResult, _self, itemDescription) {
            var numberStars, i, imgRating;
            domAttr.set(itemDescription, "innerHTML", itemResult.description || "");
            domAttr.set(_self.itemSubmittedBy, "innerHTML", (itemResult.owner) || (nls.showNullValue));

            /**
            * if showRatings flag is set to true in config file
            */
            if (dojo.configData.values.showRatings) {
                numberStars = Math.round(itemResult.avgRating);
                for (i = 0; i < 5; i++) {
                    imgRating = document.createElement("span");
                    imgRating.value = (i + 1);
                    _self.ratingsContainer.appendChild(imgRating);
                    if (i < numberStars) {
                        domClass.add(imgRating, "icon-star esriCTRatingStarIcon esriCTRatingStarIconColor");
                    } else {
                        domClass.add(imgRating, "icon-star-empty esriCTRatingStarIcon esriCTRatingStarIconColor");
                    }
                }
            }
            domAttr.set(_self.btnTryItNow, "selectedItem", itemResult.id);
            domAttr.set(_self.btnTryItNow, "selectedThumbnail", itemResult.thumbnailUrl);

            domAttr.set(_self.appThumbnail, "selectedItem", itemResult.id);
            domAttr.set(_self.appThumbnail, "selectedThumbnail", itemResult.thumbnailUrl);
        },

        /**
        * Query the item to fetch comments and display the data in the comments container displayed on the item info page
        * @memberOf widgets/gallery/gallery
        */
        _createCommentsContainer: function (itemResult, detailsContent) {
            var reviewContainer = domConstruct.create('div', { "class": "esriCTReviewContainer esriCTBottomBorder" }, detailsContent);
            domConstruct.create('div', { "class": "esriCTReviewHeader", "innerHTML": nls.reviewText }, reviewContainer);
            itemResult.getComments().then(function (result) {
                var i, divReview, divReviewHeader, divReviewText, comment;

                if (result.length > 0) {
                    for (i = 0; i < result.length; i++) {
                        divReview = domConstruct.create('div', { "class": "esriCTReview" }, reviewContainer);
                        divReviewHeader = domConstruct.create('div', { "class": "esriCTReviewBold" }, divReview);
                        divReviewText = domConstruct.create('div', { "class": "esriCTReviewText esriCTBreakWord" }, divReview);
                        domAttr.set(divReviewHeader, "innerHTML", (result[i].created) ? (result[i].created.toLocaleDateString()) : (nls.showNullValue));
                        try {
                            comment = decodeURIComponent(result[i].comment);
                        } catch (e) {
                            comment = unescape(result[i].comment);
                        }
                        domAttr.set(divReviewText, "innerHTML", (result[i].comment) ? comment : (nls.showNullValue));
                    }
                } else {
                    divReview = domConstruct.create('div', { "class": "esriCTDivClear" }, reviewContainer);
                    domConstruct.create('div', { "class": "esriCTBreakWord" }, divReview);
                }
            }, function () {
                var divReview;
                divReview = domConstruct.create('div', { "class": "esriCTDivClear" }, reviewContainer);
                domConstruct.create('div', { "class": "esriCTBreakWord" }, divReview);
            });
        }

    });
});
