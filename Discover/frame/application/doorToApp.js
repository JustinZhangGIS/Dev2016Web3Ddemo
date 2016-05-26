/**
 * Created by Esri on 16-4-21.
 */
require([
    "widgets/myUtils/domUtil",
    "widgets/myUtils/fileUtil",
    "widgets/search/search",
    "widgets/chart/chart"
], function (domUtil,fileUtil,search,chart) {
    //0、实例化widget对象
    var domUtilObj = new domUtil();
    //1、常规设置
    $("#changeRedId").click(function(){
//        domUtilObj.doChangeRed("helloId");
    });
    $("#recoverId").click(function(){
//        domUtilObj.doRecover("helloId");
    });
    //2、查询
    //3、图表
    //...

});