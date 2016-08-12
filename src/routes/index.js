import React from 'react';
import paths from './paths';
import App from '../components/App';
import navigate from './navigate';

/*
 * React router examples
 * eg. https://github.com/davezuko/react-redux-starter-kit/blob/master/src/routes/index.js
 * eg. https://github.com/rackt/example-react-router-server-rendering-lazy-routes
 */

// Redirect to '/tmana/home' please, nothing to see at '/' or '/tmana/.
const getIndexRoute = (location, cb) => {
	if (typeof window !== 'undefined') {
		// Client Side
		navigate.replaceWithCheckout();
	} else {
		// Server Side
		cb(null, [null]);
	}
};

export default {
	path: '/',
	getIndexRoute,
	childRoutes: [{
		path: paths.ALIAS,
		getIndexRoute
	}, {
		path: paths.APP,
		component: App,
		getIndexRoute,

		/*
		 * This is where the code spliting happens. One JS file per route.
		 * entry:
		 * 	- main.js
		 * chunks:
		 * 	- /checkout
		 */
		childRoutes: [{
			path: paths.HOME,
			getComponent(location, cb) {
				require.ensure([], (require) => {
					// Inform RR that Checkout component is ready to render.
					cb(null, require('../components/Home').default);
				}, 'tmana');
			}
		}]
	}]
};
