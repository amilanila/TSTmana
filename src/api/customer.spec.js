describe('Api Customer', () => {
	let module;
	let navigateSpys;
	let proxySpys;

	beforeEach(() => {
		navigateSpys = jasmine.createSpyObj('navigate', ['replaceWithCheckoutRedirect']);
		proxySpys = jasmine.createSpyObj('proxy', ['post']);
		module = require('inject!./customer')({
			'../routes/navigate': navigateSpys,
			'./proxy-to-existing-website': proxySpys
		});
	});

	describe('is Customer Registered', () => {
		let checkIsCustomer;
		const email = 'test@example.com';
		const ctoken = 'b3c012af647';

		beforeEach(() => {
			checkIsCustomer = module.checkIsCustomer;
		});

		describe('when the email is valid', () => {
			beforeEach(() => {
				proxySpys.post.and.returnValue(Promise.resolve(
					{
						success: true,
						data: { isRegistered: true }
					}
				));
			});

			it('will respond with the customers registration status', done => {
				checkIsCustomer(email, ctoken)
					.then(data => {
						expect(data).toEqual({ isRegistered: true });
					})
					.then(done, done.fail);
			});
		});

		describe('when the email provided was invalid', () => {
			beforeEach(() => {
				proxySpys.post.and.returnValue(Promise.resolve(
					{
						success: false,
						data: { error: { code: 2020, message: '' } }
					}
				));
			});

			it('will throw an error message', done => {
				checkIsCustomer(email, ctoken)
					.then(() => done.fail('should have thrown an error by now'))
					.catch(err => {
						expect(err).toEqual({ code: 2020, message: '' });
						done();
					});
			});
		});

		it('will throw an error if no email or ctoken is passed in', done => {
			checkIsCustomer()
			.then(() => done.fail('should have thrown an error by now'))
			.catch(err => {
				expect(err).toContain('Missing args');
				done();
			});
		});
	});

	describe('Sign In', () => {
		let signIn;
		const email = 'test@example.com';
		const password = 'Target1!';
		const ctoken = 'b3c012af647';

		beforeEach(() => {
			signIn = module.signIn;
		});

		describe('when the email and password are correct', () => {
			beforeEach(() => {
				proxySpys.post.and.returnValue(Promise.resolve(
					{
						success: true,
						data: { redirectUrl: '/checkout' }
					}
				));
			});

			it('will return the data including the redirect', done => {
				signIn(email, password, ctoken)
					.then(data => {
						expect(data).toEqual({ redirectUrl: '/checkout' });
					})
					.then(done, done.fail);
			});
		});

		describe('when account is locked out', () => {
			beforeEach(() => {
				proxySpys.post.and.returnValue(Promise.reject(
					{
						success: false,
						data: {
							error: {
								code: 'ERR_LOCKED_ACCOUNT',
								message: 'message'
							}
						}
					}
				));
			});

			it('will reject the promise with a meaningful message', done => {
				signIn(email, password, ctoken)
					.catch(result => {
						expect(result.success).toEqual(false);
						expect(result.error.toEqual({
							code: 'ERR_LOCKED_ACCOUNT',
							message: 'message'
						}));
					})
					.catch(done, done.fail);
			});
		});

		describe('when email / password is invalid', () => {
			beforeEach(() => {
				proxySpys.post.and.returnValue(Promise.reject(
					{
						success: false,
						data: {
							error: {
								code: 'ERR_SIGN_IN_FAILURE',
								message: 'message for the user'
							}
						}
					}
				));
			});

			it('will reject the promise with a meaningful message', done => {
				signIn(email, password, ctoken)
					.catch(result => {
						expect(result.success).toEqual(false);
						expect(result.error.toEqual({
							code: 'ERR_SIGN_IN_FAILURE',
							message: 'message'
						}));
					})
					.catch(done, done.fail);
			});
		});

		it('will not swallow an error', done => {
			proxySpys.post.and.returnValue(Promise.reject('error'));

			signIn(email, password, ctoken)
			.then(() => done.fail('should have thrown an error by now'))
			.catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will throw an error without args', done => {
			signIn()
			.then(() => done.fail('should have thrown an error by now'))
			.catch(err => {
				expect(err).toContain('Missing args');
				done();
			});
		});
	});
});
