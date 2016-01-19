'use strict';

var Comp = React.createClass({	// eslint-disable-line
	getInitialState() {
		return {
			blockUrls: [],
			injectUrls: []
		};
	},
	componentDidMount() {
		if(typeof localStorage['blockjectData'] !== 'undefined') { // eslint-disable-line dot-notation
			var stateFromLocalStorage = JSON.parse(localStorage['blockjectData']); // eslint-disable-line dot-notation
			this.setState(stateFromLocalStorage);
		}
	},

	saveState(state) {
		var action = {
			type: 'updateData',
			data: JSON.stringify(state)
		};

		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, action, function() {});
		});

		chrome.runtime.sendMessage(action, function() {});
	},

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

	onAddNewBlockUrl() {
		var newState = {
			blockUrls: [...this.state.blockUrls, this.refs.newBlockUrl.value],
			injectUrls: [...this.state.injectUrls]
		};
		this.setState(newState);
		this.saveState(newState);
	},

	onAddNewInjectUrl() {
		var newState = {
			blockUrls: [...this.state.blockUrls],
			injectUrls: [...this.state.injectUrls, this.refs.newInjectUrl.value]
		};
		this.setState(newState);
		this.saveState(newState);
	},

	onDeleteBlockUrl(url) {
		var newState = {
			blockUrls: this.state.blockUrls.filter(blockUrl => url !== blockUrl),
			injectUrls: [...this.state.injectUrls]
		};
		this.setState(newState);
		this.saveState(newState);
	},

	onDeleteInjectUrl(url) {
		var newState = {
			blockUrls: [...this.state.blockUrls],
			injectUrls: this.state.injectUrls.filter(injectUrl => url !== injectUrl)
		};
		this.setState(newState);
		this.saveState(newState);
	},

	onSaveChanges() {
		chrome.runtime.reload();
	},

	render() {
		var blockUrls = this.state.blockUrls.map(url => {
			return <li>{url}<button onClick={() => { this.onDeleteBlockUrl(url); }}>delete</button></li>;
		});

		var injectUrls = this.state.injectUrls.map(url => {
			return <li>{url}<button onClick={() => { this.onDeleteInjectUrl(url); }}>delete</button></li>;
		});
		return <div>
			<button onClick={this.onActivate}>Activate</button>
			<button onClick={this.onDeactivate}>Deactivate</button>

			<h1>BlockUrls</h1>
			<ul>
				{blockUrls}
			</ul>

			<input type="text" ref="newBlockUrl" />
			<button onClick={this.onAddNewBlockUrl}>Add</button>

			<h1>InjectUrls</h1>
			<ul>
				{injectUrls}
			</ul>

			<input type="text" ref="newInjectUrl" />
			<button onClick={this.onAddNewInjectUrl}>Add</button>

			<div>
				<button onClick={this.onSaveChanges}>Save changes</button>
			</div>
		</div>;
	}
});

ReactDOM.render(<Comp/>, document.body); // eslint-disable-line