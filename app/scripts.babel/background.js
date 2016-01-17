'use strict';

chrome.runtime.onInstalled.addListener(details => {
    console.log('previousVersion', details.previousVersion);
});


const blackList = [
    'http://codemade.js.org/caffeine/dist/bundle.js',
    'http://codemade.js.org/caffeine/dist/main.css'
];

const blockIt = JSON.parse(localStorage['activated']); // eslint-disable-line dot-notation

chrome.webRequest.onBeforeRequest.addListener(() => {
    return {
        cancel: blockIt
    };
}, {
    urls: blackList,
    types: ['script', 'stylesheet']
}, ['blocking']);


const activateExtension = () => {
	localStorage['activated'] = true; // eslint-disable-line dot-notation
	chrome.runtime.reload();
};

const deactivateExtension = () => {
	localStorage['activated'] = false; // eslint-disable-line dot-notation
	chrome.runtime.reload();
};

chrome.runtime.onMessage.addListener(function(request) {
	switch(request.type) {
		case 'activateExtension':
			activateExtension();
		break;
		case 'deactivateExtension':
			deactivateExtension();
		break;
	}
});