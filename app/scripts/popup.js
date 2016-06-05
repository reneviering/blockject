import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';

const app = (state = {webRequests: []}, action) => {
    switch(action.type) {
      case 'RECEIVE_WEBREQUESTS':
        return Object.assign({}, state, {
          webRequests: [...state.webRequests, ...action.data]
        });
      default:
        return state;
    }
};

const store = createStore(app);

let counter = 0;

store.subscribe(() => {
  chrome.storage.sync.set({appState: store.getState()});
});

const Popup = React.createClass({
  getInitialState() {
    return store.getState();
  },
  componentDidMount() {
    this.unsubscribeStore = store.subscribe(() => {
      this.setState(store.getState());
    })
    counter = 0;
  },
  componentWillUnmount() {
    this.unsubscribeStore();
  },
  renderUrls() {
    return this.state.webRequests.map(requestUrl => {
      return <li>
      {requestUrl}
      <button>block it</button>
      </li>;
    })
  },
  render() {
    return <div>
      <ul>
        {this.renderUrls()}
      </ul>
      <pre>
        <code>
        {JSON.stringify(this.state)}
        </code>
      </pre>
    </div>;
  }
});

ReactDOM.render(<Popup/>, document.getElementById('content'));

chrome.storage.sync.get(data => {
  store.dispatch({
    type: 'RECEIVE_WEBREQUESTS',
    data: data.webRequests
  });
});
