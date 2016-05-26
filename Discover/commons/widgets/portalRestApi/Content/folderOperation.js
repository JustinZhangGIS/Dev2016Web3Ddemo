/**
 * Created by Esri on 16-4-27.
 * 文件夹的相关操作
 */
define('widgets/portalRestApi/Content/folderOperation', [null], function () {
    var WidgetFolderOperation = function () {
        var _self = this;
    };
    WidgetFolderOperation.prototype = {
        //需要token。
        doCreateFolder:function(url,username,folderName,token){
            var _self = this;
            var deferredObj =  $.ajax({
                type: "POST",
                url: url + "/sharing/rest/content/users/"+username+"/createFolder",
                data: {
                    folderName:folderName,
                    title:folderName,
                    f : "json",
                    token : token
                },
                dataType:"json"//dataType不能少
            });
            return deferredObj;
        }

    };
    return WidgetFolderOperation;
});