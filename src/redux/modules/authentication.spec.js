import deepfreeze from 'deep-freeze';
import { feedbackError, feedbackDismiss } from './feedback';

describe('authentication', () => {
	let reducer;
	let actions;
	let signIn;
	let navigate;

	beforeEach(() => {
		const api = jasmine.createSpyObj('api', ['signIn']);
		navigate = jasmine.createSpyObj('navigate', ['replaceWithCheckoutRedirect']);
		const moduleInjector = require('inject!./authentication');
		const module = moduleInjector({
			'../../api/customer': api,
			'../../routes/navigate': navigate
		});
		reducer = module.default;
		actions = module;
		signIn = api.signIn;
	});

	describe('reducer', () => {
		it('should set initial state to an empty object', () => {
			const expected = {};
			const actual = reducer(undefined, {});

			expect(actual).toEqual(expected);
		});

		describe('when action is SIGN_IN_SUCCESS', () => {
			let action;

			beforeEach(() => {
				action = {
					type: actions.SIGN_IN_SUCCESS,
					payload: {
						redirectUrl: '/checkout'
					}
				};
			});

			it('should set redirectUrl to "/checkout"', () => {
				const initialState = {};
				deepfreeze(initialState);
				deepfreeze(action);

				const actual = reducer(initialState, action);

				expect(actual.redirectUrl).toEqual('/checkout');
			});
		});
	});

	describe('sync actions', () => {
		it('has a sync action signInRequest', () => {
			const expected = {
				type: actions.SIGN_IN_REQUEST,
				meta: {
					feedback: feedbackDismiss()
				}
			};
			const actual = actions.signInRequest();
			expect(actual).toEqual(expected);
		});

		it('has a sync action signInFailure', () => {
			const expected = {
				type: actions.SIGN_IN_FAILURE,
				payload: {
					error: 'Oops'
				},
				meta: {
					feedback: feedbackError('message')
				}
			};
			const actual = actions.signInFailure('Oops', 'message');
			expect(actual).toEqual(expected);
		});

		it('has a sync action signInSuccess', () => {
			const expected = {
				type: actions.SIGN_IN_SUCCESS,
				payload: {
					redirectUrl: '/somewhere'
				}
			};
			const actual = actions.signInSuccess({ redirectUrl: '/somewhere' });
			expect(actual).toEqual(expected);
		});
	});

	describe('async action signIn', () => {
		let dispatch;
		let fakePromise;
		let getState;

		beforeEach(() => {
			dispatch = jasmine.createSpy('dispatch');
			getState = jasmine.createSpy('getState');
			fakePromise = jasmine.createSpyObj('fakePromise', ['then', 'catch']);
			signIn.and.returnValue(fakePromise);
			fakePromise.then.and.returnValue(fakePromise);
			fakePromise.catch.and.returnValue(fakePromise);
			const thunk = actions.signIn('test@example.com', '12345678');
			thunk(dispatch, getState);
		});

		it('initiates the request', () => {
			const expected = actions.signInRequest();
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('calls the api signIn', () => {
			const expected = ['test@example.com', '12345678'];
			expect(signIn).toHaveBeenCalledWith(...expected);
		});

		it('should redirect to the checkout', () => {
			const resolve = fakePromise.then.calls.argsFor(0)[0];
			resolve({ redirectUrl: '/checkout' });

			expect(navigate.replaceWithCheckoutRedirect).toHaveBeenCalled();
		});

		it('will dispatch a failure on api error', () => {
			dispatch.calls.reset();

			const expected = actions.signInFailure('Oops', jasmine.any(String));
			const apiError = { code: 'Oops' };

			const reject = fakePromise.then.calls.argsFor(0)[1];
			reject(apiError);

			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		describe('when there is a locked account', () => {
			it('will return a validation error redux-forms to display', () => {
				dispatch.calls.reset();

				const expected = { validationError: { _error: jasmine.any(String) } };
				const apiError = { code: 'ERR_LOGIN_ACCOUNT_LOCKED' };

				const reject = fakePromise.then.calls.argsFor(0)[1];
				expect(reject(apiError)).toEqual(expected);
			});
		});

		describe('when there is an incorrect password', () => {
			it('will return a validation error for redux-forms to display', () => {
				dispatch.calls.reset();

				const expected = { validationError: { password: jasmine.any(String) } };
				const apiError = { code: 'ERR_LOGIN_BAD_CREDENTIALS' };

				const reject = fakePromise.then.calls.argsFor(0)[1];
				expect(reject(apiError)).toEqual(expected);
			});
		});
	});
});
