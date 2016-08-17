import { createStore, compose, applyMiddleware } from 'redux';
import rootReducer from './rootReducer';
import thunk from 'redux-thunk';
import analytics from './middleware/analytics';
import metaDispatch from './middleware/meta-dispatch';

const instrumentation = [];
if (process.env.NODE_ENV !== 'production') {
	const DevTools = require('../containers/DevTools').default;
	// Required! Enable Redux DevTools with the monitors you chose
	instrumentation.push(DevTools.instrument());
}

export default function configureStore(initialState) {
	const store = createStore(
		rootReducer,
		initialState,
		compose(
			applyMiddleware(
				thunk,
				analytics,
				metaDispatch('feedback')
			),
			...instrumentation
		)
	);
	return store;
}
