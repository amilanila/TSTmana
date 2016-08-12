import deepfreeze from 'deep-freeze';

describe('Cart Summary', () => {
	let reducer;
	let actions;
	let cartSummary;
	let htmlEntities;
	let entryList;
	let decodedEntryList;
	let navigate;

	const mockDecode = arg => 'decoded->' + arg;

	beforeEach(() => {
		const api = jasmine.createSpyObj('api', ['cartSummary']);
		navigate = jasmine.createSpyObj('navigate', ['redirectToBasket']);
		htmlEntities = jasmine.createSpyObj('Html5Entities', ['decode']);
		htmlEntities.decode.and.callFake(mockDecode);
		const moduleInjector = require('inject!./cartSummary');
		const module = moduleInjector({
			'../../api/cart': api,
			'../../routes/navigate': navigate,
			'html-entities/lib/html5-entities': htmlEntities
		});
		reducer = module.default;
		actions = module;
		cartSummary = api.cartSummary;
		entryList = [
			{ product: { name: 'array' } },
			{ product: { name: 'of' } },
			{ product: { name: 'products' } }
		];
		decodedEntryList = [
			{ product: { name: 'decoded->array' } },
			{ product: { name: 'decoded->of' } },
			{ product: { name: 'decoded->products' } }
		];
	});

	describe('reducer', () => {
		it('has an empty initial state', () => {
			const expected = {};
			const actual = reducer(undefined, {});
			expect(actual).toEqual(expected);
		});

		it('has a pending status for fetching', () => {
			const initialState = {};
			const action = {
				type: actions.FETCH_CARTSUMMARY_REQUEST
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: true
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('has a maintains state for pending status', () => {
			const initialState = {
				subtotal: { price: 1 },
				deliveryFee: { price: 2 },
				total: { price: 3 },
				entries: entryList
			};
			const action = {
				type: actions.FETCH_CARTSUMMARY_REQUEST
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: true,
				subtotal: { price: 1 },
				deliveryFee: { price: 2 },
				total: { price: 3 },
				entries: entryList
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('inits the cart summary', () => {
			const initialState = {};
			const action = {
				type: actions.INIT_CARTSUMMARY,
				payload: {
					subtotal: { price: 1 },
					deliveryFee: { price: 2 },
					total: { price: 3 },
					entries: entryList,
					voucher: { code: 'valid_code' },
					orderDiscounts: { price: 4 },
					gst: { price: 5 },
					containsDigitalEntriesOnly: true
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: false,
				subtotal: { price: 1 },
				deliveryFee: { price: 2 },
				total: { price: 3 },
				entries: decodedEntryList,
				voucher: { code: 'valid_code' },
				orderDiscounts: { price: 4 },
				gst: { price: 5 },
				containsDigitalEntriesOnly: true
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('sets the cart summary with whatever was saved', () => {
			const initialState = {};
			const action = {
				type: actions.FETCH_CARTSUMMARY_SUCCESS,
				payload: {
					subtotal: { price: 1 },
					deliveryFee: { price: 2 },
					total: { price: 3 },
					entries: entryList,
					voucher: { code: 'valid_code' },
					orderDiscounts: { price: 4 },
					gst: { price: 5 },
					containsDigitalEntriesOnly: true
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: false,
				subtotal: { price: 1 },
				deliveryFee: { price: 2 },
				total: { price: 3 },
				entries: decodedEntryList,
				voucher: { code: 'valid_code' },
				orderDiscounts: { price: 4 },
				gst: { price: 5 },
				containsDigitalEntriesOnly: true
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('replaces the existing pickup details with whatever was saved', () => {
			const initialState = {
				isFetching: true,
				subtotal: { price: 1 },
				deliveryFee: { price: 2 },
				total: { price: 3 },
				entries: entryList,
				voucher: { code: 'valid_code' },
				orderDiscounts: { price: 4 },
				gst: { price: 5 },
				containsDigitalEntriesOnly: true
			};
			const action = {
				type: actions.FETCH_CARTSUMMARY_SUCCESS,
				payload: {
					subtotal: { price: 4 },
					deliveryFee: { price: 5 },
					total: { price: 6 },
					entries: [
						{ product: { name: 'array' } },
						{ product: { name: 'of' } },
						{ product: { name: 'more' } },
						{ product: { name: 'products' } }
					],
					voucher: { code: 'better_valid_code' },
					orderDiscounts: { price: 7 },
					gst: { price: 5 },
					containsDigitalEntriesOnly: true
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: false,
				subtotal: { price: 4 },
				deliveryFee: { price: 5 },
				total: { price: 6 },
				entries: [
					{ product: { name: 'decoded->array' } },
					{ product: { name: 'decoded->of' } },
					{ product: { name: 'decoded->more' } },
					{ product: { name: 'decoded->products' } }
				],
				voucher: { code: 'better_valid_code' },
				orderDiscounts: { price: 7 },
				gst: { price: 5 },
				containsDigitalEntriesOnly: true
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('removes cart summary when fetch failed', () => {
			const initialState = {
				isFetching: true,
				subtotal: { price: 1 },
				deliveryFee: { price: 2 },
				total: { price: 3 },
				entries: entryList,
				voucher: { code: 'valid_code' },
				orderDiscounts: { price: 4 },
				gst: { price: 5 }
			};
			const action = {
				type: actions.FETCH_CARTSUMMARY_FAILURE,
				payload: {
					error: 'Oops'
				}
			};
			deepfreeze(action);
			deepfreeze(initialState);
			const actual = reducer(initialState, action);
			const expected = {
				isFetching: false
			};
			expect(actual).toEqual(expected);
		});

		it('decodes html entities for the product name', () => {
			htmlEntities.decode.calls.reset();
			const initialState = {};
			const action = {
				type: actions.INIT_CARTSUMMARY,
				payload: {
					subtotal: { price: 1 },
					deliveryFee: { price: 2 },
					total: { price: 3 },
					entries: entryList
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			reducer(initialState, action);
			expect(htmlEntities.decode).toHaveBeenCalled();
		});

		it('decodes html entities for the product name', () => {
			htmlEntities.decode.calls.reset();
			const initialState = {};
			const action = {
				type: actions.INIT_CARTSUMMARY,
				payload: {
					subtotal: { price: 1 },
					deliveryFee: { price: 2 },
					total: { price: 3 },
					entries: [
						{ product: { name: 'product1', size: '0' } },
						{ product: { name: 'product2', size: '0' } }
					]
				}
			};
			const expected = [
				{ product: { name: 'decoded->product1', size: '0' } },
				{ product: { name: 'decoded->product2', size: '0' } }
			];
			deepfreeze(initialState);
			deepfreeze(action);
			const actual = reducer(initialState, action);
			expect(actual.entries).toEqual(expected);
		});
	});

	describe('sync actions', () => {
		it('has a sync action initCartSummary', () => {
			const payload = {
				subtotal: { price: 1 },
				deliveryFee: { price: 2 },
				total: { price: 3 },
				entries: entryList,
				voucher: { code: 'valid_code' },
				orderDiscounts: { price: 4 },
				gst: { price: 5 },
				containsDigitalEntriesOnly: true
			};
			deepfreeze(payload);
			const expected = {
				type: actions.INIT_CARTSUMMARY,
				payload
			};
			const actual = actions.initCartSummary(payload);
			expect(actual).toEqual(expected);
		});

		it('has a sync action fetchCartSummaryRequest', () => {
			const expected = {
				type: actions.FETCH_CARTSUMMARY_REQUEST
			};
			deepfreeze(expected);
			const actual = actions.fetchCartSummaryRequest();
			expect(actual).toEqual(expected);
		});

		it('has a sync action fetchCartSummaryFailure', () => {
			const expected = {
				type: actions.FETCH_CARTSUMMARY_FAILURE,
				payload: {
					error: 'Oops'
				}
			};
			deepfreeze(expected);
			const actual = actions.fetchCartSummaryFailure('Oops');
			expect(actual).toEqual(expected);
		});

		it('has a sync action fetchCartSummarySuccess', () => {
			const payload = {
				subtotal: { price: 1 },
				deliveryFee: { price: 2 },
				total: { price: 3 },
				entries: entryList,
				voucher: { code: 'valid_code' },
				orderDiscounts: { price: 4 },
				gst: { price: 5 }
			};
			deepfreeze(payload);
			const expected = {
				type: actions.FETCH_CARTSUMMARY_SUCCESS,
				payload: {
					subtotal: { price: 1 },
					deliveryFee: { price: 2 },
					total: { price: 3 },
					entries: entryList,
					voucher: { code: 'valid_code' },
					orderDiscounts: { price: 4 },
					gst: { price: 5 }
				}
			};
			const actual = actions.fetchCartSummarySuccess(payload);
			expect(actual).toEqual(expected);
		});
	});

	describe('async action fetchCartSummary', () => {
		let dispatch;
		let fakePromise;

		let reject;
		let resolve;

		beforeEach(() => {
			dispatch = jasmine.createSpy('dispatch');
			fakePromise = jasmine.createSpyObj('fakePromise', ['then', 'catch']);
			cartSummary.and.returnValue(fakePromise);
			fakePromise.then.and.returnValue(fakePromise);
			fakePromise.catch.and.returnValue(fakePromise);
			actions.fetchCartSummary()(dispatch);
			reject = fakePromise.then.calls.argsFor(0)[1];
			resolve = fakePromise.then.calls.argsFor(0)[0];
		});

		it('initiates the request', () => {
			const expected = actions.fetchCartSummaryRequest();
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('calls the api cartSummary', () => {
			expect(cartSummary).toHaveBeenCalled();
		});

		it('will dispatch a failure on api error', () => {
			dispatch.calls.reset();
			const expected = actions.fetchCartSummaryFailure('Oops');
			reject('Oops');
			expect(dispatch).toHaveBeenCalledWith(expected);
			expect(navigate.redirectToBasket).not.toHaveBeenCalled();
		});

		it('will redirect to the basket page', () => {
			dispatch.calls.reset();
			reject({ code: 'ERR_CART_NO_ENTRIES' });
			expect(dispatch).not.toHaveBeenCalled();
			expect(navigate.redirectToBasket).toHaveBeenCalled();
		});

		it('will not dispatch a failure on disregard', () => {
			dispatch.calls.reset();
			reject('disregarded');
			expect(dispatch).not.toHaveBeenCalled();
		});

		it('will dispatch a success on api complete', () => {
			dispatch.calls.reset();
			const payload = {
				subtotal: { price: 1 },
				deliveryFee: { price: 2 },
				total: { price: 3 },
				entries: entryList
			};
			deepfreeze(payload);
			const expected = actions.fetchCartSummarySuccess(payload);
			resolve(payload);
			expect(dispatch).toHaveBeenCalledWith(expected);
		});
	});
});
