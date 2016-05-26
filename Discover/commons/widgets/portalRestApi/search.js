/**
 * Created by Esri on 16-4-28.
 */
/**
 * Created by Esri on 16-4-22.
 * search接口
 */
define('widgets/portalRestApi/search', [null], function () {
    var WidgetSearch = function () {
        var _self = this;
    };
    WidgetSearch.prototype = {
        //发送的是异步请求，返回一个异步对象。
        doSearch:function(portalUrl,queryStr,token){
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
        }

    };
    return WidgetSearch;
});



























