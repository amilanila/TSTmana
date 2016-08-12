import deepfreeze from 'deep-freeze';
import { feedbackError, feedbackDismiss } from './feedback';

describe('searchStore', () => {
	let reducer;
	let actions;
	let searchStores;

	beforeEach(() => {
		const api = jasmine.createSpyObj('api', ['searchStores']);
		const moduleInjector = require('inject!./searchStores');
		const module = moduleInjector({
			'../../api/delivery': api
		});
		reducer = module.default;
		actions = module;
		searchStores = api.searchStores;
	});

	describe('reducer', () => {
		it('has a empty search results for initial state', () => {
			const actual = reducer(undefined, {});
			const expected = {
				list: []
			};
			expect(actual).toEqual(expected);
		});

		it('has a pending status for fetching', () => {
			const initialState = {};
			const action = {
				type: actions.FETCH_SEARCHSTORES_REQUEST
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

		it('inits the search stores list', () => {
			const initialState = {};
			const action = {
				type: actions.INIT_SEARCHSTORES,
				payload: {
					stores: ['store1']
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: false,
				fetchStatus: 'init',
				list: ['store1']
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('replaces the empty stores with whatever was fetched', () => {
			const initialState = {};
			const action = {
				type: actions.FETCH_SEARCHSTORES_SUCCESS,
				payload: {
					stores: ['store1', 'store2', 'store3', 'store4', 'store5']
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: false,
				fetchStatus: 'success',
				list: ['store1', 'store2', 'store3', 'store4', 'store5']
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('replaces the current stores with whatever was fetched', () => {
			const initialState = {
				isFetching: false,
				fetchStatus: 'success',
				list: ['store1', 'store2', 'store3', 'store4', 'store5']
			};
			const action = {
				type: actions.FETCH_SEARCHSTORES_SUCCESS,
				payload: {
					stores: ['store5', 'store6', 'store7', 'store8', 'store9']
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: false,
				fetchStatus: 'success',
				list: ['store5', 'store6', 'store7', 'store8', 'store9']
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('leaves an empty stores when the fetch failed', () => {
			const initialState = {
				isFetching: true,
				fetchStatus: 'pending',
				list: ['store1', 'store2', 'store3', 'store4', 'store5']
			};
			const action = {
				type: actions.FETCH_SEARCHSTORES_FAILURE
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
		it('has a sync action initSearchStores', () => {
			const expected = {
				type: actions.INIT_SEARCHSTORES,
				payload: {
					stores: ['store1']
				}
			};
			const actual = actions.initSearchStores(
				['store1']
			);
			expect(actual).toEqual(expected);
		});

		it('has a sync action fetchSearchStoresRequest', () => {
			const expected = {
				type: actions.FETCH_SEARCHSTORES_REQUEST,
				meta: {
					feedback: feedbackDismiss()
				}
			};
			const actual = actions.fetchSearchStoresRequest();
			expect(actual).toEqual(expected);
		});

		it('has a sync action fetchSearchStoresFailure', () => {
			const expected = {
				type: actions.FETCH_SEARCHSTORES_FAILURE,
				payload: {
					error: 'Oops'
				},
				meta: {
					feedback: feedbackError('Error Message')
				}
			};
			const actual = actions.fetchSearchStoresFailure('Oops', 'Error Message');
			expect(actual).toEqual(expected);
		});

		it('has a sync action fetchSearchStoresSuccess', () => {
			const expected = {
				type: actions.FETCH_SEARCHSTORES_SUCCESS,
				payload: {
					stores: ['store1', 'store2', 'store3', 'store4', 'store5']
				}
			};
			const actual = actions.fetchSearchStoresSuccess(
				['store1', 'store2', 'store3', 'store4', 'store5']
			);
			expect(actual).toEqual(expected);
		});
	});

	describe('async action fetchSearchStores', () => {
		let dispatch;
		let fakePromise;
		let getState;

		beforeEach(() => {
			dispatch = jasmine.createSpy('dispatch');
			getState = jasmine.createSpy('getState');
			fakePromise = jasmine.createSpyObj('fakePromise', ['then', 'catch']);
			searchStores.and.returnValue(fakePromise);
			fakePromise.then.and.returnValue(fakePromise);
			fakePromise.catch.and.returnValue(fakePromise);
			getState.and.returnValue({ session: { info: { csrfToken: '~csrfToken~' } } });
			const thunk = actions.fetchSearchStores('~location~');
			thunk(dispatch, getState);
		});

		it('initiates the request', () => {
			const expected = {
				type: actions.FETCH_SEARCHSTORES_REQUEST,
				meta: {
					feedback: feedbackDismiss()
				}
			};
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('calls the api searchStores', () => {
			const expected = ['~location~', '~csrfToken~'];
			expect(searchStores).toHaveBeenCalledWith(...expected);
		});

		it('will dispatch a failure on api error', () => {
			dispatch.calls.reset();
			const expected = {
				type: actions.FETCH_SEARCHSTORES_FAILURE,
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

		it('will dispatch a success on api complete', () => {
			dispatch.calls.reset();
			const expected = {
				type: actions.FETCH_SEARCHSTORES_SUCCESS,
				payload: {
					stores: ['store1', 'store2', 'store3', 'store4', 'store5']
				}
			};
			const resolve = fakePromise.then.calls.argsFor(0)[0];
			resolve(['store1', 'store2', 'store3', 'store4', 'store5']);
			expect(dispatch).toHaveBeenCalledWith(expected);
		});
	});
});
