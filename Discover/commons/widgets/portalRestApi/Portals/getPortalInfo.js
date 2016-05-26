/**
 * Created by Esri on 16-4-22.
 * 获取Portal自身的基本信息
 */
define('widgets/portalRestApi/Portals/getPortalInfo', [null], function () {
    var WidgetGetPortalInfo = function () {
        var _self = this;
    };
    WidgetGetPortalInfo.prototype = {
        //需要token。
        doGetPortalInfo:function(url,token){
            var _self = this;
            var deferredObj =  $.ajax({
                type: "POST",
                url: url + "/sharing/community/self",
                data: {
                    f : "json",
                    token : token
                },
                dataType:"json"//dataType不能少
            });
            return deferredObj;
        }

    };
    return WidgetGetPortalInfo;
});