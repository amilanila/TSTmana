import deepfreeze from 'deep-freeze';
import { feedbackError, feedbackDismiss } from './feedback';
import localeText from '../../helpers/locale-text';

describe('applyVoucher', () => {
	let reducer;
	let actions;
	let applyVoucher;
	let removeVoucher;

	beforeEach(() => {
		const api = jasmine.createSpyObj('api', ['applyVoucher', 'removeVoucher']);
		const moduleInjector = require('inject!./voucher');
		const module = moduleInjector({
			'../../api/voucher': api
		});
		reducer = module.default;
		actions = module;
		applyVoucher = api.applyVoucher;
		removeVoucher = api.removeVoucher;
	});

	describe('reducer', () => {
		it('has an empty initial state', () => {
			const expected = {};
			const actual = reducer(undefined, {});
			expect(actual).toEqual(expected);
		});

		it('has a pending status during a voucher request', () => {
			const initialState = {};
			const action = {
				type: actions.SAVE_VOUCHER_REQUEST
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: true
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('has a success status for when a voucher request succeeds', () => {
			const voucher = {};
			const initialState = {};
			const action = {
				type: actions.SAVE_VOUCHER_SUCCESS,
				payload: {
					voucher
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: false,
				applied: 'successful',
				code: undefined
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('replaces the failure status with a success status when a voucher request succeeds', () => {
			const voucher = {};
			const initialState = {
				isSaving: false,
				applied: undefined,
				code: ''
			};
			const action = {
				type: actions.SAVE_VOUCHER_SUCCESS,
				payload: {
					voucher
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: false,
				applied: 'successful',
				code: undefined
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('has a undefined applied status after bad error', () => {
			const initialState = {};
			const action = {
				type: actions.SAVE_VOUCHER_FAILURE,
				payload: { error: 'TypeError' }
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: false,
				applied: undefined
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('has a failure status after a failed apply voucher request', () => {
			const initialState = {};
			const action = {
				type: actions.SAVE_VOUCHER_FAILURE,
				payload: { error: { code: 'ERR_VOUCHER_CONDITIONS_NOT_MET' } }
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: false,
				applied: 'rejected'
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('has a failure status is a general server error occurred, ' +
			'after an apply voucher request', () => {
			const initialState = {};
			const action = {
				type: actions.SAVE_VOUCHER_FAILURE,
				payload: { error: { code: 'ANOTHER_ERROR' } }
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: false,
				applied: undefined
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('has an init state', () => {
			const initialState = {};
			const action = {
				type: actions.INIT_VOUCHER,
				payload: {
					voucher: {
						code: 'test_voucher'
					}
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: false,
				applied: 'successful',
				code: 'test_voucher'
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('has a remove requested state', () => {
			const initialState = {
				isSaving: false,
				applied: 'successful',
				code: 'test_voucher'
			};
			const action = {
				type: actions.REMOVE_VOUCHER_REQUEST
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: true,
				applied: 'successful',
				code: 'test_voucher'
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});
		it('has a remove successful state', () => {
			const initialState = {
				isSaving: false,
				applied: 'successful',
				code: 'test_voucher'
			};
			const action = {
				type: actions.REMOVE_VOUCHER_SUCCESS
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});
		it('has a remove failed state', () => {
			const initialState = {
				isSaving: false,
				applied: 'successful',
				code: 'test_voucher'
			};
			const action = {
				type: actions.REMOVE_VOUCHER_FAILURE
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const actual = reducer(initialState, action);
			expect(actual).toEqual(initialState);
		});
	});

	describe('sync actions', () => {
		it('has a sync action saveVoucherRequest', () => {
			const expected = {
				type: actions.SAVE_VOUCHER_REQUEST,
				payload: { code: undefined },
				meta: { feedback: feedbackDismiss() }
			};
			const actual = actions.saveVoucherRequest();
			expect(actual).toEqual(expected);
		});

		it('has a sync action saveVoucherFailure', () => {
			const expected = {
				type: actions.SAVE_VOUCHER_FAILURE,
				payload: { error: 'Doh!' },
				meta: { feedback: feedbackError('error msg') }
			};
			const actual = actions.saveVoucherFailure('Doh!', 'error msg');
			expect(actual).toEqual(expected);
		});

		it('has a sync action saveVoucherSuccess', () => {
			const voucher = { code: 'VALID_CODE' };
			const payload = {
				voucher
			};
			deepfreeze(payload);
			const expected = {
				type: actions.SAVE_VOUCHER_SUCCESS,
				payload,
				meta: {
					cart: { summaryForceUpdate: true }
				}
			};
			const actual = actions.saveVoucherSuccess(payload.voucher);
			expect(actual).toEqual(expected);
		});

		it('has a sync action initVoucher', () => {
			const voucher = { code: 'VALID_CODE' };
			const payload = {
				voucher
			};
			deepfreeze(payload);
			const expected = {
				type: actions.INIT_VOUCHER,
				payload
			};
			const actual = actions.initVoucher(payload.voucher);
			expect(actual).toEqual(expected);
		});

		it('has a sync action removeVoucherRequest', () => {
			const expected = {
				type: actions.REMOVE_VOUCHER_REQUEST,
				meta: { feedback: feedbackDismiss() }
			};
			const actual = actions.removeVoucherRequest();
			expect(actual).toEqual(expected);
		});

		it('has a sync action removeVoucherSuccess', () => {
			const expected = {
				type: actions.REMOVE_VOUCHER_SUCCESS,
				meta: {
					cart: { summaryForceUpdate: true }
				}
			};
			const actual = actions.removeVoucherSuccess();
			expect(actual).toEqual(expected);
		});

		it('has a sync action removeVoucherFailure', () => {
			const expected = {
				type: actions.REMOVE_VOUCHER_FAILURE,
				payload: { error: 'uh oh' },
				meta: {
					feedback: feedbackError('error message')
				}
			};
			const actual = actions.removeVoucherFailure('uh oh', 'error message');
			expect(actual).toEqual(expected);
		});
	});

	describe('async action saveVoucher', () => {
		let dispatch;
		let fakePromise;
		let getState;
		let state;
		let VALID_CODE;

		beforeEach(() => {
			dispatch = jasmine.createSpy('dispatch');
			getState = jasmine.createSpy('getState');
			fakePromise = jasmine.createSpyObj('fakePromise', ['then', 'catch']);
			applyVoucher.and.returnValue(fakePromise);
			fakePromise.then.and.returnValue(fakePromise);
			fakePromise.catch.and.returnValue(fakePromise);
			getState.and.callFake(() => state);
			state = {
				session: {
					info: { csrfToken: '~csrfToken~' }
				}
			};
			VALID_CODE = 'VALID_CODE';
			const thunk = actions.saveVoucher(VALID_CODE);
			thunk(dispatch, getState);
		});

		it('initiates the request', () => {
			const expected = {
				type: actions.SAVE_VOUCHER_REQUEST,
				payload: { code: 'VALID_CODE' },
				meta: {
					feedback: feedbackDismiss()
				}
			};
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('calls the api applyVoucher', () => {
			const expected = [VALID_CODE, '~csrfToken~'];
			expect(applyVoucher).toHaveBeenCalledWith(...expected);
		});

		it('will return an API if no error code is provided', () => {
			dispatch.calls.reset();
			const expected = {
				type: actions.SAVE_VOUCHER_FAILURE,
				payload: { error: 'Doh!' },
				meta: { feedback: feedbackError(localeText('api-error-promo')) }
			};
			const reject = fakePromise.then.calls.argsFor(0)[1];

			reject('Doh!');
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will still dispatch feedbackError if no error object is provided', () => {
			dispatch.calls.reset();
			const expected = {
				type: actions.SAVE_VOUCHER_FAILURE,
				payload: { error: undefined },
				meta: { feedback: feedbackError(localeText('api-error-promo')) }
			};
			const reject = fakePromise.then.calls.argsFor(0)[1];

			reject();
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will give an error when conditions aren\'t met', () => {
			dispatch.calls.reset();
			const expected = {
				type: actions.SAVE_VOUCHER_FAILURE,
				payload: { error: { message: 'Doh!', code: 'ERR_VOUCHER_CONDITIONS_NOT_MET' } },
				meta: { feedback: feedbackError(localeText('voucher-conditions')) }
			};
			const reject = fakePromise.then.calls.argsFor(0)[1];

			reject({ message: 'Doh!', code: 'ERR_VOUCHER_CONDITIONS_NOT_MET' });
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will give an error when voucher doesn\'t exist', () => {
			dispatch.calls.reset();
			const expected = {
				type: actions.SAVE_VOUCHER_FAILURE,
				payload: { error: { message: 'Doh!', code: 'ERR_VOUCHER_DOES_NOT_EXIST' } },
				meta: { feedback: feedbackError(localeText('voucher-does-not-exist')) }
			};
			const reject = fakePromise.then.calls.argsFor(0)[1];

			reject({ message: 'Doh!', code: 'ERR_VOUCHER_DOES_NOT_EXIST' });
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will dispatch a success on api complete', () => {
			dispatch.calls.reset();
			const payload = {
				code: 'VALID_CODE'
			};
			deepfreeze(payload);
			const expected = actions.saveVoucherSuccess(payload);
			const resolve = fakePromise.then.calls.argsFor(0)[0];
			resolve(payload);
			expect(dispatch).toHaveBeenCalledWith(expected);
		});
	});

	describe('async action removeVoucher', () => {
		let dispatch;
		let fakePromise;
		let getState;
		let state;

		beforeEach(() => {
			dispatch = jasmine.createSpy('dispatch');
			getState = jasmine.createSpy('getState');
			fakePromise = jasmine.createSpyObj('fakePromise', ['then', 'catch']);
			removeVoucher.and.returnValue(fakePromise);
			fakePromise.then.and.returnValue(fakePromise);
			fakePromise.catch.and.returnValue(fakePromise);
			getState.and.callFake(() => state);
			state = {
				session: {
					info: { csrfToken: '~csrfToken~' }
				}
			};
			const thunk = actions.removeVoucher();
			thunk(dispatch, getState);
		});

		it('initiates the request', () => {
			expect(dispatch).toHaveBeenCalledWith(actions.removeVoucherRequest());
		});

		it('calls the api removeVoucher', () => {
			expect(removeVoucher).toHaveBeenCalledWith('~csrfToken~');
		});

		it('will return dispatch a failure when success is not returned', () => {
			dispatch.calls.reset();
			const expected = actions.removeVoucherFailure('Doh!',
				localeText('voucher-remove-failure'));
			const reject = fakePromise.then.calls.argsFor(0)[1];
			reject('Doh!');
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will dispatch a success on api complete', () => {
			dispatch.calls.reset();
			const expected = actions.removeVoucherSuccess();
			const resolve = fakePromise.then.calls.argsFor(0)[0];
			resolve({ success: true });
			expect(dispatch).toHaveBeenCalledWith(expected);
		});
	});
});
