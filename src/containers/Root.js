import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, RoutingContext } from 'react-router';
import { fetchEnv } from '../redux/modules/env';
import { fetchSession } from '../redux/modules/session';
import { fetchCartDetail } from '../redux/modules/cartDetail';

export default class Root extends Component {
	componentDidMount() {
		this.props.store.dispatch(fetchSession());
		this.props.store.dispatch(fetchEnv());
		this.props.store.dispatch(fetchCartDetail());
	}

	content() {
		const { staticRenderProps } = this.props;

		// Build Time, just render a single Route
		if (staticRenderProps) {
			return <RoutingContext {...staticRenderProps} />;
		}

		// Client side, render the entire router
		return (
			<Router history={this.props.history} routes={this.props.routes} />
		);
	}

	devTools() {
		if (process.env.NODE_ENV !== 'production') {
			// const DevTools = require('./DevTools').default;
			// return <DevTools />;
		}
	}

	render() {
		return (
			<Provider store={this.props.store}>
				<div style={{ height: '100%' }}>
					{this.content()}
					{this.devTools()}
				</div>
			</Provider>
		);
	}
}

export const propTypes = Root.propTypes = {
	history: PropTypes.object,
	routes: PropTypes.object,
	store: PropTypes.object.isRequired,
	staticRenderProps: PropTypes.object
};
