import deepfreeze from 'deep-freeze';

describe('session', () => {
	let reducer;
	let actions;
	let sessionHasAccount;
	let getSession;

	beforeEach(() => {
		const registration = jasmine.createSpyObj('registration', ['sessionHasAccount']);
		const api = jasmine.createSpyObj('api', ['getSession']);
		const moduleInjector = require('inject!./session');
		const module = moduleInjector({
			'../../api/misc': api,
			'./registration': registration
		});
		reducer = module.default;
		actions = module;
		getSession = api.getSession;
		sessionHasAccount = registration.sessionHasAccount;
	});

	describe('reducer', () => {
		it('has a empty session for initial state', () => {
			const actual = reducer(undefined, {});
			const expected = {
				info: {}
			};
			expect(actual).toEqual(expected);
		});

		it('has a pending status for fetching', () => {
			const initialState = {};
			const action = {
				type: actions.FETCH_SESSION_REQUEST
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

		it('replaces the empty session with whatever was fetched', () => {
			const initialState = {};
			const action = {
				type: actions.FETCH_SESSION_SUCCESS,
				payload: {
					session: { csrfToken: 'a5db35' }
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: false,
				fetchStatus: 'success',
				info: { csrfToken: 'a5db35' }
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('replaces the current session with whatever was fetched', () => {
			const initialState = {
				isFetching: false,
				fetchStatus: 'success',
				info: { csrfToken: 'a5db35' }
			};
			const action = {
				type: actions.FETCH_SESSION_SUCCESS,
				payload: {
					session: { csrfToken: 'b0aa324' }
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: false,
				fetchStatus: 'success',
				info: { csrfToken: 'b0aa324' }
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('leaves an empty session when the fetch failed', () => {
			const initialState = {
				isFetching: true,
				fetchStatus: 'pending',
				info: { csrfToken: 'a5db35' }
			};
			const action = {
				type: actions.FETCH_SESSION_FAILURE
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
		it('has a sync action fetchSessionRequest', () => {
			const expected = { type: actions.FETCH_SESSION_REQUEST };
			const actual = actions.fetchSessionRequest();
			expect(actual).toEqual(expected);
		});

		it('has a sync action fetchSessionFailure', () => {
			const expected = { type: actions.FETCH_SESSION_FAILURE, error: 'Oops' };
			const actual = actions.fetchSessionFailure('Oops');
			expect(actual).toEqual(expected);
		});

		it('has a sync action fetchSessionSuccess', () => {
			const expected = {
				type: actions.FETCH_SESSION_SUCCESS,
				payload: {
					session: { csrfToken: 'a5db35' }
				}
			};
			const actual = actions.fetchSessionSuccess({ csrfToken: 'a5db35' });
			expect(actual).toEqual(expected);
		});
	});

	describe('async action fetchSession', () => {
		let dispatch;
		let fakePromise;

		beforeEach(() => {
			dispatch = jasmine.createSpy('dispatch');
			fakePromise = jasmine.createSpyObj('fakePromise', ['then', 'catch']);
			getSession.and.returnValue(fakePromise);
			fakePromise.then.and.returnValue(fakePromise);
			fakePromise.catch.and.returnValue(fakePromise);
			const thunk = actions.fetchSession();
			thunk(dispatch);
		});

		it('initiates the request', () => {
			const expected = actions.fetchSessionRequest();
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will dispatch a failure on api error', () => {
			dispatch.calls.reset();
			const expected = actions.fetchSessionFailure('Oops');
			const reject = fakePromise.then.calls.argsFor(0)[1];
			reject('Oops');
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will dispatch a success on api complete', () => {
			dispatch.calls.reset();
			const expected = actions.fetchSessionSuccess({
				csrfToken: 'a5db35',
				tmid: '732bac947fbc42cabed627'
			});
			const resolve = fakePromise.then.calls.argsFor(0)[0];
			resolve({
				csrfToken: 'a5db35',
				tmid: '732bac947fbc42cabed627'
			});
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will dispatch a session has account action if the session returns an email', () => {
			dispatch.calls.reset();
			const expected = { email: 'email@address.com' };
			const resolve = fakePromise.then.calls.argsFor(0)[0];
			resolve({
				csrfToken: 'a5db35',
				tmid: '732bac947fbc42cabed627',
				customer: { email: 'email@address.com' }
			});
			expect(sessionHasAccount).toHaveBeenCalledWith(expected);
		});
	});
});
