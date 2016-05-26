/**
 * Created by Esri on 2016/5/20.
 * webMaps接口
 */
define('widgets/gallery/webMapsWidget', [null], function () {
    var WidgetWebMapsWidget = function () {
        var _self = this;
    };
    WidgetWebMapsWidget.prototype = {
        //发送的是异步请求，返回一个异步对象。
        doGetWebMaps:function(portalUrl,queryStr,token){
            var _self = this;
            var deferredObj =  $.ajax({
                type: "POST",
                url: portalUrl + "/sharing/search",
                data: {
                    f : "json",
                    q : queryStr,
                    num:100,
                    token : token
                },
                dataType:"json"//dataType不能少
            });
            return deferredObj;
        },
        doShowWebMaps:function(webMapsResult,itemPodsListDiv,view){
            var _self = this;
            _self.view = view;
            var i, divPodParentList, divPodParent;
            for (i = 0; i < webMapsResult.length; i++) {
                divPodParent = $("<div class='esriCTApplicationBox'></div>").appendTo(itemPodsListDiv);
                _self._createThumbnails(webMapsResult[i], divPodParent);
                //_self._createGridItemOverview(webMapsResult[i], divPodParent);
            }

        },
        _createThumbnails: function (itemResult, divPodParent) {
            var _self = this;
            var divThumbnail, divThumbnailImage, divTagContainer, divTagContent, dataType;

            divThumbnail = $("<div class='esriCTImageContainer'></div>").appendTo(divPodParent);
            divThumbnailImage = $("<div class='esriCTAppImage'></div>").appendTo(divThumbnail);


            //if (itemResult.thumbnailUrl) {//3.x
            if (itemResult.thumbnail) {//4.0
                //domStyle.set(divThumbnailImage, "background", 'url(' + itemResult.thumbnailUrl + ') no-repeat center center');
                //路径 start
                var portalUrl = 'http://wangfh.portallocal.com/arcgis/sharing/rest/content/items/';
                var imageUrl2 = portalUrl+itemResult.id+'/info/'+itemResult.thumbnail;
                var imageUrl = 'url(\'' + imageUrl2 + '\')';
                divThumbnailImage.css('background',imageUrl);
                //路径 end

                //divThumbnailImage.css('background','url(' + itemResult.thumbnail + ') no-repeat center center');//不行
                //var imageUrl = "'url('../images/logo.png') no-repeat center center'";//路径不对。
                //var imageUrl = "'url('images/logo.png')'";//这个不行！
                //var imageUrl = "'url(\'images/logo.png\')'";//这个不行！
                //var imageUrl = 'url(\'images/logo.png\')';//这个行
                //var imageUrl = 'url(\'' + itemResult.thumbnail + '\')';//这个行，但是路径可能不对
                //divThumbnailImage.css('background',imageUrl);
                //路径 start
                //var portalUrl = 'http://wangfh.portallocal.com/arcgis/sharing/rest/content/items/';
                //var imageUrl = portalUrl+itemResult.id+'/info/'+itemResult.thumbnail;
                ////var imageUrlFinal = 'url(\''+imageUrl+'\'';//这个不行
                //var imageUrlFinal = 'url(\'http://wangfh.portallocal.com/arcgis/sharing/rest/content/items/'+itemResult.id+'/info/'+itemResult.thumbnail+'\'';
                //divThumbnailImage.css('background',imageUrlFinal);
                //路径 end
                //divThumbnailImage.css('background','url(\'images/logo.png\')');//这个行
                divThumbnailImage.css('color','red');//可以。
                //divThumbnailImage.css('background-image',imageUrl);//不行，要设置的属性不对

            } else {
                //$("#" + symbolsDivID).addClass("widthHeight");
                divThumbnailImage.addClass("esriCTNoThumbnailImage");
            }

            divTagContainer = $("<div class='esriCTSharingTag'></div>").appendTo(divThumbnailImage);

            divTagContent = $("<div class='esriCTTag'></div>").appendTo(divTagContainer);

            divThumbnailImage.click(function(){
                //alert("hello 2016dev："+itemResult.title);
                //portalItem: {
                //    //这是本地Portal里的WebMap类型的tem的id
                //    id: "ce42b8f740a14fcea1ee6f63a26ea6df"
                //},
                //var mapNew = new WebMap({
                //    portalItem:{
                //        id:itemResult.id
                //    }
                //});
                //_self.view.map = mapNew;
                //var a = 1;
                dojo.refreshMap(itemResult.id);
            });
        },
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
        }

    };
    return WidgetWebMapsWidget;
});



























