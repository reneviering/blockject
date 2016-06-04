import React from 'react';
import ReactDOM from 'react-dom';

const Popup = React.createClass({
  render() {
    return <div>Alter das ist geil!</div>;
  }
});

ReactDOM.render(<Popup/>, document.getElementById('content'));
