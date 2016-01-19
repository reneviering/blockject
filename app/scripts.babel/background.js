'use strict';

chrome.runtime.onInstalled.addListener(details => {
    console.log('previousVersion', details.previousVersion);
});


// const blackList = [
//     'http://codemade.js.org/caffeine/dist/bundle.js',
//     'http://codemade.js.org/caffeine/dist/main.css'
// ];

var blackList = [];
if(typeof localStorage['blockjectData'] !== 'undefined') { // eslint-disable-line dot-notation
    blackList = JSON.parse(localStorage['blockjectData']).blockUrls; // eslint-disable-line dot-notation

}


const blockIt = JSON.parse(localStorage['activated']); // eslint-disable-line dot-notation

chrome.webRequest.onBeforeRequest.addListener(() => {
	if(blackList.length === 0)
	{
		return {cancel: false};
	}
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
		case 'updateData':
			localStorage['blockjectData'] = request.data; // eslint-disable-line dot-notation
		break;
	}
});