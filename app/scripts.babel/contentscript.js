'use strict';

const inject = () => {
    var actualCode = '(' + function() {

        var scriptsToInject = [
            'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js',
            'http://localhost:3000/file1.js',
            'http://localhost:3000/file2.js',
            'http://localhost:3000/file3.js',
            'http://localhost:3000/file4.js'
        ];

        const addScriptToDocument = (scriptToAdd) => {
            (document.head || document.documentElement).appendChild(scriptToAdd);
        };

        const getNextScript = (scripts, currentIndex) => {
            return (currentIndex + 1 < scripts.length) ? scripts[currentIndex + 1] : null;
        };

        var mappedScripts = scriptsToInject.map(scriptUrl => {
            var scriptItem = document.createElement('script');
            scriptItem.src = scriptUrl;
            return scriptItem;
        });

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

inject();