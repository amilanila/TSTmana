import deepfreeze from 'deep-freeze';
import { feedbackError, feedbackDismiss } from './feedback';
import localeText from '../../helpers/locale-text';

describe('Apply TMD', () => {
	let reducer;
	let actions;
	let applyTmdAPI;

	beforeEach(() => {
		const api = jasmine.createSpyObj('api', ['applyTmd']);
		const moduleInjector = require('inject!./teamMemberDiscount');
		const module = moduleInjector({
			'../../api/voucher': api
		});
		reducer = module.default;
		actions = module;
		applyTmdAPI = api.applyTmd;
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
				type: actions.APPLY_TMD_REQUEST,
				payload: {
					tmdNumber: 'valid_tmd'
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

		it('inits the TMD', () => {
			const initialState = {};
			const action = {
				type: actions.INIT_TMD,
				payload: {
					tmdNumber: 'valid_tmd'
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: false,
				applied: 'successful',
				tmdNumber: 'valid_tmd'
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('sets the tmd with whatever was saved', () => {
			const initialState = {};
			const action = {
				type: actions.APPLY_TMD_SUCCESS,
				payload: {
					tmdNumber: 'valid_tmd'
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: false,
				applied: 'successful',
				tmdNumber: 'valid_tmd'
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('replaces the existing tmd with whatever was saved', () => {
			const initialState = {
				isSaving: false,
				payload: {
					tmdNumber: 'invalid_tmd'
				}
			};
			const action = {
				type: actions.APPLY_TMD_SUCCESS,
				payload: {
					tmdNumber: 'valid_tmd'
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: false,
				applied: 'successful',
				tmdNumber: 'valid_tmd'
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('removes the tmd when save failed', () => {
			const initialState = {
				isSaving: false,
				payload: {
					tmdNumber: 'valid_tmd'
				}
			};
			const action = {
				type: actions.APPLY_TMD_FAILURE,
				payload: {
					error: {
						code: 'ERR_INVALID_TMD'
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

		it('removes the tmd when offline', () => {
			const initialState = {
				isSaving: false,
				payload: {
					tmdNumber: 'valid_tmd'
				}
			};
			const action = {
				type: actions.APPLY_TMD_FAILURE,
				payload: {
					error: 'Offline'
				}
			};
			deepfreeze(action);
			deepfreeze(initialState);
			const actual = reducer(initialState, action);
			const expected = {
				isSaving: false,
				applied: undefined
			};
			expect(actual).toEqual(expected);
		});
	});

	describe('sync actions', () => {
		it('has a sync action initTmd', () => {
			const payload = {
				tmdNumber: 'valid_tmd'
			};
			deepfreeze(payload);
			const expected = {
				type: actions.INIT_TMD,
				payload: {
					tmdNumber: 'valid_tmd'
				}
			};
			const actual = actions.initTmd(payload.tmdNumber);
			expect(actual).toEqual(expected);
		});

		it('has a sync action applyTmdRequest', () => {
			const payload = {
				tmdNumber: 'valid_tmd'
			};
			deepfreeze(payload);
			const expected = {
				type: actions.APPLY_TMD_REQUEST,
				payload,
				meta: {
					feedback: feedbackDismiss()
				}
			};
			const actual = actions.applyTmdRequest(payload.tmdNumber);
			expect(actual).toEqual(expected);
		});

		it('has a sync action applyTmdFailure', () => {
			const payload = {
				tmdNumber: 'invalid_tmd'
			};
			deepfreeze(payload);
			const expected = {
				type: actions.APPLY_TMD_FAILURE,
				payload: {
					error: 'Oops'
				},
				meta: {
					feedback: feedbackError('Error Message')
				}
			};
			const actual = actions.applyTmdFailure('Oops', 'Error Message');
			expect(actual).toEqual(expected);
		});

		it('has a sync action applyTmdSuccess', () => {
			const payload = {
				tmdNumber: 'valid_tmd'
			};
			deepfreeze(payload);
			const expected = {
				type: actions.APPLY_TMD_SUCCESS,
				payload: {
					tmdNumber: payload.tmdNumber
				},
				meta: { cart: { summaryForceUpdate: true } }
			};
			const actual = actions.applyTmdSuccess(payload.tmdNumber);
			expect(actual).toEqual(expected);
		});
	});

	describe('async action applyTmd', () => {
		let dispatch;
		let fakePromise;
		let getState;

		beforeEach(() => {
			dispatch = jasmine.createSpy('dispatch');
			getState = jasmine.createSpy('getState');
			fakePromise = jasmine.createSpyObj('fakePromise', ['then', 'catch']);
			applyTmdAPI.and.returnValue(fakePromise);
			fakePromise.then.and.returnValue(fakePromise);
			fakePromise.catch.and.returnValue(fakePromise);
			getState.and.returnValue({ session: { info: { csrfToken: '~csrfToken~' } } });
			const thunk = actions.applyTmd('valid_tmd');
			thunk(dispatch, getState);
		});

		it('initiates the request', () => {
			const expected = {
				type: actions.APPLY_TMD_REQUEST,
				payload: {
					tmdNumber: 'valid_tmd'
				},
				meta: {
					feedback: feedbackDismiss()
				}
			};
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('calls the api applyTmdAPI', () => {
			expect(applyTmdAPI).toHaveBeenCalledWith('valid_tmd', '~csrfToken~');
		});

		it('will dispatch a failure on api error', () => {
			dispatch.calls.reset();
			const expected = {
				type: actions.APPLY_TMD_FAILURE,
				payload: {
					error: 'Oops'
				},
				meta: {
					feedback: feedbackError(localeText('api-error-tmd'))
				}
			};
			const reject = fakePromise.then.calls.argsFor(0)[1];
			reject('Oops');
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will dispatch a failure on tmd being invalid', () => {
			dispatch.calls.reset();
			const expected = {
				type: actions.APPLY_TMD_FAILURE,
				payload: {
					error: { code: 'ERR_TMD_INVALID', message: 'Oops' }
				},
				meta: {
					feedback: feedbackError(localeText('invalid-tmd'))
				}
			};
			const reject = fakePromise.then.calls.argsFor(0)[1];
			reject({ code: 'ERR_TMD_INVALID', message: 'Oops' });
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will dispatch a success on api complete', () => {
			dispatch.calls.reset();
			const payload = 'valid_tmd';
			deepfreeze(payload);
			const expected = {
				type: actions.APPLY_TMD_SUCCESS,
				payload: {
					tmdNumber: 'valid_tmd'
				},
				meta: { cart: { summaryForceUpdate: true } }
			};
			const resolve = fakePromise.then.calls.argsFor(0)[0];
			resolve(payload);
			expect(dispatch).toHaveBeenCalledWith(expected);
		});
	});
});
