import { createStore, applyMiddleware } from 'redux';
import metaDispatch from './meta-dispatch';

describe('meta dispatch middleware', () => {
	let store;
	let reducer;

	beforeEach(() => {
		reducer = jasmine.createSpy('reducer');
		store = createStore(
			reducer,
			applyMiddleware(
				metaDispatch('metaProp1'),
				metaDispatch('metaProp2', true)
			)
		);
		reducer.calls.reset();
	});

	it('does nothing without meta', () => {
		store.dispatch({
			type: 'APPLY_ENV'
		});
		expect(reducer.calls.count()).toEqual(1);
	});

	it('dispathes the prop after', () => {
		store.dispatch({
			type: 'APPLY_ENV',
			meta: {
				metaProp1: {
					type: 'SOMEPROP_ACTION'
				}
			}
		});
		expect(reducer.calls.mostRecent().args).toEqual([undefined, {
			type: 'SOMEPROP_ACTION'
		}]);
	});

	it('dispathes the prop before', () => {
		store.dispatch({
			type: 'APPLY_ENV',
			meta: {
				metaProp2: {
					type: 'SOMEPROP_ACTION'
				}
			}
		});
		expect(reducer.calls.first().args).toEqual([undefined, {
			type: 'SOMEPROP_ACTION'
		}]);
	});

	it('doesnt get confused about other props', () => {
		store.dispatch({
			type: 'APPLY_ENV',
			meta: {
				otherProp: {
					type: 'SOMEPROP_ACTION'
				}
			}
		});
		expect(reducer.calls.count()).toEqual(1);
	});
});
