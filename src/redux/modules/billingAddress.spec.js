import deepfreeze from 'deep-freeze';
import { feedbackError, feedbackDismiss } from './feedback';
import localeText from '../../helpers/locale-text';

describe('Billing Address', () => {
	let reducer;
	let actions;
	let setAddress;

	beforeEach(() => {
		const api = jasmine.createSpyObj('api', ['setAddress']);
		const moduleInjector = require('inject!./billingAddress');
		const module = moduleInjector({
			'../../api/billing': api
		});
		reducer = module.default;
		actions = module;
		setAddress = api.setAddress;
	});

	describe('reducer', () => {
		it('has an empty initial state', () => {
			const expected = {};
			const actual = reducer(undefined, {});
			expect(actual).toEqual(expected);
		});

		it('can be initialised', () => {
			const initialState = {};
			const action = {
				type: actions.INIT_BILLINGADDRESS,
				payload: {
					billingAddress: '123 Fake St'
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: false,
				billingAddress: '123 Fake St'
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('can be cleared', () => {
			const initialState = {
				isSaving: false,
				billingAddress: {
					firstName: 'Test',
					lastName: 'Tester',
					line1: '123 Fake Street'
				}
			};
			const action = {
				type: actions.CLEAR_BILLINGADDRESS
			};
			deepfreeze(action);
			deepfreeze(initialState);
			const actual = reducer(initialState, action);
			const expected = {
				isSaving: false
			};
			expect(actual).toEqual(expected);
		});

		it('has a pending status for fetching', () => {
			const initialState = {};
			const action = {
				type: actions.SET_BILLINGADDRESS_REQUEST,
				payload: {
					formData: {
						firstName: 'Test',
						lastName: 'Tester',
						line1: '123 Fake Street'
					}
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: true,
				formData: {
					firstName: 'Test',
					lastName: 'Tester',
					line1: '123 Fake Street'
				}
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('returns the billingAddress of successful creation', () => {
			const initialState = {};
			const action = {
				type: actions.SET_BILLINGADDRESS_SUCCESS,
				payload: {
					billingAddress: '123 Fake St'
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: false,
				billingAddress: '123 Fake St'
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('returns an error when save failed', () => {
			const initialState = {
				isSaving: false,
				payload: {
					firstName: 'Test',
					lastName: 'Tester',
					line1: '123 Fake Street'
				}
			};
			const action = {
				type: actions.SET_BILLINGADDRESS_FAILURE,
				payload: {
					error: 'Oops'
				}
			};
			deepfreeze(action);
			deepfreeze(initialState);
			const actual = reducer(initialState, action);
			const expected = {
				isSaving: false
			};
			expect(actual).toEqual(expected);
		});
	});

	describe('sync actions', () => {
		it('has a sync action initBillingAddress', () => {
			const billingAddress = {
				line1: '123 Fake Street',
				country: 'Straya'
			};
			deepfreeze(billingAddress);
			const expected = {
				type: actions.INIT_BILLINGADDRESS,
				payload: {
					billingAddress
				}
			};
			const actual = actions.initBillingAddress(billingAddress);
			expect(actual).toEqual(expected);
		});

		it('has a sync action setAddressRequest', () => {
			const formData = {
				line1: '123 Fake Street',
				country: 'Straya'
			};
			deepfreeze(formData);
			const expected = {
				type: actions.SET_BILLINGADDRESS_REQUEST,
				payload: {
					formData
				},
				meta: {
					feedback: feedbackDismiss()
				}
			};
			const actual = actions.setAddressRequest(formData);
			expect(actual).toEqual(expected);
		});

		it('has a sync action setAddressFailure', () => {
			const expected = {
				type: actions.SET_BILLINGADDRESS_FAILURE,
				payload: {
					error: 'Oops'
				},
				meta: {
					feedback: feedbackError('feedback error')
				}
			};
			const actual = actions.setAddressFailure('Oops', 'feedback error');
			expect(actual).toEqual(expected);
		});

		it('has a sync action setAddressSuccess', () => {
			const billingAddress = '123 Fake St';
			const expected = {
				type: actions.SET_BILLINGADDRESS_SUCCESS,
				payload: {
					billingAddress
				}
			};
			const actual = actions.setAddressSuccess(billingAddress);
			expect(actual).toEqual(expected);
		});

		it('has a sync action clearBillingAddress', () => {
			const expected = {
				type: actions.CLEAR_BILLINGADDRESS
			};
			const actual = actions.clearBillingAddress();
			expect(actual).toEqual(expected);
		});
	});

	describe('async action', () => {
		let dispatch;
		let fakePromise;
		let getState;

		beforeEach(() => {
			dispatch = jasmine.createSpy('dispatch');
			getState = jasmine.createSpy('getState');
			fakePromise = jasmine.createSpyObj('fakePromise', ['then', 'catch']);
			setAddress.and.returnValue(fakePromise);
			fakePromise.then.and.returnValue(fakePromise);
			fakePromise.catch.and.returnValue(fakePromise);
			getState.and.returnValue({
				session: {
					info: {
						csrfToken: '~csrfToken~'
					}
				}
			});
		});

		describe('setBillingAddress', () => {
			let thunk;
			beforeEach(() => {
				thunk = actions.setBillingAddress({
					line1: '123 Fake Street',
					firstName: 'Test',
					lastName: 'Tester'
				});
				thunk(dispatch, getState);
			});

			it('initiates the request', () => {
				expect(dispatch).toHaveBeenCalledWith(actions.setAddressRequest({
					line1: '123 Fake Street',
					firstName: 'Test',
					lastName: 'Tester'
				}));
			});

			it('calls the api setAddress', () => {
				expect(setAddress).toHaveBeenCalledWith({
					line1: '123 Fake Street',
					firstName: 'Test',
					lastName: 'Tester'
				}, '~csrfToken~');
			});

			it('will dispatch a failure on api error', () => {
				dispatch.calls.reset();
				const reject = fakePromise.then.calls.argsFor(0)[1];
				reject('Oops');
				expect(dispatch).toHaveBeenCalledWith(
					actions.setAddressFailure('Oops', localeText('api-error-billing'))
				);
			});

			it('will dispatch success on api complete', () => {
				dispatch.calls.reset();
				const resolve = fakePromise.then.calls.argsFor(0)[0];
				resolve('321 Real Street');
				expect(dispatch).toHaveBeenCalledWith(actions.setAddressSuccess('321 Real Street'));
			});
		});
	});
});
