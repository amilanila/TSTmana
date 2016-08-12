import deepfreeze from 'deep-freeze';
import { feedbackError, feedbackDismiss } from './feedback';
import localeText from '../../helpers/locale-text';

describe('Create Address', () => {
	let reducer;
	let actions;
	let addAddress;
	let savedAddresses;
	let selectedAddress;
	let suggestedAddresses;

	beforeEach(() => {
		const api = jasmine.createSpyObj('api', ['addAddress']);
		savedAddresses = jasmine.createSpyObj('savedAddresses', ['fetchSavedAddresses']);
		selectedAddress = jasmine.createSpyObj('selectedAddress', ['saveAddress']);
		suggestedAddresses = jasmine.createSpyObj('suggestedAddresses',
			['clearSuggestedAddresses']
		);
		const moduleInjector = require('inject!./createAddress');
		const module = moduleInjector({
			'../../api/delivery': api,
			'./savedAddresses': savedAddresses,
			'./selectedAddress': selectedAddress,
			'./suggestedAddresses': suggestedAddresses
		});
		reducer = module.default;
		actions = module;
		addAddress = api.addAddress;
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
				type: actions.CREATE_ADDRESS_REQUEST,
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
				saveStatus: 'pending',
				formData: {
					firstName: 'Test',
					lastName: 'Tester',
					line1: '123 Fake Street'
				}
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('returns the addressId of successful creation', () => {
			const initialState = {};
			const action = {
				type: actions.CREATE_ADDRESS_SUCCESS,
				payload: {
					addressId: '1'
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: false,
				saveStatus: 'success',
				addressId: '1'
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
				type: actions.CREATE_ADDRESS_FAILURE,
				payload: {
					error: 'Oops'
				}
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
		it('has a sync action createAddressRequest', () => {
			const formData = {
				firstName: 'Test',
				lastName: 'Tester',
				line1: '123 Fake Street'
			};
			deepfreeze(formData);
			const expected = {
				type: actions.CREATE_ADDRESS_REQUEST,
				payload: {
					formData
				},
				meta: {
					feedback: feedbackDismiss()
				}
			};
			const actual = actions.createAddressRequest(formData);
			expect(actual).toEqual(expected);
		});

		it('has a sync action createAddressFailure', () => {
			const expected = {
				type: actions.CREATE_ADDRESS_FAILURE,
				payload: {
					error: 'Oops'
				},
				meta: {
					feedback: feedbackError('feedback error')
				}
			};
			const actual = actions.createAddressFailure('Oops', 'feedback error');
			expect(actual).toEqual(expected);
		});

		it('has a sync action createAddressSuccess', () => {
			const addressId = '1';
			const expected = {
				type: actions.CREATE_ADDRESS_SUCCESS,
				payload: {
					addressId
				}
			};
			const actual = actions.createAddressSuccess(addressId);
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
			addAddress.and.returnValue(fakePromise);
			fakePromise.then.and.returnValue(fakePromise);
			fakePromise.catch.and.returnValue(fakePromise);
			getState.and.returnValue({
				session: {
					info: {
						csrfToken: '~csrfToken~'
					}
				},
				selectedDeliveryMode: {
					mode: {
						id: 'hd'
					}
				}
			});
		});

		describe('fetchAddressAndSave', () => {
			beforeEach(() => {
				const thunk = actions.fetchAddressAndSave({ id: '1' });
				thunk(dispatch, getState);
			});

			it('will make a call to saveAddress on success', () => {
				expect(selectedAddress.saveAddress).toHaveBeenCalledWith({ id: '1' }, 'hd');
			});

			it('will make a call to fetchSavedAddresses on success', () => {
				expect(savedAddresses.fetchSavedAddresses).toHaveBeenCalledWith('hd');
			});

			it('will not make a call to saveAddress if no mode is selected', () => {
				dispatch.calls.reset();
				selectedAddress.saveAddress.calls.reset();
				getState.and.returnValue({
					session: {
						info: {
							csrfToken: '~csrfToken~'
						}
					}
				});
				const thunk = actions.fetchAddressAndSave('1');
				thunk(dispatch, getState);
				expect(selectedAddress.saveAddress).not.toHaveBeenCalled();
			});

			it('will not make a call to fetchSavedAddresses if no mode is selected', () => {
				dispatch.calls.reset();
				savedAddresses.fetchSavedAddresses.calls.reset();
				getState.and.returnValue({
					session: {
						info: {
							csrfToken: '~csrfToken~'
						}
					}
				});
				const thunk = actions.fetchAddressAndSave('1');
				thunk(dispatch, getState);
				expect(savedAddresses.fetchSavedAddresses).not.toHaveBeenCalled();
			});

			it('will make a call to clearSuggestedAddresses', () => {
				dispatch.calls.reset();
				suggestedAddresses.clearSuggestedAddresses.calls.reset();
				getState.and.returnValue({
					session: {
						info: {
							csrfToken: '~csrfToken~'
						}
					}
				});
				const thunk = actions.fetchAddressAndSave('1');
				thunk(dispatch, getState);
				expect(suggestedAddresses.clearSuggestedAddresses).toHaveBeenCalled();
			});
		});

		describe('createAddress', () => {
			let thunk;
			beforeEach(() => {
				thunk = actions.createAddress({
					line1: '123 Fake Street',
					firstName: 'Test',
					lastName: 'Tester'
				});
				thunk(dispatch, getState);
			});

			it('initiates the request', () => {
				const expected = {
					type: actions.CREATE_ADDRESS_REQUEST,
					payload: {
						formData: {
							line1: '123 Fake Street',
							firstName: 'Test',
							lastName: 'Tester'
						}
					},
					meta: {
						feedback: feedbackDismiss()
					}
				};
				expect(dispatch).toHaveBeenCalledWith(expected);
			});

			it('calls the api addAddress', () => {
				expect(addAddress).toHaveBeenCalledWith({
					line1: '123 Fake Street',
					firstName: 'Test',
					lastName: 'Tester'
				}, '~csrfToken~');
			});

			it('will dispatch a failure on api error', () => {
				dispatch.calls.reset();
				const expected = {
					type: actions.CREATE_ADDRESS_FAILURE,
					payload: {
						error: 'Oops'
					},
					meta: {
						feedback: feedbackError(localeText('api-error-saving'))
					}
				};
				const reject = fakePromise.then.calls.argsFor(0)[1];
				reject('Oops');
				expect(dispatch).toHaveBeenCalledWith(expected);
			});

			it('will dispatch fetchAddressAndSave on api complete', () => {
				dispatch.calls.reset();
				const resolve = fakePromise.then.calls.argsFor(0)[0];
				const expected = actions.fetchAddressAndSave().toString();
				resolve('1');
				expect(dispatch.calls.mostRecent().args[0].toString()).toEqual(expected);
			});
		});
	});
});
