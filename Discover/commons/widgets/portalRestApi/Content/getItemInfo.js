/**
 * Created by Esri on 16-4-27.
 * 获取item的信息
 */
define('widgets/portalRestApi/Content/getItemInfo', [null], function () {
    var WidgetGetItemInfo = function () {
        var _self = this;
    };
    WidgetGetItemInfo.prototype = {
        //需要token。
        doGetItemInfo:function(url,itemId,token){
            var _self = this;
            var deferredObj =  $.ajax({
                type: "POST",
                url: url + "/sharing/rest/content/items/"+itemId,
                data: {
                    f : "json",
                    token : token
                },
                dataType:"json"//dataType不能少
            });
            return deferredObj;
        }

    };
    return WidgetGetItemInfo;
});