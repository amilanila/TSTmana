import { createStore, applyMiddleware } from 'redux';

describe('meta dispatch middleware', () => {
	let store;
	let reducer;
	let cart;

	beforeEach(() => {
		const cartSummary = jasmine.createSpyObj('cartSummary', ['fetchCartSummary']);
		cartSummary.fetchCartSummary.and.callFake(() => ({
			type: 'FETCH_CART_SUMMARY'
		}));
		cart = require('inject!./cart-middleware')({
			'../modules/cartSummary': cartSummary
		}).default;
	});

	beforeEach(() => {
		reducer = jasmine.createSpy('reducer');
		store = createStore(
			reducer,
			applyMiddleware(cart)
		);
		reducer.calls.reset();
	});

	it('does nothing special without meta.', () => {
		store.dispatch({
			type: 'SOMETHING_SOMETHING'
		});
		expect(reducer.calls.mostRecent().args).not.toEqual([undefined, {
			type: 'FETCH_CART_SUMMARY'
		}]);
	});

	it('does nothing special if meta cart empty.', () => {
		store.dispatch({
			type: 'SOMETHING_SOMETHING',
			meta: {
				cart: { }
			}
		});
		expect(reducer.calls.mostRecent().args).not.toEqual([undefined, {
			type: 'FETCH_CART_SUMMARY'
		}]);
	});

	it('updates the summary when meta is summaryForceUpdate', () => {
		store.dispatch({
			type: 'SOMETHING_SOMETHING',
			meta: {
				cart: { summaryForceUpdate: true }
			}
		});
		expect(reducer.calls.mostRecent().args).toEqual([undefined, {
			type: 'FETCH_CART_SUMMARY'
		}]);
	});
});
