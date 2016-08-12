import deepfreeze from 'deep-freeze';
import { feedbackError, feedbackDismiss } from './feedback';

describe('paymentMethods', () => {
	let reducer;
	let actions;
	let applicableMethods;

	beforeEach(() => {
		const api = jasmine.createSpyObj('api', ['applicableMethods']);
		const moduleInjector = require('inject!./paymentMethods');
		const module = moduleInjector({
			'../../api/payment': api
		});
		reducer = module.default;
		actions = module;
		applicableMethods = api.applicableMethods;
	});

	describe('reducer', () => {
		it('has a empty list for initial state', () => {
			const actual = reducer(undefined, {});
			const expected = {
				list: []
			};
			expect(actual).toEqual(expected);
		});

		it('has a pending status for fetching', () => {
			const initialState = {};
			const action = {
				type: actions.FETCH_PAYMENTMETHODS_REQUEST
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: true,
				list: []
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('replaces the empty list of payment methods with whatever was fetched', () => {
			const initialState = {};
			const action = {
				type: actions.FETCH_PAYMENTMETHODS_SUCCESS,
				payload: {
					paymentMethods: ['p1', 'p2', 'p3']
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: false,
				list: ['p1', 'p2', 'p3']
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('replaces the current list of payment methods with whatever was fetched', () => {
			const initialState = {
				isFetching: true,
				list: ['p1', 'p2', 'p3']
			};
			const action = {
				type: actions.FETCH_PAYMENTMETHODS_SUCCESS,
				payload: {
					paymentMethods: ['p1', 'p2']
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: false,
				list: ['p1', 'p2']
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('leaves an empty list with the fetch failed', () => {
			const initialState = {
				isFetching: true,
				list: ['p1', 'p2', 'p3']
			};
			const action = {
				type: actions.FETCH_PAYMENTMETHODS_FAILURE
			};
			deepfreeze(action);
			deepfreeze(initialState);
			const expected = {
				isFetching: false,
				list: []
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});
	});

	describe('sync actions', () => {
		it('has a sync action fetchPaymentMethodsRequest', () => {
			const expected = {
				type: actions.FETCH_PAYMENTMETHODS_REQUEST,
				meta: {
					feedback: feedbackDismiss()
				}
			};
			const actual = actions.fetchPaymentMethodsRequest();
			expect(actual).toEqual(expected);
		});

		it('has a sync action fetchPaymentMethodsFailure', () => {
			const expected = {
				type: actions.FETCH_PAYMENTMETHODS_FAILURE,
				payload: {
					error: 'Oops'
				},
				meta: {
					feedback: feedbackError('Error Message')
				}
			};
			const actual = actions.fetchPaymentMethodsFailure('Oops', 'Error Message');
			expect(actual).toEqual(expected);
		});

		it('has a sync action fetchPaymentMethodsSuccess', () => {
			const expected = {
				type: actions.FETCH_PAYMENTMETHODS_SUCCESS,
				payload: {
					paymentMethods: [1, 2, 3]
				}
			};
			const actual = actions.fetchPaymentMethodsSuccess([1, 2, 3]);
			expect(actual).toEqual(expected);
		});
	});

	describe('async action fetchPaymentMethods', () => {
		let dispatch;
		let fakePromise;

		beforeEach(() => {
			dispatch = jasmine.createSpy('dispatch');
			fakePromise = jasmine.createSpyObj('fakePromise', ['then', 'catch']);
			applicableMethods.and.returnValue(fakePromise);
			fakePromise.then.and.returnValue(fakePromise);
			fakePromise.catch.and.returnValue(fakePromise);
			const thunk = actions.fetchPaymentMethods();
			thunk(dispatch);
		});

		it('initiates the request', () => {
			const expected = {
				type: actions.FETCH_PAYMENTMETHODS_REQUEST,
				meta: {
					feedback: feedbackDismiss()
				}
			};
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will dispatch a failure on api error', () => {
			dispatch.calls.reset();
			const expected = {
				type: actions.FETCH_PAYMENTMETHODS_FAILURE,
				payload: {
					error: 'Oops'
				},
				meta: {
					feedback: feedbackError(jasmine.any(String))
				}
			};
			const reject = fakePromise.then.calls.argsFor(0)[1];
			reject('Oops');
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will dispatch a success on api complete', () => {
			dispatch.calls.reset();
			const expected = {
				type: actions.FETCH_PAYMENTMETHODS_SUCCESS,
				payload: {
					paymentMethods: [1, 2, 3]
				}
			};
			const resolve = fakePromise.then.calls.argsFor(0)[0];
			resolve([1, 2, 3]);
			expect(dispatch).toHaveBeenCalledWith(expected);
		});
	});
});
