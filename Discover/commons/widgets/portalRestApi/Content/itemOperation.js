/**
 * Created by Esri on 16-4-28.
 * item的相关操作
 */
define('widgets/portalRestApi/Content/itemOperation', [null], function () {
    var WidgetItemOperation = function () {
        var _self = this;
    };
    WidgetItemOperation.prototype = {
        //增加一个item
        doAddItem:function(loginInfoObj,dataInfoObj){
            var _self = this;
            var deferredObj =  $.ajax({
                type: "POST",
                url: loginInfoObj.portalUrl + "/sharing/content/users/" + loginInfoObj.username + "/addItem",
//                url: loginInfoObj.portalUrl + "/sharing/rest/content/users/" + loginInfoObj.username + "/addItem",//1、多一个rest 就不行了。需要深入研究
//                url: loginInfoObj.portalUrl + "/sharing/content/users/" + loginInfoObj.username +folderId+ "/addItem",//2、当然，在某个文件夹下addItem，需要文件夹的id
                data: {
                    f : "json",
                    title : dataInfoObj.newsTitle,
                    text : dataInfoObj.newsContent,
                    tags : dataInfoObj.newsTags,
                    token : loginInfoObj.token
                },
                dataType:"json"//dataType不能少
            });
            return deferredObj;
        },
        //删除一个item
        doDeleteItem:function(portalUrl,username,itemId,token){
            var _self = this;
            var deferredObj =  $.ajax({
                type: "POST",
//                url: portalUrl + "/sharing/rest/content/users/" + username + "/items/" + itemId + "/delete?f=json&token=" + token,
                url: portalUrl + "/sharing/rest/content/users/" + username + "/items/" + itemId + "/delete",
                data: {
                    token : token,
                    f : 'json'
                },
                dataType:"json"//dataType不能少
            });
            return deferredObj;
        }
    };
    return WidgetItemOperation;
});