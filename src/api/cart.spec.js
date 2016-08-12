import deepfreeze from 'deep-freeze';
import * as common from './common';
import { API_END_POINT, Cart } from '../constants';

describe('API Cart', () => {
	let module;
	let commonSpys;

	const mockGet = data => {
		commonSpys.get.and.returnValue(Promise.resolve({
			success: !!data,
			data
		}));
	};

	beforeEach(() => {
		commonSpys = jasmine.createSpyObj('common', ['get', 'extractAll', 'disregarder']);
		commonSpys.disregarder.and.callFake(api => api);
		module = require('inject!./cart')({
			'./common': commonSpys
		});
		commonSpys.extractAll.and.callFake(common.extractAll);
		commonSpys.get.and.callFake(data => Promise.resolve(data));
	});

	describe('cartDetail', () => {
		let cartDetail;

		beforeEach(() => {
			cartDetail = module.cartDetail;
		});

		it('will ask cart summary', () => {
			const expected = API_END_POINT + Cart.DETAIL;
			cartDetail();
			expect(commonSpys.get).toHaveBeenCalledWith(expected);
		});

		it('will throw an error without success', (done) => {
			mockGet();
			cartDetail().catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will not swallow an error', (done) => {
			commonSpys.get.and.returnValue(Promise.reject('error'));
			cartDetail().catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('returns empty when response is empty', (done) => {
			mockGet({});
			cartDetail()
			.then(actual => {
				expect(actual).toEqual({});
				done();
			})
			.catch(err => {
				expect(err).not.toBeDefined();
				done();
			});
		});

		it('will fetch cart details', (done) => {
			const expected = {
				deliveryMode: { id: 'cnc', name: 'Click + Collect', deliveryToStore: true },
				store: {
					storeNumber: '123',
					name: 'Target store',
					available: true,
					address: {
						phone: '03 5512 3456', state: 'VIC'
					}
				}
			};
			mockGet({
				deliveryMode: { id: 'cnc', name: 'Click + Collect', deliveryToStore: true },
				store: {
					storeNumber: '123',
					name: 'Target store',
					available: true,
					address: {
						phone: '03 5512 3456', state: 'VIC'
					}
				}
			});
			cartDetail()
			.then(actual => {
				expect(actual).toEqual(expected);
				done();
			})
			.catch(err => {
				expect(err).not.toBeDefined();
				done();
			});
		});
	});

	describe('cartSummary', () => {
		let cartSummary;

		beforeEach(() => {
			cartSummary = module.cartSummary;
		});

		it('will ask cart summary', () => {
			const expected = API_END_POINT + Cart.SUMMARY;
			cartSummary();
			expect(commonSpys.get).toHaveBeenCalledWith(expected);
		});


		it('will throw an error without success', (done) => {
			mockGet();
			cartSummary().catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will not swallow an error', (done) => {
			commonSpys.get.and.returnValue(Promise.reject('error'));
			cartSummary().catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('returns empty when response is empty', (done) => {
			mockGet({});
			cartSummary()
			.then(actual => {
				expect(actual).toEqual({});
				done();
			})
			.catch(err => {
				expect(err).not.toBeDefined();
				done();
			});
		});

		it('will fetch cart summary', (done) => {
			const expected = {
				subtotal: { price: 1 },
				deliveryFee: { price: 2 },
				total: { price: 3 },
				entries: ['array', 'of', 'products']
			};
			deepfreeze(expected);
			mockGet(expected);
			cartSummary()
			.then(actual => {
				expect(actual).toEqual(expected);
				done();
			})
			.catch(err => {
				expect(err).not.toBeDefined();
				done();
			});
		});
	});
});
