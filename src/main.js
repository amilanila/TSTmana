import './polyfills';
import React from 'react';
import { render } from 'react-dom';
import { renderToString } from 'react-dom/server';
import { browserHistory, match } from 'react-router';
import configureStore from './redux/configureStore';
import Root from './containers/Root';
import { createLocation } from 'history';
import routes from './routes';

// Main Client side application hook
if (typeof document !== 'undefined') {
	const store = configureStore();
	render(
		<Root history={browserHistory} store={store} routes={routes} />,
		document.getElementById('root')
	);

	if (process.env.NODE_ENV !== 'production') {
		/*eslint-disable */
		console.log(`It is working!!!`);
		/*eslint-enable */
	}
}

// Build Time Static Render to String Function
module.exports = (locals, callback) => {
	const location = createLocation(locals.path);
	const store = configureStore({ staticRender: true });

	match({ routes, location }, (error, redirectLocation, renderProps) => {
		callback(null, locals.template({
			html: renderToString(
				<Root store={store} staticRenderProps={renderProps} />
			)
		}));
	});
};
