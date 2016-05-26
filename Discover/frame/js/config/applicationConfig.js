/*global define,dojo,dojoConfig,esri */
/**
 * Created by Esri on 16-5-7.
 */
define([], function () {
    return {
        //portal 作为数据源  start----------
        /*WebMapId: "e385f88dc5c846d38ff4e8965916f06d",//portal 华为 移动执法数据  第一次 */
        //WebMapId: "4a3b4f026eb048738aca91f2efdae14e",//portal 华为 移动执法数据  第二次 最新
        WebMapId: "e10b899f10ee4a39b42b808529ddda00",//sandbox   图层、表的名称要修改一下，mapSettings.js里面 封装
        //PortalAPIURL: "http://portal2.giscloud.local/arcgis/sharing/rest/",
        PortalAPIURL: "http://sandbox.arcgisonline.cn/arcgis/sharing/rest/",//sandbox
        BasemapGroupTitle: "YDZF",//这个得配置 20160111
        //BasemapGroupOwner: "zhoun",//这个得配置
        BasemapGroupOwner: "arcgis_3d",//这个得配置

        /*图层配置的字符串      图层的名称   layer.name  */
        MatchLayersArray: [
            { eventexamineLayer: "eventexamine"},
            { locusofpointLayer: "locusofpoint"},
            { locusofLineLayer: "历史轨迹"},
            { Monitored_listLayer: "Monitored_list"},
            { report12369Layer: "report12369"}
        ],
        /*属性表配置的字符串      属性表的title属性  */
        MatchTablesArray: [
            { dailyexamineTable: "YDZF_2016 - dailyexamine"},
            { enterprise_userTable: "YDZF_2016 - enterprise_user"},
            { enterpriseexamineTable: "YDZF_2016 - enterpriseexamine"},
            { lawenforementTable: "YDZF_2016 - lawenforement"}
        ],
        //portal 作为数据源  end----------

        // Set proxy URL
        ProxyUrl: "/frame/proxy/proxy.ashx",

        LocatorSettings: {
            QueryLayerIndex: 0,
            //DefaultLocatorSymbol: "/js/library/themes/images/redpushpin.png",
            DefaultLocatorSymbol: "/js/library/themes/images/address.gif",
            MarkupSymbolSize: {
                width: 35,
                height: 35
            },
            DisplayText: "Address",
//            LocatorDefaultAddress: "139 W Porter Ave Naperville IL 60540",
//            周边查询  默认查询的地址
//            LocatorDefaultAddress: "东城区地坛公园南门公共充电点",
            LocatorDefaultAddress: "公园",
            LocatorParameters: {
                SearchField: "SingleLine",
                SearchBoundaryField: "searchExtent"
            },
            LocatorURL: "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
            LocatorOutFields: ["Addr_Type", "Type", "Score", "Match_Addr", "xmin", "xmax", "ymin", "ymax"],
            DisplayField: "${Match_Addr}",
            AddressMatchScore: {
                Field: "Score",
                Value: 80
            },
            FilterFieldName: 'Addr_Type',
            //FilterFieldValues: ["StreetAddress", "StreetName", "PointAddress", "POI"],
            FilterFieldValues: ["stationNo", "stationName", "stationAddr", "longItude","latItude"],
            MaxResults: 200
        },
        // Set Geometry Service URL
        GeometryService: "http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer",

        // Set widgets settings such as widgetPath to be displayed in header panel
        // WidgetPath: Path of the widget respective to the widgets package.
        AppHeaderWidgets: [
            {
                WidgetPath: "widgets/dailyexamine/dailyexamine"
            },
            {
                WidgetPath: "widgets/lawenforement/lawenforement"
            },
            {
                WidgetPath: "widgets/showData/showData"
            },
            {
                WidgetPath: "widgets/workingConditions/workingConditions"
            },
            {
                WidgetPath: "widgets/layersList/layersList"
            }
        ]
    };
});
