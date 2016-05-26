/**
 * Created by Esri on 16-4-21.
 */
var pathRegex = new RegExp(/\/[^\/]+$/);
var locationPath = location.pathname.replace(pathRegex, '');
var root = "/" + location.pathname.split("/")[1];
//require.js config  配置文件模块路径
require({
    parseOnLad: true,
    paths: {},
    shim: {},
    packages: [
        {
            name: "js",
            location: root + '/js'
        },
        {
            name: "widgets",
            location: root + '/application/widgets'
        }
    ]
});