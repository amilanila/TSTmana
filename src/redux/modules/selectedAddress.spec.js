import deepfreeze from 'deep-freeze';
import { feedbackError, feedbackDismiss } from './feedback';

describe('SelectedAddress', () => {
	let reducer;
	let actions;
	let setAddress;
	let fetchDeliveryModes;

	beforeEach(() => {
		const api = jasmine.createSpyObj('api', ['setAddress']);
		const deliveryModes = jasmine.createSpyObj('deliveryModes', ['fetchDeliveryModes']);
		const moduleInjector = require('inject!./selectedAddress');
		const module = moduleInjector({
			'../../api/delivery': api,
			'./deliveryModes': deliveryModes
		});
		reducer = module.default;
		actions = module;
		setAddress = api.setAddress;
		fetchDeliveryModes = deliveryModes.fetchDeliveryModes;
	});

	describe('reducer', () => {
		it('has empty SelectedAddress for initial state', () => {
			const actual = reducer(undefined, {});
			const expected = {};
			expect(actual).toEqual(expected);
		});

		it('has a pending status for fetching', () => {
			const initialState = {};
			const action = {
				type: actions.SAVE_ADDRESS_REQUEST,
				payload: {
					address: {
						id: '1'
					},
					deliveryModeId: 'hd'
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: true,
				saveStatus: 'pending',
				address: {
					id: '1'
				},
				deliveryModeId: 'hd'
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('replaces the empty delivery address with whatever was fetched', () => {
			const initialState = {};
			const action = {
				type: actions.SAVE_ADDRESS_SUCCESS,
				payload: {
					address: '123 fake street'
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: false,
				saveStatus: 'success',
				address: '123 fake street'
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('replaces the current saved address with whatever was fetched', () => {
			const initialState = {
				isSaving: true,
				saveStatus: 'pending',
				address: '123 fake street'
			};
			const action = {
				type: actions.SAVE_ADDRESS_SUCCESS,
				payload: {
					address: '321 real street'
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: false,
				saveStatus: 'success',
				address: '321 real street'
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('leaves an empty address when the fetch failed', () => {
			const initialState = {
				isSaving: true,
				saveStatus: 'pending',
				address: '123 fake street'
			};
			const action = {
				type: actions.SAVE_ADDRESS_FAILURE
			};
			deepfreeze(action);
			deepfreeze(initialState);
			const expected = {
				isSaving: false,
				saveStatus: 'failure'
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('has an init action for refresh', () => {
			const initialState = {};
			const action = {
				type: actions.INIT_SAVEDADDRESS,
				payload: {
					address: '123 fake street'
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: true,
				saveStatus: 'init',
				address: '123 fake street'
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});
	});

	describe('sync actions', () => {
		it('has a sync action saveAddressRequest', () => {
			const expected = {
				type: actions.SAVE_ADDRESS_REQUEST,
				payload: {
					address: {
						id: '1'
					},
					deliveryModeId: 'hd'
				},
				meta: {
					feedback: feedbackDismiss()
				}
			};
			const actual = actions.saveAddressRequest({ id: '1' }, 'hd');
			expect(actual).toEqual(expected);
		});

		it('has a sync action saveAddressFailure', () => {
			const expected = {
				type: actions.SAVE_ADDRESS_FAILURE,
				payload: {
					error: 'Oops'
				},
				meta: {
					feedback: feedbackError('Error Message')
				}
			};
			const actual = actions.saveAddressFailure('Oops', 'Error Message');
			expect(actual).toEqual(expected);
		});

		it('has a sync action saveAddressSuccess', () => {
			const expected = {
				type: actions.SAVE_ADDRESS_SUCCESS,
				payload: {
					address: '123 fake street'
				},
				meta: {
					cart: { summaryForceUpdate: true }
				}
			};
			const actual = actions.saveAddressSuccess({
				deliveryAddress: '123 fake street',
				deliveryFeeChanged: true
			});
			expect(actual).toEqual(expected);
		});

		it('has a sync action saveAddressSuccess', () => {
			const expected = {
				type: actions.SAVE_ADDRESS_SUCCESS,
				payload: {
					address: '123 fake street'
				},
				meta: {
					cart: { summaryForceUpdate: false }
				}
			};
			const actual = actions.saveAddressSuccess({
				deliveryAddress: '123 fake street',
				deliveryFeeChanged: false
			});
			expect(actual).toEqual(expected);
		});

		it('has a sync action initSelectedAddress', () => {
			const expected = {
				type: actions.INIT_SAVEDADDRESS,
				payload: {
					address: '123 fake street'
				}
			};
			const actual = actions.initSelectedAddress('123 fake street');
			expect(actual).toEqual(expected);
		});
	});

	describe('async action saveAddress', () => {
		let dispatch;
		let fakePromise;
		let getState;
		let state;

		beforeEach(() => {
			fetchDeliveryModes.and.returnValue('call->fetchDeliveryModes');
			dispatch = jasmine.createSpy('dispatch');
			getState = jasmine.createSpy('getState');
			fakePromise = jasmine.createSpyObj('fakePromise', ['then', 'catch']);
			setAddress.and.returnValue(fakePromise);
			fakePromise.then.and.returnValue(fakePromise);
			fakePromise.catch.and.returnValue(fakePromise);
			const thunk = actions.saveAddress({ id: '1' }, 'hd');
			getState.and.callFake(() => state);
			state = {
				session: {
					info: { csrfToken: '~csrfToken~' }
				},
				selectedAddress: {
					address: {
						id: '1'
					}
				}
			};
			thunk(dispatch, getState);
		});

		it('initiates the request', () => {
			const expected = actions.saveAddressRequest(
				{ id: '1' },
				'hd'
			);
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will dispatch a failure on api error', () => {
			dispatch.calls.reset();
			const expected = actions.saveAddressFailure('Oops', jasmine.any(String));
			const reject = fakePromise.then.calls.argsFor(0)[1];
			reject('Oops');
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will dispatch a failure when args are missing', () => {
			dispatch.calls.reset();
			const thunk = actions.saveAddress();
			expect(() => thunk(dispatch)).toThrow();
		});

		it('will dispatch a success api complete', () => {
			dispatch.calls.reset();
			const payload = {
				deliveryAddress: {
					id: '1'
				},
				deliveryFeeChanged: false
			};
			deepfreeze(payload);
			const expected = actions.saveAddressSuccess(payload);
			const resolve = fakePromise.then.calls.argsFor(0)[0];
			resolve(payload);
			expect(dispatch).not.toHaveBeenCalledWith('call->fetchDeliveryModes');
			expect(fetchDeliveryModes).not.toHaveBeenCalled();
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will dispatch a success api complete with deliveyr fee change', () => {
			dispatch.calls.reset();
			const payload = {
				deliveryAddress: {
					id: '1'
				},
				deliveryFeeChanged: true
			};
			deepfreeze(payload);
			const expected = actions.saveAddressSuccess(payload);
			const resolve = fakePromise.then.calls.argsFor(0)[0];
			resolve(payload);
			expect(dispatch).toHaveBeenCalledWith('call->fetchDeliveryModes');
			expect(fetchDeliveryModes).toHaveBeenCalledWith({ displayFeeChangedFeedback: true });
			expect(dispatch).toHaveBeenCalledWith(expected);
		});
	});
});
