'use strict';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});


const blackList = [
'http://codemade.js.org/caffeine/dist/bundle.js',
'http://codemade.js.org/caffeine/dist/main.css'
];

const blockIt = true;

chrome.webRequest.onBeforeRequest.addListener(() => {
	return {
		cancel: blockIt
	};
},
{
	urls: blackList,
	types: ['script', 'stylesheet']
},
['blocking']);

// chrome.browserAction.setBadgeText({text: '\'blockject'});

console.log('\'Allo \'Allo! Event Page for Browser Action');
