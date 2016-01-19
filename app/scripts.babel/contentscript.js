'use strict';

// var scriptSource = [
//     'http://localhost:3000/dist/bundle.js',
//     'http://localhost:3000/dist/main.css',
//     'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-beta1/jquery.min.js',
//     'http://localhost:3000/file1.js'
// ];
var scriptSource = null;
if(typeof localStorage['blockjectData'] !== 'undefined') { // eslint-disable-line dot-notation
    scriptSource = JSON.parse(localStorage['blockjectData']).injectUrls; // eslint-disable-line dot-notation

}


chrome.runtime.onMessage.addListener(function(request) {
 switch(request.type) {
     case 'activateExtension':
         localStorage['activated'] = true; // eslint-disable-line dot-notation
     break;
     case 'deactivateExtension':
         localStorage['activated'] = false; // eslint-disable-line dot-notation
     break;
     case 'updateData':
        localStorage['blockjectData'] = request.data; // eslint-disable-line dot-notation
     break;
 }
});


const inject = (isActive) => {
    if(!isActive) {
        return;
    }

    if(scriptSource === null || scriptSource.length === 0)
    {
        return;
    }

    const makeScriptUrlsGlobalAvailable = () => {
        var concatenatedScripts1 = scriptSource.join(',');
        var scriptSourcesScript = `(function() { window.blockject = {}; window.blockject.scriptsToInject = '${concatenatedScripts1}'; })();`;
        var s = document.createElement('script');
        s.textContent = scriptSourcesScript;
        (document.head || document.documentElement).appendChild(s);
    };

    const injectScripts = () => {
        var actualCode = '(' + function() {

            var scriptsToInject = window.blockject.scriptsToInject.split(',');
            const addScriptToDocument = (scriptToAdd) => {
                (document.head || document.documentElement).appendChild(scriptToAdd);
            };

            const getNextScript = (scripts, currentIndex) => {
                return (currentIndex + 1 < scripts.length) ? scripts[currentIndex + 1] : null;
            };

            var getElementType = (scriptUrl) => {
                var dict = {
                    css() {
                            var documentElement = document.createElement('link');
                            documentElement.rel = 'stylesheet';
                            documentElement.type = 'text/css';
                            documentElement.href = scriptUrl;
                            return documentElement;
                        },
                        js() {
                            var documentElement = document.createElement('script');
                            documentElement.src = scriptUrl;
                            return documentElement;
                        }
                };

                var items = scriptUrl.split('.');
                var fileType = items[items.length - 1];
                return dict[fileType]();
            };

            var mappedScripts = scriptsToInject.map(getElementType);

            var concatenatedScripts = mappedScripts.map((script, index) => {
                var maybeNextScript = getNextScript(mappedScripts, index);
                if (maybeNextScript) {
                    script.onload = () => {
                        addScriptToDocument(maybeNextScript);
                    };
                }
                return script;
            });

            addScriptToDocument(concatenatedScripts[0]);


        } + ')();';
        var scriptToInject = document.createElement('script');
        scriptToInject.textContent = actualCode;
        (document.head || document.documentElement).appendChild(scriptToInject);
    };

    makeScriptUrlsGlobalAvailable();
    injectScripts();

};

inject(JSON.parse(localStorage['activated'])); // eslint-disable-line dot-notation

