/**
 * Created by Esri on 16-4-21.
 */
define('widgets/myUtils/domUtil', [null], function () {
    var WidgetDomUtil = function () {
        var _self = this;
        _self.widgetName = "WidgetDomUtil";//模块内全局变量
    };
    WidgetDomUtil.prototype = {
        //dom元素颜色变成红色
        doChangeRed:function(id){
            var _self = this;
            console.log("调用了模块："+_self.widgetName);
            $("#"+id).css("color","red");
        },
        doRecover:function(id){
            $("#"+id).css("color","white");
        }

    };
    return WidgetDomUtil;
});

