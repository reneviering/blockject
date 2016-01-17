'use strict';

var Comp = React.createClass({	// eslint-disable-line
	onActivate() {
		var action = {
			type: 'activateExtension'
		};

		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, action, function() {});
		});

		chrome.runtime.sendMessage(action, function() {});
	},

	onDeactivate() {
		var action = {
			type: 'deactivateExtension'
		};

		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, action, function() {});
		});

		chrome.runtime.sendMessage(action, function() {});
	},

	render() {
		return <div>
			<button onClick={this.onActivate}>Activate</button>
			<button onClick={this.onDeactivate}>Deactivate</button>
		</div>;
	}
});

ReactDOM.render(<Comp/>, document.body); // eslint-disable-line