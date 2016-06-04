'use strict';

// Enable chromereload by uncommenting this line:
import './lib/livereload';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

const blockIt = true;

const blackList = [
    'http://codemade.js.org/caffeine/dist/bundle.js',
    'http://codemade.js.org/caffeine/dist/main.css'
];

chrome.webRequest.onBeforeRequest.addListener(() => {
  console.log('bla');
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
