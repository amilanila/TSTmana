import deepfreeze from 'deep-freeze';
import { feedbackError } from './feedback';

describe('registration', () => {
	let reducer;
	let actions;
	let checkIsCustomer;

	beforeEach(() => {
		const api = jasmine.createSpyObj('api', ['checkIsCustomer']);
		const moduleInjector = require('inject!./registration');
		const module = moduleInjector({
			'../../api/customer': api
		});
		reducer = module.default;
		actions = module;
		checkIsCustomer = api.checkIsCustomer;
	});

	describe('reducer', () => {
		describe('when action is CHECK_EMAIL_REQUEST', () => {
			it('should set email', () => {
				const initialState = {};
				const action = {
					type: actions.CHECK_EMAIL_REQUEST,
					payload: {
						email: 'test@example.com'
					}
				};
				deepfreeze(initialState);
				deepfreeze(action);

				const actual = reducer(initialState, action);

				expect(actual.email).toEqual('test@example.com');
			});
		});

		describe('when action is CHECK_EMAIL_EXISTS', () => {
			it('should set hasCheckedEmail to true', () => {
				const initialState = {};
				const action = {
					type: actions.CHECK_EMAIL_EXISTS
				};
				deepfreeze(initialState);
				deepfreeze(action);

				const actual = reducer(initialState, action);

				expect(actual.hasCheckedEmail).toBeTruthy();
			});

			it('should set hasExistingAccount to true', () => {
				const initialState = {};
				const action = {
					type: actions.CHECK_EMAIL_EXISTS
				};
				deepfreeze(initialState);
				deepfreeze(action);

				const actual = reducer(initialState, action);

				expect(actual.hasExistingAccount).toBeTruthy();
			});
		});

		describe('when action is CHECK_EMAIL_NOT_FOUND', () => {
			it('should set hasCheckedEmail to true', () => {
				const initialState = {};
				const action = {
					type: actions.CHECK_EMAIL_NOT_FOUND
				};
				deepfreeze(initialState);
				deepfreeze(action);

				const actual = reducer(initialState, action);

				expect(actual.hasCheckedEmail).toBeTruthy();
			});

			it('should set hasExistingAccount to false', () => {
				const initialState = {};
				const action = {
					type: actions.CHECK_EMAIL_NOT_FOUND
				};
				deepfreeze(initialState);
				deepfreeze(action);

				const actual = reducer(initialState, action);

				expect(actual.hasExistingAccount).toBeFalsy();
			});
		});

		describe('when action is SESSION_HAS_ACCOUNT', () => {
			it('should set hasCheckedEmail to true', () => {
				const initialState = {};
				const action = {
					type: actions.SESSION_HAS_ACCOUNT,
					payload: { email: 'email@address.com' }
				};
				deepfreeze(initialState);
				deepfreeze(action);

				const actual = reducer(initialState, action);

				expect(actual.hasCheckedEmail).toBeTruthy();
			});

			it('should set hasExistingAccount to true', () => {
				const initialState = {};
				const action = {
					type: actions.SESSION_HAS_ACCOUNT,
					payload: { email: 'email@address.com' }
				};
				deepfreeze(initialState);
				deepfreeze(action);

				const actual = reducer(initialState, action);

				expect(actual.hasExistingAccount).toBeTruthy();
			});
		});

		describe('when action is CHECKOUT_AS_GUEST', () => {
			it('should set checkoutAsGuest to true', () => {
				const initialState = {};
				const action = {
					type: actions.CHECKOUT_AS_GUEST
				};
				deepfreeze(initialState);
				deepfreeze(action);

				const actual = reducer(initialState, action);

				expect(actual.checkoutAsGuest).toBeTruthy();
			});
		});
	});

	describe('sync actions', () => {
		it('has a sync action checkEmailRequest', () => {
			const expected = {
				type: actions.CHECK_EMAIL_REQUEST,
				payload: {
					email: 'test@example.com'
				}
			};
			const actual = actions.checkEmailRequest('test@example.com');
			expect(actual).toEqual(expected);
		});

		it('has a sync action checkEmailFailure', () => {
			const expected = {
				type: actions.CHECK_EMAIL_FAILURE,
				payload: {
					error: 'Oops'
				},
				meta: {
					feedback: feedbackError('Error Message')
				}
			};
			const actual = actions.checkEmailFailure('Oops', 'Error Message');
			expect(actual).toEqual(expected);
		});

		it('has a sync action checkEmailExists', () => {
			const expected = {
				type: actions.CHECK_EMAIL_EXISTS
			};
			const actual = actions.checkEmailExists();
			expect(actual).toEqual(expected);
		});

		it('has a sync action checkEmailNotFound', () => {
			const expected = {
				type: actions.CHECK_EMAIL_NOT_FOUND
			};
			const actual = actions.checkEmailNotFound();
			expect(actual).toEqual(expected);
		});

		it('has a sync action sessionHasAccount', () => {
			const expected = {
				type: actions.SESSION_HAS_ACCOUNT,
				payload: {
					email: 'email@address.com',
					hasExistingAccount: true
				}
			};
			const actual = actions.sessionHasAccount({ email: 'email@address.com' });
			expect(actual).toEqual(expected);
		});

		it('has a sync action checkoutAsGuest', () => {
			const expected = {
				type: actions.CHECKOUT_AS_GUEST
			};
			const actual = actions.checkoutAsGuest();
			expect(actual).toEqual(expected);
		});
	});

	describe('async action checkEmail', () => {
		let dispatch;
		let fakePromise;
		let getState;

		beforeEach(() => {
			dispatch = jasmine.createSpy('dispatch');
			getState = jasmine.createSpy('getState');
			fakePromise = jasmine.createSpyObj('fakePromise', ['then', 'catch']);
			checkIsCustomer.and.returnValue(fakePromise);
			fakePromise.then.and.returnValue(fakePromise);
			fakePromise.catch.and.returnValue(fakePromise);
			getState.and.returnValue({ session: { info: { csrfToken: '~csrfToken~' } } });
			const thunk = actions.checkEmail('test@example.com');
			thunk(dispatch, getState);
		});

		it('initiates the request', () => {
			const expected = {
				type: actions.CHECK_EMAIL_REQUEST,
				payload: {
					email: 'test@example.com'
				}
			};
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('calls the api checkIsCustomer', () => {
			const expected = ['test@example.com', '~csrfToken~'];
			expect(checkIsCustomer).toHaveBeenCalledWith(...expected);
		});

		it('will dispatch a failure on api error', () => {
			dispatch.calls.reset();

			const expected = {
				type: actions.CHECK_EMAIL_FAILURE,
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

		describe('when there is an invalid email', () => {
			it('will return a validation error redux-forms to display', () => {
				dispatch.calls.reset();

				const expected = { validationError: { email: jasmine.any(String) } };
				const apiError = { code: 'ERR_INVALID_EMAIL' };

				const reject = fakePromise.then.calls.argsFor(0)[1];
				expect(reject(apiError)).toEqual(expected);
			});
		});

		describe('when the email exists', () => {
			it('will dispatch an email exists event', () => {
				dispatch.calls.reset();
				const expected = { type: actions.CHECK_EMAIL_EXISTS };

				const resolve = fakePromise.then.calls.argsFor(0)[0];
				resolve({ isRegistered: true });

				expect(dispatch).toHaveBeenCalledWith(expected);
			});
		});

		describe('when the email does not exist', () => {
			it('will dispatch an email not found event', () => {
				dispatch.calls.reset();
				const expected = { type: actions.CHECK_EMAIL_NOT_FOUND };

				const resolve = fakePromise.then.calls.argsFor(0)[0];
				resolve({ isRegistered: false });

				expect(dispatch).toHaveBeenCalledWith(expected);
			});
		});
	});
});
