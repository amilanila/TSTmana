import deepfreeze from 'deep-freeze';
import { feedbackError, feedbackDismiss, feedbackInformation } from './feedback';

describe('deliveryModes', () => {
	let reducer;
	let actions;
	let applicableModes;

	const mockTrackData = (...args) => args;

	beforeEach(() => {
		const api = jasmine.createSpyObj('api', ['applicableModes']);
		const analytics = jasmine.createSpyObj('analytics', ['analyticsCheckoutStep']);
		const moduleInjector = require('inject!./deliveryModes');
		const module = moduleInjector({
			'../../api/delivery': api,
			'./analytics': analytics
		});
		reducer = module.default;
		actions = module;
		applicableModes = api.applicableModes;
		analytics.analyticsCheckoutStep.and.callFake(mockTrackData);
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
			const initialState = { list: [] };
			const action = {
				type: actions.FETCH_DELIVERYMODES_REQUEST
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: true,
				fetchStatus: 'pending',
				list: []
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('replaces the empty list of delivery modes with whatever was fetched', () => {
			const initialState = { list: [] };
			const action = {
				type: actions.FETCH_DELIVERYMODES_SUCCESS,
				payload: {
					deliveryModes: ['del1', 'del2', 'del3']
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: false,
				fetchStatus: 'success',
				list: ['del1', 'del2', 'del3']
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('replaces the current list of delivery modes with whatever was fetched', () => {
			const initialState = {
				isFetching: true,
				fetchStatus: 'pending',
				list: ['del2', 'del3', 'del1']
			};
			const action = {
				type: actions.FETCH_DELIVERYMODES_SUCCESS,
				payload: {
					deliveryModes: ['del1', 'del2', 'del3']
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: false,
				fetchStatus: 'success',
				list: ['del1', 'del2', 'del3']
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('leaves an empty list with the fetch failed', () => {
			const initialState = {
				isFetching: true,
				fetchStatus: 'pending',
				list: ['del2', 'del3', 'del1']
			};
			const action = {
				type: actions.FETCH_DELIVERYMODES_FAILURE
			};
			deepfreeze(action);
			deepfreeze(initialState);
			const expected = {
				isFetching: false,
				fetchStatus: 'failure',
				list: []
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});
	});

	describe('sync actions', () => {
		it('has a sync action fetchDeliveryModesRequest', () => {
			const expected = {
				type: actions.FETCH_DELIVERYMODES_REQUEST,
				meta: {
					feedback: feedbackDismiss()
				}
			};
			const actual = actions.fetchDeliveryModesRequest();
			expect(actual).toEqual(expected);
		});

		it('has a sync action fetchDeliveryModesFailure', () => {
			const expected = {
				type: actions.FETCH_DELIVERYMODES_FAILURE,
				payload: {
					error: 'Oops'
				},
				meta: {
					feedback: feedbackError('Error Message')
				}
			};
			const actual = actions.fetchDeliveryModesFailure('Oops', 'Error Message');
			expect(actual).toEqual(expected);
		});

		it('has a sync action fetchDeliveryModesSuccess', () => {
			const expected = {
				type: actions.FETCH_DELIVERYMODES_SUCCESS,
				payload: {
					deliveryModes: [1, 2, 3]
				},
				meta: {
					track: mockTrackData(2),
					feedback: false
				}
			};
			const actual = actions.fetchDeliveryModesSuccess([1, 2, 3]);
			expect(actual).toEqual(expected);
		});

		it('has a sync action fetchDeliveryModesSuccess with feedback side effect', () => {
			const expected = {
				type: actions.FETCH_DELIVERYMODES_SUCCESS,
				payload: {
					deliveryModes: [1, 2, 3]
				},
				meta: {
					track: mockTrackData(2),
					feedback: feedbackInformation(jasmine.any(String))
				}
			};
			const actual = actions.fetchDeliveryModesSuccess([1, 2, 3], true);
			expect(actual).toEqual(expected);
		});
	});

	describe('async action fetchDeliveryModes', () => {
		let dispatch;
		let fakePromise;

		beforeEach(() => {
			dispatch = jasmine.createSpy('dispatch');
			fakePromise = jasmine.createSpyObj('fakePromise', ['then', 'catch']);
			applicableModes.and.returnValue(fakePromise);
			fakePromise.then.and.returnValue(fakePromise);
			fakePromise.catch.and.returnValue(fakePromise);
		});

		it('initiates the request', () => {
			actions.fetchDeliveryModes()(dispatch);
			const expected = actions.fetchDeliveryModesRequest();
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will dispatch a failure on api error', () => {
			actions.fetchDeliveryModes()(dispatch);
			dispatch.calls.reset();
			const expected = actions.fetchDeliveryModesFailure('Oops', jasmine.any(String));
			const reject = fakePromise.then.calls.argsFor(0)[1];
			reject('Oops');
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will dispatch a success on api complete', () => {
			actions.fetchDeliveryModes()(dispatch);
			dispatch.calls.reset();
			const expected = actions.fetchDeliveryModesSuccess([1, 2, 3]);
			const resolve = fakePromise.then.calls.argsFor(0)[0];
			resolve([1, 2, 3]);
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will dispatch a success on api complete with side effects', () => {
			actions.fetchDeliveryModes(true)(dispatch);
			dispatch.calls.reset();
			const expected = actions.fetchDeliveryModesSuccess([1, 2, 3], true);
			const resolve = fakePromise.then.calls.argsFor(0)[0];
			resolve([1, 2, 3]);
			expect(dispatch).toHaveBeenCalledWith(expected);
		});
	});
});
