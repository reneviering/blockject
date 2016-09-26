'use strict';
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


const inject = () => {

    const injectScripts = () => {
        var actualCode = '(' + function() {

            //var scriptsToInject = window.blockject.scriptsToInject.split(',');
            var scriptsToInject = [
            'http://localhost:8000/main.css'
            ];

            const addScriptToDocument = (scriptToAdd) => {
                (document.document || document.documentElement).appendChild(scriptToAdd);
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

    //makeScriptUrlsGlobalAvailable();
    injectScripts();

};

inject(true); // eslint-disable-line dot-notation
