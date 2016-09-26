'use strict';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

const blackList = [
'http://rene.js.org/css/main.css'
];

//const blockIt = JSON.parse(localStorage['activated']); // eslint-disable-line dot-notation
let blockIt = true;
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
