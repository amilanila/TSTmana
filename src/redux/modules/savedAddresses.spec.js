import deepfreeze from 'deep-freeze';
import { feedbackError, feedbackDismiss } from './feedback';

describe('savedAddresses', () => {
	let reducer;
	let actions;
	let savedAddresses;

	beforeEach(() => {
		const api = jasmine.createSpyObj('api', ['getSavedAddresses']);
		const moduleInjector = require('inject!./savedAddresses');
		const module = moduleInjector({
			'../../api/delivery': api
		});
		reducer = module.default;
		actions = module;
		savedAddresses = api.getSavedAddresses;
	});

	describe('reducer', () => {
		it('has empty savedAddresses for initial state', () => {
			const actual = reducer(undefined, {});
			const expected = {
				list: []
			};
			expect(actual).toEqual(expected);
		});

		it('has show address for new address', () => {
			const initialState = {};
			const action = {
				type: actions.NEW_ADDRESS
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				showAddressForm: true,
				isFetching: false,
				list: undefined
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('has a pending status for fetching', () => {
			const initialState = {};
			const action = {
				type: actions.FETCH_SAVEDADDRESS_REQUEST
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				showAddressForm: false,
				isFetching: true,
				list: []
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('replaces the empty list of delivery modes with whatever was fetched', () => {
			const initialState = {};
			const action = {
				type: actions.FETCH_SAVEDADDRESS_SUCCESS,
				payload: {
					savedAddresses: ['address1', 'address2', 'address3']
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				showAddressForm: false,
				isFetching: false,
				list: ['address1', 'address2', 'address3']
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('replaces the current list of saved addresses with whatever was fetched', () => {
			const initialState = {
				showAddressForm: false,
				isFetching: true,
				list: ['address2', 'address3', 'address1']
			};
			const action = {
				type: actions.FETCH_SAVEDADDRESS_SUCCESS,
				payload: {
					savedAddresses: ['address1', 'address2', 'address3']
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				showAddressForm: false,
				isFetching: false,
				list: ['address1', 'address2', 'address3']
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('leaves an empty list with the fetch failed', () => {
			const initialState = {
				showAddressForm: false,
				isFetching: true,
				list: ['address1', 'address2', 'address3']
			};
			const action = {
				type: actions.FETCH_SAVEDADDRESS_FAILURE
			};
			deepfreeze(action);
			deepfreeze(initialState);
			const expected = {
				showAddressForm: false,
				isFetching: false,
				list: []
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});
	});

	describe('sync actions', () => {
		it('has a sync action fetchSavedAddressRequest', () => {
			const state = { selectedDeliveryMode: { mode: { id: 'hd' } } };
			const expected = {
				type: actions.FETCH_SAVEDADDRESS_REQUEST,
				payload: {
					deliveryMode: {
						selectedDeliveryMode: {
							mode: {
								id: 'hd'
							}
						}
					}
				},
				meta: {
					feedback: feedbackDismiss()
				}
			};
			const actual = actions.fetchSavedAddressRequest(state);
			expect(actual).toEqual(expected);
		});

		it('has a sync action fetchSavedAddressFailure', () => {
			const expected = {
				type: actions.FETCH_SAVEDADDRESS_FAILURE,
				payload: {
					error: 'Oops'
				},
				meta: {
					feedback: feedbackError('Error Message')
				}
			};
			const actual = actions.fetchSavedAddressFailure('Oops', 'Error Message');
			expect(actual).toEqual(expected);
		});

		it('has a sync action fetchSavedAddressSuccess', () => {
			const expected = {
				type: actions.FETCH_SAVEDADDRESS_SUCCESS,
				payload: {
					savedAddresses: ['address1', 'address2', 'address3']
				}
			};
			const actual = actions.fetchSavedAddressSuccess(['address1', 'address2', 'address3']);
			expect(actual).toEqual(expected);
		});

		it('has a sync action newAddress', () => {
			const expected = {
				type: actions.NEW_ADDRESS
			};
			const actual = actions.newAddress();
			expect(actual).toEqual(expected);
		});
	});

	describe('async action fetchSavedAddresses', () => {
		let dispatch;
		let fakePromise;

		beforeEach(() => {
			dispatch = jasmine.createSpy('dispatch');
			fakePromise = jasmine.createSpyObj('fakePromise', ['then', 'catch']);
			savedAddresses.and.returnValue(fakePromise);
			fakePromise.then.and.returnValue(fakePromise);
			fakePromise.catch.and.returnValue(fakePromise);
			const thunk = actions.fetchSavedAddresses('hd');
			thunk(dispatch);
		});

		it('initiates the request', () => {
			const expected = {
				type: actions.FETCH_SAVEDADDRESS_REQUEST,
				payload: {
					deliveryMode: 'hd'
				},
				meta: {
					feedback: feedbackDismiss()
				}
			};
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will dispatch a failure on api error', () => {
			dispatch.calls.reset();
			const expected = {
				type: actions.FETCH_SAVEDADDRESS_FAILURE,
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

		it('will failure when delivery mode is undefined', () => {
			dispatch.calls.reset();
			const thunk = actions.fetchSavedAddresses();
			expect(() => thunk(dispatch)).toThrow();
		});

		it('will dispatch a success on api complete', () => {
			dispatch.calls.reset();
			const expected = {
				type: actions.FETCH_SAVEDADDRESS_SUCCESS,
				payload: {
					savedAddresses: ['address1', 'address2', 'address3']
				}
			};
			const resolve = fakePromise.then.calls.argsFor(0)[0];
			resolve(['address1', 'address2', 'address3']);
			expect(dispatch).toHaveBeenCalledWith(expected);
		});
	});
});
