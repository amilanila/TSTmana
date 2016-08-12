describe('Api Common', () => {
	let navigate;

	let get;
	let post;
	let extractProp;
	let extractAll;
	let disregarder;
	let confirmSuccess;

	beforeEach(() => {
		navigate = jasmine.createSpyObj('navigate', ['replaceWithLogin']);
		const common = require('inject!./common')({
			'../routes/navigate': navigate
		});
		get = common.get;
		post = common.post;
		extractProp = common.extractProp;
		extractAll = common.extractAll;
		disregarder = common.disregarder;
		confirmSuccess = common.confirmSuccess;
	});
	describe('get', () => {
		const mockFetch = (data = {}, status = 200) => {
			window.fetch.and.returnValue(Promise.resolve({
				status,
				json: () => data
			}));
		};

		beforeEach(() => {
			spyOn(window, 'fetch');
			mockFetch({});
		});

		it('will get a url', () => {
			const expected = [
				jasmine.stringMatching(/\/url\?_=\d+/),
				{ credentials: 'same-origin' }
			];
			get('/url');
			expect(window.fetch).toHaveBeenCalledWith(...expected);
		});

		it('will return data', (done) => {
			const expected = { data: 'myData' };
			mockFetch({ data: 'myData' });
			get('/url')
				.then(actual => {
					expect(actual).toEqual(expected);
					done();
				})
				.catch(err => {
					expect(err).not.toBeDefined();
					done();
				});
		});

		it('will throw an error without status 200', (done) => {
			mockFetch({}, 404);
			get('/url').catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will not swallow an error', (done) => {
			window.fetch.and.returnValue(Promise.reject('error'));
			get().catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});
	});

	describe('post', () => {
		const mockFetch = (data = {}, status = 200) => {
			window.fetch.and.returnValue(Promise.resolve({
				status,
				json: () => data
			}));
		};

		beforeEach(() => {
			spyOn(window, 'fetch');
			mockFetch({});
		});

		it('will post a url', () => {
			const expected = [
				jasmine.stringMatching(/\/url\?_=\d+/),
				{
					method: 'POST',
					credentials: 'same-origin',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					}
				}
			];
			post('/url');
			expect(window.fetch).toHaveBeenCalledWith(...expected);
		});

		it('will return data', (done) => {
			const expected = { data: 'myData' };
			mockFetch({ data: 'myData' });
			post('/url')
				.then(actual => {
					expect(actual).toEqual(expected);
					done();
				})
				.catch(err => {
					expect(err).not.toBeDefined();
					done();
				});
		});

		it('will throw an error without status 200', (done) => {
			mockFetch({}, 404);
			post('/url').catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will not swallow an error', (done) => {
			window.fetch.and.returnValue(Promise.reject('error'));
			post().catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});
	});

	describe('extractProp', () => {
		it('extract properties from success', (done) => {
			const expected = [1, 2, 3];
			const result = extractProp('myProp')({
				success: true,
				data: {
					myProp: [1, 2, 3]
				}
			});
			result.then(data => {
				expect(data).toEqual(expected);
				done();
			});
		});

		it('throws an error if not a success', (done) => {
			const promise = extractProp('myProp')({
				success: false
			});
			promise.catch(err => {
				expect(err).toEqual('extract-prop-error');
				done();
			});
		});

		it('throws an error without the data', (done) => {
			const promise = extractProp('myProp')({
				success: true
			});
			promise.catch(err => {
				expect(err).toEqual('extract-prop-error');
				done();
			});
		});

		it('throws an error without the prop', (done) => {
			const promise = extractProp('myProp')({
				success: true,
				data: {
					otherProp: [1, 2, 3]
				}
			});
			promise.catch(err => {
				expect(err).toEqual('extract-prop-error');
				done();
			});
		});

		it('has a session timeout', () => {
			extractProp('myProp')({
				success: false,
				data: {
					error: {
						code: 'ERR_LOGIN_REQUIRED'
					}
				}
			});
			expect(navigate.replaceWithLogin).toHaveBeenCalled();
		});
	});

	describe('confirmSuccess', () => {
		it('extract properties from success if they are there', (done) => {
			const expected = { myProp: [1, 2, 3] };
			const promise = confirmSuccess()({
				success: true,
				data: {
					myProp: [1, 2, 3]
				}
			});
			promise.then(data => {
				expect(data).toEqual(expected);
				done();
			});
		});

		it('throws an error if not a success', (done) => {
			const promise = confirmSuccess()({
				success: false
			});
			promise.catch(err => {
				expect(err).toEqual('unsuccessful');
				done();
			});
		});

		it('doesnt throw an error without data', (done) => {
			const promise = confirmSuccess()({
				success: true
			});
			promise.then(data => {
				expect(data).not.toBeDefined();
				done();
			});
		});

		it('has a session timeout', () => {
			confirmSuccess()({
				success: false,
				data: {
					error: {
						code: 'ERR_LOGIN_REQUIRED'
					}
				}
			});
			expect(navigate.replaceWithLogin).toHaveBeenCalled();
		});
	});

	describe('extractAll', () => {
		it('extracts all properties from success', (done) => {
			const expected = {
				prop1: { a: 'a', x: 'x' },
				prop2: { b: 'b' }
			};
			const result = extractAll()({
				success: true,
				data: {
					prop1: { a: 'a', x: 'x' },
					prop2: { b: 'b' }
				}
			});
			result.then(data => {
				expect(data).toEqual(expected);
				done();
			});
		});

		it('thows an error if not a success', (done) => {
			const promise = extractAll()({
				success: false
			});
			promise.catch(err => {
				expect(err).toEqual('extract-prop-error');
				done();
			});
		});

		it('throws an error without the data', (done) => {
			const promise = extractAll()({
				success: true
			});
			promise.catch(err => {
				expect(err).toEqual('extract-prop-error');
				done();
			});
		});

		it('has a session timeout', () => {
			extractAll()({
				success: false,
				data: {
					error: {
						code: 'ERR_LOGIN_REQUIRED'
					}
				}
			});
			expect(navigate.replaceWithLogin).toHaveBeenCalled();
		});
	});

	describe('disregarder', () => {
		let api;
		let calls;

		beforeEach(() => {
			calls = [];
			api = jasmine.createSpy('api');
			api.and.callFake(() => {
				return new Promise((resolve, reject) => {
					calls.push({ resolve, reject });
				});
			});
		});

		it('will respect individual api calls', (done) => {
			const disregardableApi = disregarder(api);
			const cat = disregardableApi();
			calls[0].resolve('I am cat');
			cat.then(catData => {
				expect(catData).toEqual('I am cat');

				const dog = disregardableApi();
				calls[1].resolve('I am dog');
				dog.then(dogData => {
					expect(dogData).toEqual('I am dog');

					done();
				});
			});
		});

		it('will disregard all but the last api call (2 calls)', (done) => {
			const disregardableApi = disregarder(api);
			const cat = disregardableApi();
			const dog = disregardableApi();
			calls[0].resolve('I am cat');
			calls[1].resolve('I am dog');

			dog.then(data => {
				expect(data).toEqual('I am dog');
				cat.catch(err => {
					expect(err).toEqual('disregarded');
					done();
				});
			});
		});

		it('will disregard all but the last api call (3 calls)', (done) => {
			const disregardableApi = disregarder(api);
			const cat = disregardableApi();
			const frog = disregardableApi();
			const dog = disregardableApi();
			calls[2].resolve('I am dog');
			calls[0].resolve('I am cat');
			calls[1].resolve('I am frog');

			dog.then(data => {
				expect(data).toEqual('I am dog');
				frog.catch(err => {
					expect(err).toEqual('disregarded');
					cat.catch(errCat => {
						expect(errCat).toEqual('disregarded');
						done();
					});
				});
			});
		});
	});
});
