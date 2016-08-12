import deepfreeze from 'deep-freeze';

describe('env', () => {
	let reducer;
	let actions;
	let getEnv;
	let create;

	beforeEach(() => {
		const api = jasmine.createSpyObj('api', ['getEnv']);
		const gtm = jasmine.createSpyObj('gtm', ['create']);
		const moduleInjector = require('inject!./env');
		const module = moduleInjector({
			'../../api/misc': api,
			'../../helpers/gtm': gtm
		});
		reducer = module.default;
		actions = module;
		getEnv = api.getEnv;
		create = gtm.create;
	});

	describe('reducer', () => {
		it('has an empty env for initial state', () => {
			const actual = reducer(undefined, {});
			const expected = {
				info: {}
			};
			expect(actual).toEqual(expected);
		});

		it('has a pending status for fetching', () => {
			const initialState = {};
			const action = {
				type: actions.FETCH_ENV_REQUEST
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: true,
				fetchStatus: 'pending',
				info: {}
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('replaces the empty env with whatever was fetched', () => {
			const initialState = {};
			const action = {
				type: actions.FETCH_ENV_SUCCESS,
				payload: {
					env: {
						gaId: 'ga0001',
						gtmId: 'gtm0001',
						fqdn: 'http://target.com.au'
					}
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: false,
				fetchStatus: 'success',
				info: {
					gaId: 'ga0001',
					gtmId: 'gtm0001',
					fqdn: 'http://target.com.au'
				}
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('replaces the current env with whatever was fetched', () => {
			const initialState = {
				isFetching: false,
				fetchStatus: 'success',
				info: {
					gaId: 'ga0001',
					gtmId: 'gtm0001',
					fqdn: 'http://target.com.au'
				}
			};
			const action = {
				type: actions.FETCH_ENV_SUCCESS,
				payload: {
					env: {
						gaId: 'ga0002',
						gtmId: 'gtm0002',
						fqdn: 'https://target.com.au'
					}
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: false,
				fetchStatus: 'success',
				info: {
					gaId: 'ga0002',
					gtmId: 'gtm0002',
					fqdn: 'https://target.com.au'
				}
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('leaves an empty env when the fetch failed', () => {
			const initialState = {
				isFetching: true,
				fetchStatus: 'pending',
				info: {
					gaId: 'ga0001',
					gtmId: 'gtm0001',
					fqdn: 'http://target.com.au'
				}
			};
			const action = {
				type: actions.FETCH_ENV_FAILURE
			};
			deepfreeze(action);
			deepfreeze(initialState);
			const expected = {
				isFetching: false,
				fetchStatus: 'failure',
				info: {}
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});
	});

	describe('sync actions', () => {
		it('has a sync action fetchEnvRequest', () => {
			const expected = { type: actions.FETCH_ENV_REQUEST };
			const actual = actions.fetchEnvRequest();
			expect(actual).toEqual(expected);
		});

		it('has a sync action fetchEnvFailure', () => {
			const expected = { type: actions.FETCH_ENV_FAILURE, error: 'Oops' };
			const actual = actions.fetchEnvFailure('Oops');
			expect(actual).toEqual(expected);
		});

		it('has a sync action fetchEnvSuccess', () => {
			const expected = {
				type: actions.FETCH_ENV_SUCCESS,
				payload: {
					env: {
						gaId: 'ga0001',
						gtmId: 'gtm0001',
						fqdn: 'http://target.com.au'
					}
				}
			};
			const actual = actions.fetchEnvSuccess({
				gaId: 'ga0001',
				gtmId: 'gtm0001',
				fqdn: 'http://target.com.au'
			});
			expect(actual).toEqual(expected);
		});
	});

	describe('async action fetchEnv', () => {
		let dispatch;
		let fakePromise;

		beforeEach(() => {
			dispatch = jasmine.createSpy('dispatch');
			fakePromise = jasmine.createSpyObj('fakePromise', ['then', 'catch']);
			getEnv.and.returnValue(fakePromise);
			fakePromise.then.and.returnValue(fakePromise);
			fakePromise.catch.and.returnValue(fakePromise);
			const thunk = actions.fetchEnv();
			thunk(dispatch);
			create.calls.reset();
		});

		it('initiates the request', () => {
			const expected = actions.fetchEnvRequest();
			expect(dispatch).toHaveBeenCalledWith(expected);
			expect(create).not.toHaveBeenCalled();
		});

		it('will dispatch a failure on api error', () => {
			dispatch.calls.reset();
			const expected = actions.fetchEnvFailure('Oops');
			const reject = fakePromise.then.calls.argsFor(0)[1];
			reject('Oops');
			expect(dispatch).toHaveBeenCalledWith(expected);
			expect(create).not.toHaveBeenCalled();
		});

		it('will dispatch a success on api complete', () => {
			dispatch.calls.reset();
			const expected = actions.fetchEnvSuccess({
				gaId: 'ga0001',
				gtmId: 'gtm0001',
				fqdn: 'http://target.com.au'
			});
			const resolve = fakePromise.then.calls.argsFor(0)[0];
			resolve({
				gaId: 'ga0001',
				gtmId: 'gtm0001',
				fqdn: 'http://target.com.au'
			});
			expect(dispatch).toHaveBeenCalledWith(expected);
			expect(create).toHaveBeenCalledWith('gtm0001');
		});
	});
});
