var rootPath = location.href.substring(0, location.href.lastIndexOf('/') + 1);
var rootPath2 = location.pathname.replace(/\/[^/]+$/, "");
var dojoConfig = {
    isDebug: true,
    async: true,
    packages: [
        {
            name: "commons",
            location: rootPath + "../../commons/js"
        },
        {
            name: "widgets",
            location: rootPath + "../../commons/widgets"
        },
        {
            name: "libs",
            location: rootPath + "../../commons/libs"
        },
        {
            name: "local",
            location: rootPath2 + "../js"
        },
        {
            name: "js",
            location: rootPath2 + "../js"
        }
    ]
};
