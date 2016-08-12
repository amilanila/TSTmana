import * as common from './common';
import { API_END_POINT, Misc } from '../constants';

describe('Api Misc', () => {
	let getSession;
	let getEnv;
	let commonSpys;

	beforeEach(() => {
		commonSpys = jasmine.createSpyObj('common', ['get', 'post', 'extractProp']);
		const moduleInjector = require('inject!./misc');
		const module = moduleInjector({
			'./common': commonSpys
		});
		commonSpys.extractProp.and.callFake(common.extractProp);
		commonSpys.get.and.callFake(data => Promise.resolve(data));
		commonSpys.post.and.callFake(data => Promise.resolve(data));

		getSession = module.getSession;
		getEnv = module.getEnv;
	});

	describe('Get Session', () => {
		const mockGet = data => {
			commonSpys.get.and.returnValue(Promise.resolve({
				success: !!data,
				data
			}));
		};

		it('will ask for session', () => {
			const expected = API_END_POINT + Misc.SESSION;
			getSession();
			expect(commonSpys.get).toHaveBeenCalledWith(expected);
		});

		it('will resolve session', (done) => {
			const expected = { csrfToken: '784nf9jnhf93jhf03nhfgskf93jg' };
			mockGet({ session: { csrfToken: '784nf9jnhf93jhf03nhfgskf93jg' } });
			getSession()
				.then(actual => {
					expect(actual).toEqual(expected);
					done();
				})
				.catch(err => {
					expect(err).not.toBeDefined();
					done();
				});
		});

		it('will throw an error without session', (done) => {
			mockGet({});
			getSession().catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will throw an error without success', (done) => {
			mockGet();
			getSession().catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will not swallow an error', (done) => {
			commonSpys.get.and.returnValue(Promise.reject('error'));
			getSession().catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});
	});

	describe('Get Env', () => {
		const mockGet = data => {
			commonSpys.get.and.returnValue(Promise.resolve({
				success: !!data,
				data
			}));
		};

		it('will ask for env', () => {
			const expected = API_END_POINT + Misc.ENV;
			getEnv();
			expect(commonSpys.get).toHaveBeenCalledWith(expected);
		});

		it('will resolve env', (done) => {
			const expected = {
				gaId: 'ga0001',
				gtmId: 'gtm0001',
				fqdn: 'http://target.com.au'
			};
			mockGet({
				env: {
					gaId: 'ga0001',
					gtmId: 'gtm0001',
					fqdn: 'http://target.com.au'
				} });

			getEnv()
				.then(actual => {
					expect(actual).toEqual(expected);
					done();
				})
				.catch(err => {
					expect(err).not.toBeDefined();
					done();
				});
		});

		it('will throw an error without env', (done) => {
			mockGet({});
			getEnv().catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will throw an error without success', (done) => {
			mockGet();
			getEnv().catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will not swallow an error', (done) => {
			commonSpys.get.and.returnValue(Promise.reject('error'));
			getEnv().catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});
	});
});
