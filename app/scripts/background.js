'use strict';
import Rx from 'rx';
// Enable chromereload by uncommenting this line:
// import './lib/livereload';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

const blockIt = false;

const blackList = [
    'http://codemade.js.org/caffeine/dist/bundle.js',
    'http://codemade.js.org/caffeine/dist/main.css'
];

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


const createResourceLocator = () => {
  let subscribers = [];

  let resources = [];

  const subscribe = subscriber => {
    subscribers.push(subscriber);
    return () => {
        subscribers = subscribers.filter(s => s !== subscriber);
    };
  };

  const addResource = resource => {
    resources.push(resource);
    subscribers.forEach(s => s());
  };

  const getResources = () => resources
                              .map(r => r.url)
                              .filter(url => (url.endsWith('js') || url.endsWith('css')) && !url.startsWith('chrome-extension'));

  const resetResources = () => {
    resources = [];
  };

  return {subscribe, addResource, getResources, resetResources};
};
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
    return {
        cancel: false
    };
}, {
    urls: [],
    types: ['script', 'stylesheet']
});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'loading') {
      resourceLocator.resetResources();
    }
});
