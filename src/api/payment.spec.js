import * as common from './common';
import { API_END_POINT, Payment } from '../constants';

describe('Api Payment', () => {
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
		commonSpys = jasmine.createSpyObj('common', ['post', 'get', 'extractProp', 'extractAll']);
		module = require('inject!./payment')({
			'./common': commonSpys
		});
		commonSpys.extractProp.and.callFake(common.extractProp);
		commonSpys.extractAll.and.callFake(common.extractAll);
		commonSpys.get.and.callFake(data => Promise.resolve(data));
		commonSpys.post.and.callFake(data => Promise.resolve(data));
	});

	describe('Applicable Methods', () => {
		let applicableMethods;

		beforeEach(() => {
			applicableMethods = module.applicableMethods;
		});

		it('will ask for payment methods', () => {
			const expected = API_END_POINT + Payment.APPLICABLE_METHODS;
			applicableMethods();
			expect(commonSpys.get).toHaveBeenCalledWith(expected);
		});

		it('will resolve payment methods', (done) => {
			const expected = [1, 2, 3];
			mockGet({ paymentMethods: [1, 2, 3] });
			applicableMethods()
				.then(actual => {
					expect(actual).toEqual(expected);
					done();
				})
				.catch(err => {
					expect(err).not.toBeDefined();
					done();
				});
		});

		it('will throw an error without payment methods', (done) => {
			mockGet([]);
			applicableMethods().catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will throw an error without success', (done) => {
			mockGet();
			applicableMethods().catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will not swallow an error', (done) => {
			commonSpys.get.and.returnValue(Promise.reject('error'));
			applicableMethods().catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});
	});

	describe('setIpgMode', () => {
		let setIpgMode;

		beforeEach(() => {
			setIpgMode = module.setIpgMode;
		});

		it('will send ipg payment mode', () => {
			const id = 'giftcard';
			const ctoken = 'b3c012af647';
			const expected = [
				API_END_POINT + Payment.SET_IPG_MODE,
				{ body: `id=${id}&ctoken=${ctoken}` }
			];
			setIpgMode(id, ctoken);
			expect(commonSpys.post).toHaveBeenCalledWith(...expected);
		});

		it('will save ipg payment mode', (done) => {
			const ctoken = 'b3c012af647';
			const expected = {
				paymentMethod: 'giftcard',
				iframeUrl: '~iframeUrl~'
			};
			mockPost({
				paymentMethod: 'giftcard',
				iframeUrl: '~iframeUrl~'
			});
			setIpgMode(expected.paymentMethod, ctoken)
				.then(actual => {
					expect(actual).toEqual(expected);
					done();
				})
				.catch(err => {
					expect(err).not.toBeDefined();
					done();
				});
		});

		it('will throw an error without success', (done) => {
			const ipgMode = 'giftcard';
			const ctoken = 'b3c012af647';
			mockPost();
			setIpgMode(ipgMode, ctoken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will not swallow an error', (done) => {
			const ipgMode = 'giftcard';
			const ctoken = 'b3c012af647';
			commonSpys.post.and.returnValue(Promise.reject('error'));
			setIpgMode(ipgMode, ctoken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will throw an error without args', (done) => {
			setIpgMode().catch(err => {
				expect(err).toContain('Missing args');
				done();
			});
		});
	});

	describe('setPayPalMode', () => {
		let setPayPalMode;

		beforeEach(() => {
			setPayPalMode = module.setPayPalMode;
		});

		it('will send paypal payment mode', () => {
			const ctoken = 'a9b3c7de01f';
			const expected = [
				API_END_POINT + Payment.SET_PAYPAL_MODE,
				{}
			];
			setPayPalMode(ctoken);
			expect(commonSpys.post).toHaveBeenCalledWith(...expected);
		});

		it('will save paypal payment mode', (done) => {
			const ctoken = 'a9b3c7de01f';
			const expected = {
				paypalUrl: '~paypalUrl~'
			};
			mockPost({
				paypalUrl: '~paypalUrl~'
			});
			setPayPalMode(ctoken)
				.then(actual => {
					expect(actual).toEqual(expected);
					done();
				})
				.catch(err => {
					expect(err).not.toBeDefined();
					done();
				});
		});

		it('will throw an error without success', (done) => {
			const ctoken = 'a9b3c7de01f';
			mockPost();
			setPayPalMode(ctoken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will not swallow an error', (done) => {
			const ctoken = 'a9b3c7de01f';
			commonSpys.post.and.returnValue(Promise.reject('error'));
			setPayPalMode(ctoken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will throw an error without args', (done) => {
			setPayPalMode().catch(err => {
				expect(err).toContain('Missing args');
				done();
			});
		});
	});

	describe('placeOrderIpg', () => {
		let placeOrderIpg;

		beforeEach(() => {
			placeOrderIpg = module.placeOrderIpg;
		});

		it('will send a request to place order', () => {
			const ctoken = 'a9b3c7de01f';
			const SST = 'SST';
			const sessionId = 'testSessionId';
			const expected = [
				API_END_POINT + Payment.PLACE_ORDER_IPG,
				{ body: `SST=${SST}&sessionId=${sessionId}&ctoken=${ctoken}` }
			];
			placeOrderIpg(SST, sessionId, ctoken);
			expect(commonSpys.post).toHaveBeenCalledWith(...expected);
		});

		it('will save paypal payment mode', (done) => {
			const ctoken = 'a9b3c7de01f';
			const SST = 'SST';
			const sessionId = 'testSessionId';
			const expected = '~redirectUrl~';
			mockPost({
				redirectUrl: '~redirectUrl~'
			});
			placeOrderIpg(SST, sessionId, ctoken)
				.then(actual => {
					expect(actual).toEqual(expected);
					done();
				})
				.catch(err => {
					expect(err).not.toBeDefined();
					done();
				});
		});

		it('will throw an error without success', (done) => {
			const ctoken = 'a9b3c7de01f';
			mockPost();
			placeOrderIpg(ctoken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will not swallow an error', (done) => {
			const ctoken = 'a9b3c7de01f';
			commonSpys.post.and.returnValue(Promise.reject('error'));
			placeOrderIpg(ctoken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will throw an error without args', (done) => {
			placeOrderIpg().catch(err => {
				expect(err).toContain('Missing args');
				done();
			});
		});

		it('will throw an error with not enough args', (done) => {
			placeOrderIpg('arg1').catch(err => {
				expect(err).toContain('Missing args');
				done();
			});
		});
		it('will throw an error with not enough args', (done) => {
			placeOrderIpg('arg1', 'arg2').catch(err => {
				expect(err).toContain('Missing args');
				done();
			});
		});
	});
});
