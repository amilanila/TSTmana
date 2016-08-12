import deepfreeze from 'deep-freeze';
import { feedbackError, feedbackDismiss } from './feedback';
import localeText from '../../helpers/locale-text';

describe('Apply Flybuys', () => {
	let reducer;
	let actions;
	let applyFlybuysAPI;
	let analytics;

	const mockTrackData = (...args) => ({ 'called->analyticsEvent->With': args });

	beforeEach(() => {
		const api = jasmine.createSpyObj('api', ['applyFlybuys']);
		const moduleInjector = require('inject!./flybuysApply');
		analytics = jasmine.createSpyObj('analytics', ['analyticsEvent']);
		const module = moduleInjector({
			'../../api/voucher': api,
			'./analytics': analytics
		});
		reducer = module.default;
		actions = module;
		applyFlybuysAPI = api.applyFlybuys;

		analytics.analyticsEvent.and.callFake(mockTrackData);
	});

	describe('reducer', () => {
		it('has an empty initial state', () => {
			const expected = {};
			const actual = reducer(undefined, {});
			expect(actual).toEqual(expected);
		});

		it('has a fetching status', () => {
			const initialState = {};
			const action = {
				type: actions.APPLY_FLYBUYS_REQUEST,
				payload: {
					code: 'valid_flybuys'
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: true
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('inits the flybuys', () => {
			const initialState = {};
			const action = {
				type: actions.INIT_FLYBUYS,
				payload: {
					code: 'valid_flybuys'
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: false,
				applied: 'successful',
				code: 'valid_flybuys'
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('sets the flybuys with whatever was saved', () => {
			const initialState = {};
			const action = {
				type: actions.APPLY_FLYBUYS_SUCCESS,
				payload: {
					code: 'valid_flybuys'
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: false,
				applied: 'successful',
				code: 'valid_flybuys'
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('replaces the existing flybuys with whatever was saved', () => {
			const initialState = {
				isSaving: true,
				applied: 'jibberish',
				code: 'invalid_flybuys'
			};
			const action = {
				type: actions.APPLY_FLYBUYS_SUCCESS,
				payload: {
					code: 'valid_flybuys'
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: false,
				applied: 'successful',
				code: 'valid_flybuys'
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('removes the flybuys when save failed', () => {
			const initialState = {
				isSaving: false,
				applied: 'successful',
				code: 'valid_flybuys'
			};
			const action = {
				type: actions.APPLY_FLYBUYS_FAILURE,
				payload: {
					error: {
						code: 'ERR_INVALID_FLYBUYS'
					}
				}
			};
			deepfreeze(action);
			deepfreeze(initialState);
			const actual = reducer(initialState, action);
			const expected = {
				isSaving: false,
				applied: 'rejected'
			};
			expect(actual).toEqual(expected);
		});
	});

	describe('sync actions', () => {
		it('has a sync action initFlybuys', () => {
			const payload = {
				code: 'valid_flybuys'
			};
			deepfreeze(payload);
			const expected = {
				type: actions.INIT_FLYBUYS,
				payload: {
					code: 'valid_flybuys'
				}
			};
			const actual = actions.initFlybuys(payload.code);
			expect(actual).toEqual(expected);
		});

		it('has a sync action applyFlybuysRequest', () => {
			const payload = {
				code: 'valid_flybuys'
			};
			deepfreeze(payload);
			const expected = {
				type: actions.APPLY_FLYBUYS_REQUEST,
				payload,
				meta: {
					feedback: feedbackDismiss()
				}
			};
			const actual = actions.applyFlybuysRequest(payload.code);
			expect(actual).toEqual(expected);
		});

		it('has a sync action applyFlybuysFailure', () => {
			const payload = {
				code: 'invalid_flybuys'
			};
			deepfreeze(payload);
			const expected = {
				type: actions.APPLY_FLYBUYS_FAILURE,
				payload: {
					error: 'Oops'
				},
				meta: {
					feedback: feedbackError('Error Message'),
					track: analytics.analyticsEvent('flybuys Collect', 'invalid number')
				}
			};
			const actual = actions.applyFlybuysFailure('Oops', 'Error Message');
			expect(actual).toEqual(expected);
		});

		it('has a sync action applyFlybuysSuccess', () => {
			const payload = {
				code: 'valid_flybuys'
			};
			deepfreeze(payload);
			const expected = {
				type: actions.APPLY_FLYBUYS_SUCCESS,
				payload: {
					code: payload.code
				},
				meta: {
					track: analytics.analyticsEvent('flybuys Collect', 'valid number')
				}
			};
			const actual = actions.applyFlybuysSuccess(payload.code);
			expect(actual).toEqual(expected);
		});
	});

	describe('async action saveFlybuys', () => {
		let dispatch;
		let fakePromise;
		let getState;

		beforeEach(() => {
			dispatch = jasmine.createSpy('dispatch');
			getState = jasmine.createSpy('getState');
			fakePromise = jasmine.createSpyObj('fakePromise', ['then', 'catch']);
			applyFlybuysAPI.and.returnValue(fakePromise);
			fakePromise.then.and.returnValue(fakePromise);
			fakePromise.catch.and.returnValue(fakePromise);
			getState.and.returnValue({ session: { info: { csrfToken: '~csrfToken~' } } });
			const thunk = actions.saveFlybuys('valid_flybuys');
			thunk(dispatch, getState);
		});

		it('initiates the request', () => {
			const expected = actions.applyFlybuysRequest('valid_flybuys');
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('calls the api applyFlybuysAPI', () => {
			expect(applyFlybuysAPI).toHaveBeenCalledWith('valid_flybuys', '~csrfToken~');
		});

		it('will dispatch a failure on api error', () => {
			dispatch.calls.reset();
			const expected = actions.applyFlybuysFailure('Oops', localeText('api-error-flybuys'));
			const reject = fakePromise.then.calls.argsFor(0)[1];
			reject('Oops');
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will dispatch a failure on flybuys being invalid', () => {
			dispatch.calls.reset();
			const error = { code: 'ERR_FLYBUYS_INVALID', message: 'Oops' };
			const expected = actions.applyFlybuysFailure(error,	localeText('invalid-flybuys'));
			const reject = fakePromise.then.calls.argsFor(0)[1];
			reject(error);
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will dispatch a success on api complete', () => {
			dispatch.calls.reset();
			const payload = 'valid_flybuys';
			deepfreeze(payload);
			const expected = actions.applyFlybuysSuccess(payload);
			const resolve = fakePromise.then.calls.argsFor(0)[0];
			resolve(payload);
			expect(dispatch).toHaveBeenCalledWith(expected);
		});
	});
});
