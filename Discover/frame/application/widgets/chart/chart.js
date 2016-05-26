/**
 * Created by Esri on 16-4-21.
 */
define('widgets/chart/chart',
    ['widgets/myUtils/domUtil','widgets/search/search'],
    function (domUtil,search) {
    var WidgetChart = function () {
        var _self = this;
        _self.domUtil = new domUtil();//实例化  所加载的别的模块
        _self.search = new search();
    };
    WidgetChart.prototype = {
        doDrawPieChart2D:function(data){
            var _self = this;
            var domUtil = _self.domUtil;
            //逻辑
        },
        doDrawBarChart2D:function(data){

        }
    };
    return WidgetChart;
});