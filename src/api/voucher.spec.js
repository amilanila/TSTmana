import deepfreeze from 'deep-freeze';
import * as common from './common';
import { API_END_POINT, Discount } from '../constants';

describe('API Voucher', () => {
	let module;
	let commonSpys;

	const mockPost = data => {
		commonSpys.post.and.returnValue(Promise.resolve({
			success: !!data,
			data
		}));
	};

	beforeEach(() => {
		commonSpys = jasmine.createSpyObj('common', ['post', 'confirmSuccess', 'extractProp']);
		module = require('inject!./voucher')({
			'./common': commonSpys
		});
		commonSpys.extractProp.and.callFake(common.extractProp);
		commonSpys.confirmSuccess.and.callFake(common.confirmSuccess);
		commonSpys.post.and.callFake(data => Promise.resolve(data));
	});

	describe('Apply Voucher', () => {
		let applyVoucher;
		let code;
		let csrfToken;

		beforeEach(() => {
			code = 'VALID_CODE';
			csrfToken = 'b3c012af647';
			applyVoucher = module.applyVoucher;
		});

		it('will send the voucher code', () => {
			const expected = [
				API_END_POINT + Discount.APPLY_VOUCHER,
				{ body: `code=${code}&ctoken=${csrfToken}` }
			];

			applyVoucher(code, csrfToken);
			expect(commonSpys.post).toHaveBeenCalledWith(...expected);
		});

		it('will apply a valid voucher code', (done) => {
			const expected = {
				code
			};
			deepfreeze(expected);
			mockPost({
				voucher: {
					code
				}
			});
			applyVoucher(code, csrfToken)
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
			mockPost();
			applyVoucher(code, csrfToken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will not swallow an error', (done) => {
			commonSpys.post.and.returnValue(Promise.reject('error'));
			applyVoucher(code, csrfToken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will throw an error without args', (done) => {
			applyVoucher().catch(err => {
				expect(err).toContain('Missing args');
				done();
			});
		});
	});

	describe('Remove Voucher', () => {
		let removeVoucher;
		let code;
		let csrfToken;

		beforeEach(() => {
			code = 'VALID_CODE';
			csrfToken = 'b3c012af647';
			removeVoucher = module.removeVoucher;
		});

		it('will send the csrfToken', () => {
			const expected = [
				API_END_POINT + Discount.REMOVE_VOUCHER,
				{ body: `ctoken=${csrfToken}` }
			];

			removeVoucher(csrfToken);
			expect(commonSpys.post).toHaveBeenCalledWith(...expected);
		});

		it('will confirm success on completion', (done) => {
			mockPost({
				success: true
			});
			removeVoucher(csrfToken)
				.then(() => {
					expect(commonSpys.confirmSuccess).toHaveBeenCalled();
					done();
				})
				.catch(err => {
					expect(err).not.toBeDefined();
					done();
				});
		});

		it('will throw an error without success', (done) => {
			mockPost();
			removeVoucher(csrfToken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will not swallow an error', (done) => {
			commonSpys.post.and.returnValue(Promise.reject('error'));
			removeVoucher(code, csrfToken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will throw an error without args', (done) => {
			removeVoucher().catch(err => {
				expect(err).toContain('Missing args');
				done();
			});
		});
	});

	describe('Apply TMD', () => {
		let applyTmd;
		let tmdNumber;
		let csrfToken;

		beforeEach(() => {
			tmdNumber = 'VALID_TMD';
			csrfToken = 'b3c012af647';
			applyTmd = module.applyTmd;
		});

		it('will send the tmdNumber', () => {
			const expected = [
				API_END_POINT + Discount.APPLY_TMD,
				{ body: `code=${tmdNumber}&ctoken=${csrfToken}` }
			];

			applyTmd(tmdNumber, csrfToken);
			expect(commonSpys.post).toHaveBeenCalledWith(...expected);
		});

		it('will apply a valid tmd number', (done) => {
			const expected = {
				tmdNumber
			};
			deepfreeze(expected);
			mockPost({
				tmdNumber: {
					tmdNumber
				}
			});
			applyTmd(tmdNumber, csrfToken)
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
			mockPost();
			applyTmd(tmdNumber, csrfToken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will not swallow an error', (done) => {
			commonSpys.post.and.returnValue(Promise.reject('error'));
			applyTmd(tmdNumber, csrfToken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will throw an error without args', (done) => {
			applyTmd().catch(err => {
				expect(err).toContain('Missing args');
				done();
			});
		});
	});

	describe('Apply Flybuys', () => {
		let applyFlybuys;
		let flybuysCode;
		let csrfToken;

		beforeEach(() => {
			flybuysCode = 'VALID_FLYBUYS';
			csrfToken = 'b3c012af647';
			applyFlybuys = module.applyFlybuys;
		});

		it('will send the flybuysCode', () => {
			const expected = [
				API_END_POINT + Discount.APPLY_FLYBUYS,
				{ body: `code=${flybuysCode}&ctoken=${csrfToken}` }
			];

			applyFlybuys(flybuysCode, csrfToken);
			expect(commonSpys.post).toHaveBeenCalledWith(...expected);
		});

		it('will apply a valid flybuys code', (done) => {
			const expected = {
				flybuysCode
			};
			deepfreeze(expected);
			mockPost({
				flybuysCode: {
					flybuysCode
				}
			});
			applyFlybuys(flybuysCode, csrfToken)
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
			mockPost();
			applyFlybuys(flybuysCode, csrfToken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will not swallow an error', (done) => {
			commonSpys.post.and.returnValue(Promise.reject('error'));
			applyFlybuys(flybuysCode, csrfToken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will throw an error without args', (done) => {
			applyFlybuys().catch(err => {
				expect(err).toContain('Missing args');
				done();
			});
		});
	});
});
