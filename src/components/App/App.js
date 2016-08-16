import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Home from '../Home';

injectTapEventPlugin();

export class App extends Component {
	render() {
		return (
			<MuiThemeProvider>
				<Home/>
			</MuiThemeProvider>
		);
	}
}

export const propTypes = App.propTypes = {
	children: PropTypes.node,
	env: PropTypes.object,
	session: PropTypes.object,
	staticRender: PropTypes.bool
};

export default connect(
	state => ({
		env: state.env,
		session: state.session,
		staticRender: state.staticRender
	})
)(App);
