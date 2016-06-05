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

export default createResourceLocator;
