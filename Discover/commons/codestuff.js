(function() {
    var theme = document.body.classList.contains("dark") ? "dark" : "light";
    var codemirrorDiv = document.getElementById('codemirror');
    if (codemirrorDiv) {
        window.editor = CodeMirror.fromTextArea(codemirrorDiv, {
            lineNumbers: true,
            mode: 'javascript',
            scrollbarStyle: 'null',
            theme: theme === 'dark' ? 'monokai' : 'default'
        });
    }
    var btn = document.querySelector(".showcode");
    if (btn) {
        btn.addEventListener("click", function(event) {
            document.querySelector(".manual").classList.toggle("visible");
        });
    }
    //wfh start------------------------------
    //**************************************
    var btnShowPortal = document.querySelector(".showPortal");
    if (btnShowPortal) {
        btnShowPortal.addEventListener("click", function(event) {
            var portalUrl = "http://wangfh.portallocal.com/arcgis/home/item.html?id=222a26501cbc4bc1acd1b6bdd551b968";
            window.open(portalUrl,"_blank");
        });
    }
    var btnGoTo3DPage = document.querySelector(".goTo3DPage");
    if (btnGoTo3DPage) {
        btnGoTo3DPage.addEventListener("click", function(event) {
            var portalUrl = "4.0loadABasicWebMap_SceneView.html";
            window.open(portalUrl,"_self");
        });
    }
    var btnShowWebScene = document.querySelector(".showWebScene");
    if (btnShowWebScene) {
        btnShowWebScene.addEventListener("click", function(event) {
            var portalUrl = "4.0loadABasicWebScene_SceneView.html";
            window.open(portalUrl,"_self");
        });
    }
    var btnShowPortal3D = document.querySelector(".showPortal3D");
    if (btnShowPortal3D) {
        btnShowPortal3D.addEventListener("click", function(event) {
            var portalUrl = "http://wangfh.portallocal.com/arcgis/home/item.html?id=adf1b39c5ebc4aba8c7925e9f80d9ca2";
            window.open(portalUrl,"_blank");
        });
    }
    var btnShowDefaultTheme = document.querySelector(".showDefaultTheme");
    if (btnShowDefaultTheme) {
        btnShowDefaultTheme.addEventListener("click", function(event) {
            window.open('4.0defaultThemeWidgets.html',"_blank");
        });
    }
    var btndoTheme = document.querySelector(".doTheme");
    if (btndoTheme) {
        btndoTheme.addEventListener("click", function(event) {
            window.open('4.0defaultThemeWidgets.html',"_blank");
        });
    }
    var btnShowReactTheme = document.querySelector(".showReactTheme");
    if (btnShowReactTheme) {
        btnShowReactTheme.addEventListener("click", function(event) {
            window.open('../../widgets/frankenwidget/ReactWidgetTheme.html',"_blank");
        });
    }
    var btnShowReactTheme = document.querySelector(".showReactTheme");
    if (btnShowReactTheme) {
        btnShowReactTheme.addEventListener("click", function(event) {
            window.open('../../widgets/frankenwidget/ReactWidgetTheme.html',"_blank");
        });
    }
    var btnDoBuildAPI = document.querySelector(".doBuildAPI");
    if (btnDoBuildAPI) {
        btnDoBuildAPI.addEventListener("click", function(event) {
            window.open('http://localhost/arcgis_js_api/sdk/3.16sdk/jshelp/inside_web_optimizer.html',"_blank");
        });
    }



    //**************************************
    //######################################
    //var btn = document.querySelector(".doRenderer");
    //if (btn) {
    //    btn.addEventListener("click", function(event) {
    //        document.querySelector(".manual").classList.toggle("visible");
    //    });
    //}
    //######################################
    //wfh end------------------------------


    window.highlightLine = function highlightLine(lineNumber) {
        //Line number is zero based index
        var actualLineNumber = lineNumber - 1;
        //Set line css class
        console.log(window.editor);
        window.editor.addLineClass(actualLineNumber, 'background', 'line-highlight');
    }
})();
