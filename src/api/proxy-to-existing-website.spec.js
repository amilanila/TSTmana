import { post } from './proxy-to-existing-website';
import { Customer } from '../constants';

describe('proxy-to-existing-website', () => {
	describe('post', () => {
		let response = {};
		let options = {};

		beforeEach(() => {
			response = {
				status: '',
				body: ''
			};
			options = { body: '' };

			spyOn(window, 'fetch').and.callFake(() => Promise.resolve(response));
		});

		describe('switching the post behaviour', () => {
			describe('when the URL is CHECK_REGISTRATION', () => {
				it('should attempt the check_registration path', done => {
					response.status = 200;
					response.text = () => Promise.resolve('');

					post(Customer.CHECK_REGISTRATION, options)
						.then(() => {
							expect(fetch.calls.argsFor(0)[0]).toEqual('/checkout/login/guest');
						})
						.then(done, done.fail);
				});
			});

			describe('otherwise', () => {
				it('should attempt the sign-in path', done => {
					response.status = 200;
					response.url = 'https://www.target.com.au/checkout';
					response.text = () => Promise.resolve('');

					post(Customer.SIGN_IN, options)
						.then(() => {
							expect(fetch.calls.argsFor(0)[0]).toEqual('/checkout/j_spring_security_check');
						})
						.then(done, done.fail);
				});
			});
		});

		describe('sign_in', () => {
			const url = Customer.SIGN_IN;

			describe('username and password is correct', () => {
				beforeEach(() => {
					response.status = 200;
					response.url = 'https://www.target.com.au/checkout';
					response.text = () => Promise.resolve('');
				});

				it('returns a path to redirect to', done => {
					const expected = {
						success: true,
						data: { redirectUrl: '/checkout' }
					};

					post(url, options)
						.then(resp => expect(resp).toEqual(expected))
						.then(done, done.fail);
				});
			});

			describe('email/password is invalid/missing', () => {
				beforeEach(() => {
					response.status = 200;
					response.url = 'https://www.target.com.au/checkout/login?error=true"';
					response.text = () => Promise.resolve('<span>Your username or password was incorrect.</span>'); // eslint-disable-line max-len
				});

				it('returns login failed', done => {
					const expected = {
						success: false,
						data: {
							error: {
								code: 'ERR_LOGIN_BAD_CREDENTIALS',
								message: null
							}
						}
					};

					post(url, options)
						.catch(resp => expect(resp).toEqual(expected))
						.then(done, done.fail);
				});
			});

			describe('account is locked out', () => {
				beforeEach(() => {
					response.status = 200;
					response.url = 'https://www.target.com.au/checkout/login?error=true"';
					response.text = () => Promise.resolve(
						'<span>Due to excessive failed login attempts, your account has been locked.</span>'
						);
				});

				it('returns login failed', done => {
					const expected = {
						success: false,
						data: {
							error: {
								code: 'ERR_LOGIN_ACCOUNT_LOCKED',
								message: null
							}
						}
					};

					post(url, options)
						.catch(resp => expect(resp).toEqual(expected))
						.then(done, done.fail);
				});
			});

			it('returns a generic error when the request fails', (done) => {
				response.status = 500;
				post(url, options)
					.then(done.fail)
					.catch(resp => {
						expect(resp).toEqual(Error());
						done();
					});
			});
		});

		describe('check_registration', () => {
			const url = Customer.CHECK_REGISTRATION;
			describe('when the fetch is successful', () => {
				it('returns success and isRegistered true when the account exists (200)', (done) => {
					const expected = { success: true, data: { isRegistered: true } };
					response.status = 200;
					response.text = () => Promise.resolve('<span id="email.errors">' +
									'This email id has already been registered. Please sign in.</span>');
					post(url, options)
						.then(resp => expect(resp).toEqual(expected))
						.then(done, done.fail);
				});

				it('returns success and isRegistered false when there\'s no account (302)', (done) => {
					const expected = { success: true, data: { isRegistered: false } };
					response.status = 200;
					response.text = () => Promise.resolve('');

					post(url, options)
						.then(resp => expect(resp).toEqual(expected))
						.then(done, done.fail);
				});

				it('returns error data when the email address malformed (200)', (done) => {
					const expected = { success: false,
						data: { error: {
							code: 'ERR_INVALID_EMAIL',
							message: null
						} }
					};
					response.status = 200;
					response.text = () => Promise.resolve('<span id="email.errors">' +
									'Email Address must be in a valid Email Address format.</span>');
					post(url, options)
						.then(resp => expect(resp).toEqual(expected))
						.then(done, done.fail);
				});
			});

			it('returns a generic error when the request fails', (done) => {
				response.status = 500;
				post(url, options)
					.then(done.fail)
					.catch(resp => {
						expect(resp).toEqual(Error());
						done();
					});
			});
		});
	});
});
