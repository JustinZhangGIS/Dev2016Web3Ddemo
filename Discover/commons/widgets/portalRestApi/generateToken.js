/**
 * Created by Esri on 16-4-22.
 * 获取token
 */
define('widgets/portalRestApi/generateToken', [null], function () {
    var WidgetGenerateToken = function () {
        var _self = this;
    };
    WidgetGenerateToken.prototype = {
        //获取token，发送的是异步请求，返回一个异步对象。
        doGenerateToken:function(portalUrl,username,password){
            var _self = this;
            //因为generateToken这个接口必须是https开头的地址，
            //所以最好判断并处理一下portalUrl
            var portalUrlNew =  _self._handlePortalUrl(portalUrl);
            var deferredObj =  $.ajax({
                type: "POST",
                url: portalUrlNew + "/sharing/generateToken",
                data: {
                    username: username,
                    password: password,
//                    referer: "localhost", // URL of the sending app.
                    referer: location.hostname, // URL of the sending app.
                    expiration: 60, // Lifetime of the token in minutes.
                    f: "json"
                },
                dataType:"json"//dataType不能少
            });
            return deferredObj;
        },
        _handlePortalUrl:function(portalUrl){
            var portalUrlNew;
            //转换http 为 https   start-----
            if(portalUrl.indexOf("https") <0){
                portalUrlNew = portalUrl.replace("http","https");
            }else{
                portalUrlNew = portalUrl;
            }
            //转换http 为 https   end-----
            return portalUrlNew;
        }

    };
    return WidgetGenerateToken;
});


