import deepfreeze from 'deep-freeze';
import { feedbackError, feedbackDismiss } from './feedback';

describe('selectedDeliveryMode', () => {
	let reducer;
	let actions;
	let setMode;
	let analytics;

	const mockTrackData = (...args) => ({ 'called->analyticsCheckoutOption->With': args });

	beforeEach(() => {
		const api = jasmine.createSpyObj('api', ['setMode']);
		analytics = jasmine.createSpyObj('analytics', ['analyticsCheckoutOption']);
		const moduleInjector = require('inject!./selectedDeliveryMode');
		const module = moduleInjector({
			'../../api/delivery': api,
			'./analytics': analytics
		});
		reducer = module.default;
		actions = module;
		setMode = api.setMode;

		analytics.analyticsCheckoutOption.and.callFake(mockTrackData);
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
				type: actions.SAVE_DELIVERYMODE_REQUEST,
				payload: {
					intendedMode: 'click-and-collect'
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: true,
				saveStatus: 'pending',
				mode: {
					id: 'click-and-collect'
				}
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('inits the selected delivery modes', () => {
			const initialState = {};
			const action = {
				type: actions.INIT_DELIVERYMODE,
				payload: {
					deliveryMode: {
						name: 'Click + Collect',
						deliveryToStore: true,
						id: 'click-and-collect'
					}
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: false,
				saveStatus: 'init',
				mode: {
					name: 'Click + Collect',
					deliveryToStore: true,
					id: 'click-and-collect'
				}
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('sets the selected delivery modes with whatever was saved', () => {
			const initialState = {};
			const action = {
				type: actions.SAVE_DELIVERYMODE_SUCCESS,
				payload: {
					deliveryMode: {
						name: 'Click + Collect',
						deliveryToStore: true,
						id: 'click-and-collect'
					}
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: false,
				saveStatus: 'success',
				mode: {
					name: 'Click + Collect',
					deliveryToStore: true,
					id: 'click-and-collect'
				}
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('replaces the existing selected delivery modes with whatever was saved', () => {
			const initialState = {
				isSaving: true,
				saveStatus: 'pending',
				mode: {
					name: 'Click + Collect',
					deliveryToStore: true,
					id: 'click-and-collect'
				}
			};
			const action = {
				type: actions.SAVE_DELIVERYMODE_SUCCESS,
				payload: {
					deliveryMode: {
						name: 'Home Delivery',
						deliveryToStore: false,
						id: 'home-delivery'
					}
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: false,
				saveStatus: 'success',
				mode: {
					name: 'Home Delivery',
					deliveryToStore: false,
					id: 'home-delivery'
				}
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('removes selected delivery mode when save failed', () => {
			const initialState = {
				isSaving: false,
				saveStatus: 'success',
				mode: {
					name: 'Click + Collect',
					deliveryToStore: true,
					id: 'click-and-collect'
				}
			};
			const action = {
				type: actions.SAVE_DELIVERYMODE_FAILURE
			};
			deepfreeze(action);
			deepfreeze(initialState);
			const actual = reducer(initialState, action);
			const expected = {
				isSaving: false,
				saveStatus: 'failure'
			};
			expect(actual).toEqual(expected);
		});
	});

	describe('sync actions', () => {
		it('has a sync action initDeliveryMode', () => {
			const payload = {
				id: 'cnc',
				name: 'Click + Collect'
			};
			deepfreeze(payload);
			const expected = {
				type: actions.INIT_DELIVERYMODE,
				payload: {
					deliveryMode: payload
				}
			};
			const actual = actions.initDeliveryMode(payload);
			expect(actual).toEqual(expected);
		});

		it('has a sync action saveDeliveryModeRequest', () => {
			const payload = {
				id: 'cnc'
			};
			deepfreeze(payload);
			const expected = {
				type: actions.SAVE_DELIVERYMODE_REQUEST,
				payload: {
					intendedMode: 'cnc'
				},
				meta: {
					feedback: feedbackDismiss()
				}
			};
			const actual = actions.saveDeliveryModeRequest('cnc');
			expect(actual).toEqual(expected);
		});

		it('has a sync action saveDeliveryModeFailure', () => {
			const expected = {
				type: actions.SAVE_DELIVERYMODE_FAILURE,
				payload: {
					error: 'Oops'
				},
				meta: {
					feedback: feedbackError('Error Message')
				}
			};
			const actual = actions.saveDeliveryModeFailure('Oops', 'Error Message');
			expect(actual).toEqual(expected);
		});

		it('has a sync action saveDeliveryModeSuccess', () => {
			const payload = {
				id: 'cnc',
				name: 'Click + Collect'
			};
			deepfreeze(payload);
			const expected = {
				type: actions.SAVE_DELIVERYMODE_SUCCESS,
				payload: {
					deliveryMode: payload
				},
				meta: {
					cart: { summaryForceUpdate: true },
					track: mockTrackData(2, payload.id)
				}
			};
			const actual = actions.saveDeliveryModeSuccess(payload);
			expect(actual).toEqual(expected);
		});
	});

	describe('async action saveDeliveryMode', () => {
		let fakePromise;
		let resolve;
		let reject;

		let dispatch;
		let getState;
		let state;

		beforeEach(() => {
			dispatch = jasmine.createSpy('dispatch');
			getState = jasmine.createSpy('getState');
			fakePromise = jasmine.createSpyObj('fakePromise', ['then', 'catch']);
			setMode.and.returnValue(fakePromise);
			fakePromise.then.and.returnValue(fakePromise);
			fakePromise.catch.and.returnValue(fakePromise);
			getState.and.callFake(() => state);
			state = {
				session: {
					info: { csrfToken: '~csrfToken~' }
				},
				selectedDeliveryMode: {
					mode: {}
				}
			};
			const thunk = actions.saveDeliveryMode('cnc');
			thunk(dispatch, getState);
			resolve = fakePromise.then.calls.argsFor(0)[0];
			reject = fakePromise.then.calls.argsFor(0)[1];
		});

		it('initiates the request', () => {
			const expected = {
				type: actions.SAVE_DELIVERYMODE_REQUEST,
				payload: {
					intendedMode: 'cnc'
				},
				meta: {
					feedback: feedbackDismiss()
				}
			};
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('calls the api setMode', () => {
			const expected = ['cnc', '~csrfToken~'];
			expect(setMode).toHaveBeenCalledWith(...expected);
		});

		it('will dispatch a failure on api error', () => {
			dispatch.calls.reset();
			const expected = {
				type: actions.SAVE_DELIVERYMODE_FAILURE,
				payload: {
					error: 'Oops'
				},
				meta: {
					feedback: feedbackError(jasmine.any(String))
				}
			};
			reject('Oops');
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will dispatch a success on api complete', () => {
			dispatch.calls.reset();
			state.selectedDeliveryMode.mode.id = 'cnc';
			const payload = {
				id: 'cnc',
				name: 'Click + Collect'
			};
			deepfreeze(payload);
			const expected = {
				type: actions.SAVE_DELIVERYMODE_SUCCESS,
				payload: {
					deliveryMode: payload
				},
				meta: {
					cart: { summaryForceUpdate: true },
					track: mockTrackData(2, payload.id)
				}
			};
			resolve(payload);
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will not dispatch a success on api complete when current mode is different', () => {
			dispatch.calls.reset();
			state.selectedDeliveryMode.mode.id = 'hd';
			const payload = {
				id: 'cnc',
				name: 'Click + Collect'
			};
			resolve(payload);
			expect(dispatch).not.toHaveBeenCalledWith();
		});
	});
});
