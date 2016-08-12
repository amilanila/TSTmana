import deepfreeze from 'deep-freeze';

describe('Country List', () => {
	let reducer;
	let actions;
	let getCountryList;
	let StrayaM8;

	beforeEach(() => {
		const api = jasmine.createSpyObj('api', ['getCountryList']);
		const moduleInjector = require('inject!./countryList');
		const module = moduleInjector({
			'../../api/billing': api
		});
		reducer = module.default;
		actions = module;
		getCountryList = api.getCountryList;
		StrayaM8 = [{ isocode: 'AU', name: 'Australia' }];
	});

	describe('reducer', () => {
		it('has Australia in the initial state', () => {
			const expected = { countries: StrayaM8, isFetching: false };
			const actual = reducer(undefined, {});
			expect(actual).toEqual(expected);
		});

		it('has a fetching status', () => {
			const initialState = { countries: [], isFetching: false };
			const action = {
				type: actions.FETCH_COUNTRYLIST_REQUEST
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: true,
				countries: []
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('maintains the country list if fetch is re-called', () => {
			const initialState = { countries: ['a', 'place'], isFetching: false };
			const action = {
				type: actions.FETCH_COUNTRYLIST_REQUEST
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: true,
				countries: ['a', 'place']
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('sets the countries with the returned list', () => {
			const initialState = {};
			const action = {
				type: actions.FETCH_COUNTRYLIST_SUCCESS,
				payload: {
					countries: ['some', 'cool', 'countries']
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: false,
				countries: ['some', 'cool', 'countries']
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('replaces the existing country list with whatever was saved', () => {
			const initialState = {
				isFetching: true,
				countries: ['bad', 'countries']
			};
			const action = {
				type: actions.FETCH_COUNTRYLIST_SUCCESS,
				payload: {
					countries: ['much', 'better', 'country', 'list']
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: false,
				countries: ['much', 'better', 'country', 'list']
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('sets the country list to Australia when fetch failed', () => {
			const initialState = {
				isFetching: false,
				countries: ['a', 'b', 'c']
			};
			const action = {
				type: actions.FETCH_COUNTRYLIST_FAILURE,
				payload: {
					error: 'oops'
				}
			};
			deepfreeze(action);
			deepfreeze(initialState);
			const actual = reducer(initialState, action);
			const expected = {
				isFetching: false,
				countries: StrayaM8
			};
			expect(actual).toEqual(expected);
		});
	});

	describe('sync actions', () => {
		it('has a sync action fetchCountryListRequest', () => {
			const expected = {
				type: actions.FETCH_COUNTRYLIST_REQUEST
			};
			const actual = actions.fetchCountryListRequest();
			expect(actual).toEqual(expected);
		});

		it('has a sync action fetchCountryListFailure', () => {
			const expected = {
				type: actions.FETCH_COUNTRYLIST_FAILURE,
				payload: {
					error: 'Oops'
				}
			};
			const actual = actions.fetchCountryListFailure('Oops');
			expect(actual).toEqual(expected);
		});

		it('has a sync action fetchCountryListSuccess', () => {
			const payload = ['a', 'b'];
			deepfreeze(payload);
			const expected = {
				type: actions.FETCH_COUNTRYLIST_SUCCESS,
				payload: {
					countries: ['a', 'b']
				}
			};
			const actual = actions.fetchCountryListSuccess(payload);
			expect(actual).toEqual(expected);
		});
	});

	describe('async action fetchCountryList', () => {
		let dispatch;
		let fakePromise;
		let getState;

		beforeEach(() => {
			dispatch = jasmine.createSpy('dispatch');
			getState = jasmine.createSpy('getState');
			fakePromise = jasmine.createSpyObj('fakePromise', ['then', 'catch']);
			getCountryList.and.returnValue(fakePromise);
			fakePromise.then.and.returnValue(fakePromise);
			fakePromise.catch.and.returnValue(fakePromise);
			getState.and.returnValue({ countryList: { countries: [], isFetching: false } });
			const thunk = actions.fetchCountryList();
			thunk(dispatch, getState);
		});

		it('initiates the request', () => {
			const expected = actions.fetchCountryListRequest();
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('calls the api getCountryList', () => {
			expect(getCountryList).toHaveBeenCalled();
		});

		it('will dispatch a failure on api error', () => {
			dispatch.calls.reset();
			const expected = actions.fetchCountryListFailure('Oops');
			const reject = fakePromise.then.calls.argsFor(0)[1];
			reject('Oops');
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will dispatch a success on api complete', () => {
			dispatch.calls.reset();
			const payload = ['list', 'of', 'countries'];
			deepfreeze(payload);
			const expected = actions.fetchCountryListSuccess(payload);
			const resolve = fakePromise.then.calls.argsFor(0)[0];
			resolve(payload);
			expect(dispatch).toHaveBeenCalledWith(expected);
		});
	});
});
