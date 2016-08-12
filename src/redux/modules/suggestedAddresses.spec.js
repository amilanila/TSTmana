import deepfreeze from 'deep-freeze';
import localeText from '../../helpers/locale-text';
import { feedbackError, feedbackDismiss } from './feedback';

describe('Suggested Address', () => {
	let reducer;
	let actions;
	let searchAddress;

	beforeEach(() => {
		const api = jasmine.createSpyObj('api', ['searchAddress']);
		const moduleInjector = require('inject!./suggestedAddresses');
		const module = moduleInjector({
			'../../api/delivery': api
		});
		reducer = module.default;
		actions = module;
		searchAddress = api.searchAddress;
	});

	describe('reducer', () => {
		it('has a fetching status', () => {
			const initialState = {};
			const action = {
				type: actions.FETCH_SUGGESTEDADDRESSES_REQUEST,
				payload: {
					searchTerm: 'home'
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: true,
				list: undefined,
				searchTerm: 'home',
				valid: false
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('has a clear which clears all details', () => {
			const initialState = {
				isFetching: true,
				searchTerm: 'home',
				list: ['address1', 'address2'],
				valid: true
			};
			const action = {
				type: actions.CLEAR_SUGGESTEDADDRESSES
			};
			deepfreeze(action);
			deepfreeze(initialState);
			const actual = reducer(initialState, action);
			const expected = {
				isFetching: false,
				list: [],
				searchTerm: '',
				valid: false
			};
			expect(actual).toEqual(expected);
		});

		it('sets the list with whatever was returned, maintaining the searchTerm', () => {
			const initialState = { valid: false, searchTerm: 'home' };
			const action = {
				type: actions.FETCH_SUGGESTEDADDRESSES_SUCCESS,
				payload: {
					list: ['test', 'test2']
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: false,
				fetchStatus: 'success',
				list: ['test', 'test2'],
				searchTerm: 'home',
				valid: false
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('replaces the existing list with whatever was saved', () => {
			const initialState = {
				isFetching: false,
				list: ['list', 'list2'],
				searchTerm: 'home',
				valid: false
			};
			const action = {
				type: actions.FETCH_SUGGESTEDADDRESSES_SUCCESS,
				payload: {
					list: ['address', 'address2']
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: false,
				fetchStatus: 'success',
				list: ['address', 'address2'],
				searchTerm: 'home',
				valid: false
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('clears the list when save failed', () => {
			const initialState = {
				isFetching: false,
				searchTerm: 'home',
				list: ['address1', 'address2'],
				valid: false
			};
			const action = {
				type: actions.FETCH_SUGGESTEDADDRESSES_FAILURE,
				payload: {
					error: {
						code: 'ERR_NO_RESULTS'
					}
				}
			};
			deepfreeze(action);
			deepfreeze(initialState);
			const actual = reducer(initialState, action);
			const expected = {
				isFetching: false,
				fetchStatus: 'failure',
				list: [],
				searchTerm: 'home',
				valid: false
			};
			expect(actual).toEqual(expected);
		});

		it('handles too many results', () => {
			const initialState = {
				isFetching: false,
				searchTerm: 'home',
				list: ['address1', 'address2'],
				valid: false
			};
			const action = {
				type: actions.SUGGESTEDADDRESSES_TOOMANY_MATCHES
			};
			deepfreeze(action);
			deepfreeze(initialState);
			const actual = reducer(initialState, action);
			const expected = {
				isFetching: false,
				list: [],
				searchTerm: 'home',
				valid: false,
				tooManyResults: true
			};
			expect(actual).toEqual(expected);
		});

		it('selects the address, and populates the search with it', () => {
			const initialState = {
				isFetching: true,
				list: ['address1', 'address2'],
				searchTerm: 'home',
				valid: false
			};
			const action = {
				type: actions.SELECT_SUGGESTEDADDRESS,
				payload: {
					address: {
						id: '1',
						label: 'address1'
					}
				}
			};
			deepfreeze(action);
			deepfreeze(initialState);
			const actual = reducer(initialState, action);
			const expected = {
				isFetching: false,
				list: ['address1', 'address2'],
				searchTerm: 'address1',
				valid: true,
				address: { id: '1', label: 'address1' }
			};
			expect(actual).toEqual(expected);
		});
	});

	describe('sync actions', () => {
		it('has a sync action fetchSuggestedAddressesRequest', () => {
			const payload = {
				searchTerm: 'home'
			};
			deepfreeze(payload);
			const expected = {
				type: actions.FETCH_SUGGESTEDADDRESSES_REQUEST,
				payload,
				meta: {
					feedback: feedbackDismiss()
				}
			};
			const actual = actions.fetchSuggestedAddressesRequest(payload.searchTerm);
			expect(actual).toEqual(expected);
		});

		it('has a sync action fetchSuggestedAddressesFailure', () => {
			const payload = {
				searchTerm: 'inhome'
			};
			deepfreeze(payload);
			const expected = {
				type: actions.FETCH_SUGGESTEDADDRESSES_FAILURE,
				payload: {
					error: 'Oops'
				},
				meta: {
					feedback: feedbackError('Error Message')
				}
			};
			const actual = actions.fetchSuggestedAddressesFailure('Oops', 'Error Message');
			expect(actual).toEqual(expected);
		});

		it('has a sync action fetchSuggestedAddressesSuccess', () => {
			const payload = {
				list: ['address1', 'address2']
			};
			deepfreeze(payload);
			const expected = {
				type: actions.FETCH_SUGGESTEDADDRESSES_SUCCESS,
				payload: {
					list: payload.list
				}
			};
			const actual = actions.fetchSuggestedAddressesSuccess(payload.list);
			expect(actual).toEqual(expected);
		});

		it('has a sync action selectSuggestedAddress', () => {
			const payload = {
				address: { id: 'a', label: 'home' }
			};
			deepfreeze(payload);
			const expected = {
				type: actions.SELECT_SUGGESTEDADDRESS,
				payload: {
					address: payload.address
				}
			};
			const actual = actions.selectSuggestedAddress(payload.address);
			expect(actual).toEqual(expected);
		});

		it('has a sync action updateSearchTerm', () => {
			const payload = {
				searchTerm: 'home'
			};
			deepfreeze(payload);
			const expected = {
				type: actions.UPDATE_SUGGESTEDADDRESSES,
				payload,
				meta: {
					feedback: feedbackDismiss()
				}
			};
			const actual = actions.updateSearchTerm(payload.searchTerm);
			expect(actual).toEqual(expected);
		});

		it('has a sync action fetchSuggestedAddressesTooManyResults', () => {
			const expected = {
				type: actions.SUGGESTEDADDRESSES_TOOMANY_MATCHES
			};
			const actual = actions.fetchSuggestedAddressesTooManyResults();
			expect(actual).toEqual(expected);
		});
	});

	describe('async action fetchSuggestedAddresses', () => {
		let dispatch;
		let fakePromise;
		let getState;

		beforeEach(() => {
			dispatch = jasmine.createSpy('dispatch');
			getState = jasmine.createSpy('getState');
			fakePromise = jasmine.createSpyObj('fakePromise', ['then', 'catch']);
			searchAddress.and.returnValue(fakePromise);
			fakePromise.then.and.returnValue(fakePromise);
			fakePromise.catch.and.returnValue(fakePromise);
			getState.and.returnValue(
				{
					session: { info: { csrfToken: '~csrfToken~' } },
					suggestedAddresses: { searchTerm: 'home' }
				}
			);
			const thunk = actions.fetchSuggestedAddresses('home');
			thunk(dispatch, getState);
		});

		it('initiates the request', () => {
			expect(dispatch).toHaveBeenCalledWith(actions.fetchSuggestedAddressesRequest('home'));
		});

		it('calls the api searchAddress', () => {
			expect(searchAddress).toHaveBeenCalledWith('home', '~csrfToken~');
		});

		it('will dispatch a failure on api error', () => {
			dispatch.calls.reset();
			const expected = actions.fetchSuggestedAddressesFailure('Oops',
				localeText('suggested-unavailable'));
			const reject = fakePromise.then.calls.argsFor(0)[1];
			reject('Oops');
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will dispatch a failure on api error', () => {
			dispatch.calls.reset();
			const expected = actions.fetchSuggestedAddressesFailure(
				{ message: 'Oops', code: 'ERR_QAS_UNAVAILABLE' },
				localeText('suggested-unavailable')
			);
			const reject = fakePromise.then.calls.argsFor(0)[1];
			reject({ message: 'Oops', code: 'ERR_QAS_UNAVAILABLE' });
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will dispatch an empty failure when too many results are returned', () => {
			dispatch.calls.reset();
			const reject = fakePromise.then.calls.argsFor(0)[1];
			reject({ code: 'ERR_TOOMANY_MATCHES' });
			expect(dispatch).toHaveBeenCalledWith(actions.fetchSuggestedAddressesTooManyResults());
		});

		it('will dispatch an empty list when no results are returned', () => {
			dispatch.calls.reset();
			const reject = fakePromise.then.calls.argsFor(0)[1];
			reject({ code: 'ERR_NO_MATCH' });
			expect(dispatch).toHaveBeenCalledWith(actions.fetchSuggestedAddressesSuccess([]));
		});

		it('will dispatch a success on api complete', () => {
			dispatch.calls.reset();
			const payload = ['address1', 'address2'];
			deepfreeze(payload);
			const resolve = fakePromise.then.calls.argsFor(0)[0];
			resolve(payload);
			expect(dispatch).toHaveBeenCalledWith(actions.fetchSuggestedAddressesSuccess(payload));
		});
	});
});
