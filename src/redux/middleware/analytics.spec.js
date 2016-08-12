import { createStore, applyMiddleware } from 'redux';
import * as actions from '../modules/analytics';

describe('analytics middleware', () => {
	let store;
	let analytics;
	let lib;

	beforeEach(() => {
		lib = jasmine.createSpyObj('lib', ['create', 'trackEvent']);
		analytics = require('inject!./analytics')({
			'../../helpers/tracking': lib
		}).default;

		const reducer = (state = {}, action) => {
			if (action.type === 'APPLY_ENV') {
				return {
					env: {
						info: {
							gaId: 'MyID'
						}
					}
				};
			}
			return state;
		};

		store = createStore(
			reducer,
			applyMiddleware(analytics)
		);
	});

	it('doesnt create a tracker unless there is something to track', () => {
		store.dispatch({ type: 'APPLY_ENV' });
		expect(lib.create).not.toHaveBeenCalledWith();
	});

	it('creates the tracker on-demand', () => {
		store.dispatch({ type: 'APPLY_ENV' });
		store.dispatch({
			type: 'SOME_ACTION',
			meta: { track: true	}
		});
		expect(lib.create).toHaveBeenCalledWith('MyID');
	});

	it('tracks an event', () => {
		const expected = {
			category: 'Cat',
			action: 'Act',
			label: 'Lab'
		};
		store.dispatch({ type: 'APPLY_ENV' });
		store.dispatch({
			type: 'SOME_ACTION',
			meta: {
				track: {
					type: actions.ANALYTICS_EVENT,
					payload: {
						category: 'Cat',
						action: 'Act',
						label: 'Lab'
					}
				}
			}
		});
		expect(lib.trackEvent).toHaveBeenCalledWith(expected);
	});
});
