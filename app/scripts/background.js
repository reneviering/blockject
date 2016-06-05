'use strict';
import Rx from 'rx';
import createResourceLocator from './core/createResourceLocator.js';

const blockIt = false;

const blackList = [
    // 'http://codemade.js.org/caffeine/dist/bundle.js',
    // 'http://codemade.js.org/caffeine/dist/main.css'
];

chrome.webRequest.onBeforeRequest.addListener(req => {
  return {cancel: blackList.length > 0};
}, {
    urls: blackList,
    types: ['script', 'stylesheet']
}, ['blocking']);


const resourceLocator = createResourceLocator();
const resources$ = new Rx.Subject();
const allResources$ = resources$
      .debounce(1000)
      .subscribe(() => {
        chrome.storage.sync.set({webRequests: resourceLocator.getResources()});
      });


resourceLocator.subscribe(() => {
  resources$.onNext()
});

chrome.webRequest.onBeforeRequest.addListener(req => {
  resourceLocator.addResource(req);
  return {cancel: false};
}, {
    urls: [],
    types: ['script', 'stylesheet']
});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'loading') {
      resourceLocator.resetResources();
    }
});
