import * as common from './common';
import { API_END_POINT, Billing } from '../constants';

describe('Api Billing', () => {
	let module;
	let commonSpys;

	const mockGet = data => {
		commonSpys.get.and.returnValue(Promise.resolve({
			success: !!data,
			data
		}));
	};

	const mockPost = data => {
		commonSpys.post.and.returnValue(Promise.resolve({
			success: !!data,
			data
		}));
	};

	beforeEach(() => {
		commonSpys = jasmine.createSpyObj('common', ['get', 'post', 'extractProp']);
		module = require('inject!./billing')({
			'./common': commonSpys
		});
		commonSpys.extractProp.and.callFake(common.extractProp);
		commonSpys.get.and.callFake(data => Promise.resolve(data));
		commonSpys.post.and.callFake(data => Promise.resolve(data));
	});

	describe('getCountryList', () => {
		let getCountryList;

		beforeEach(() => {
			getCountryList = module.getCountryList;
		});

		it('will hit the country list endpoint', () => {
			const expected = API_END_POINT + Billing.COUNTRYLIST;
			getCountryList();
			expect(commonSpys.get).toHaveBeenCalledWith(expected);
		});

		it('will resolve countries', (done) => {
			const expected = ['england', 'ireland', 'scotland', 'wales'];
			mockGet({ countries: ['england', 'ireland', 'scotland', 'wales'] });
			getCountryList()
				.then(actual => {
					expect(actual).toEqual(expected);
					done();
				})
				.catch(err => {
					expect(err).not.toBeDefined();
					done();
				});
		});

		it('will throw an error without countries', (done) => {
			mockGet([]);
			getCountryList().catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will throw an error without success', (done) => {
			mockGet();
			getCountryList().catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will not swallow an error', (done) => {
			commonSpys.get.and.returnValue(Promise.reject('error'));
			getCountryList().catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});
	});

	describe('setAddress', () => {
		let setAddress;

		beforeEach(() => {
			setAddress = module.setAddress;
		});

		it('will post to the set address endpoint', () => {
			const form = {
				addressLine1: 'Cool',
				addressLine2: 'Address'
			};
			const ctoken = 'b3c012af647';
			const expected = [
				API_END_POINT + Billing.SETADDRESS,
				{
					body: `ctoken=${ctoken}&addressLine1=${form.addressLine1}` +
					`&addressLine2=${form.addressLine2}`
				}
			];
			setAddress(form, ctoken);
			expect(commonSpys.post).toHaveBeenCalledWith(...expected);
		});

		it('will throw an error without success', (done) => {
			const form = {
				addressLine1: 'Cool',
				addressLine2: 'Address'
			};
			const ctoken = 'b3c012af647';
			mockPost();
			setAddress(form, ctoken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will not swallow an error', (done) => {
			const form = {
				addressLine1: 'Cool',
				addressLine2: 'Address'
			};
			const ctoken = 'b3c012af647';
			commonSpys.post.and.returnValue(Promise.reject('error'));
			setAddress(form, ctoken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will throw an error without args', (done) => {
			setAddress().catch(err => {
				expect(err).toContain('Missing args');
				done();
			});
		});
	});
});
