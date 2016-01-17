'use strict';

var Comp = React.createClass({ // eslint-disable-line
	getInitialState() {
		return { counter: 1 };
	},

	onClick() {
		this.setState({counter: this.state.counter + 1});
	},

	render() {
		return <div onClick={this.onClick}>Hello Chrome Extension! {this.state.counter}</div>;
	}
});

ReactDOM.render(<Comp/>, document.body); // eslint-disable-line