import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import Header from '../Header';
import Footer from '../Footer';

export class App extends Component {
	render() {
		return (
			<div>
				<Header/>
				<span>Team manamgent content goes here</span>
				<Footer/>
			</div>
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
