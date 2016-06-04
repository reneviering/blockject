import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';

const app = (state = {text: 'blaaa'}, action) => {
    switch(action.type) {
      case 'ADD_BLOCK_URL':
        return state;
      case 'ACTIVATE':
        return state;
      case 'DEACTIVATE':
        return state;
      default:
        return state;
    }
};

const store = createStore(app);

store.subscribe(() => {
  chrome.storage.sync.set(store.getState());
});

const Popup = React.createClass({
  getInitialState() {
    return store.getState();
  },
  componentDidMount() {
    this.unsubscribeStore = store.subscribe(() => {
      this.setState(store.getState());
    })
  },
  componentWillUnmount() {
    this.unsubscribeStore();
  },
  render() {
    return <div>
      <div>{this.state.text}</div>
      <div>{JSON.stringify(store.getState())}</div>
    </div>;
  }
});

ReactDOM.render(<Popup/>, document.getElementById('content'));
