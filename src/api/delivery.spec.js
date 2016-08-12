import deepfreeze from 'deep-freeze';
import * as common from './common';
import { API_END_POINT, Delivery } from '../constants';

describe('Api Delivery', () => {
	let module;
	let commonSpys;

	const mockPost = data => {
		commonSpys.post.and.returnValue(Promise.resolve({
			success: !!data,
			data
		}));
	};

	const mockGet = data => {
		commonSpys.get.and.returnValue(Promise.resolve({
			success: !!data,
			data
		}));
	};

	beforeEach(() => {
		commonSpys = jasmine.createSpyObj('common', ['get', 'post', 'extractProp', 'extractAll']);
		module = require('inject!./delivery')({
			'./common': commonSpys
		});
		commonSpys.extractProp.and.callFake(common.extractProp);
		commonSpys.extractAll.and.callFake(common.extractAll);
		commonSpys.get.and.callFake(data => Promise.resolve(data));
		commonSpys.post.and.callFake(data => Promise.resolve(data));
	});

	describe('Applicable Modes', () => {
		let applicableModes;

		beforeEach(() => {
			applicableModes = module.applicableModes;
		});

		it('will ask for delivery modes', () => {
			const expected = API_END_POINT + Delivery.APPLICABLE_MODES;
			applicableModes();
			expect(commonSpys.get).toHaveBeenCalledWith(expected);
		});

		it('will resolve delivery modes', (done) => {
			const expected = [1, 2, 3];
			mockGet({ deliveryModes: [1, 2, 3] });
			applicableModes()
				.then(actual => {
					expect(actual).toEqual(expected);
					done();
				})
				.catch(err => {
					expect(err).not.toBeDefined();
					done();
				});
		});

		it('will throw an error without delivery', (done) => {
			mockGet({});
			applicableModes().catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will throw an error without success', (done) => {
			mockGet();
			applicableModes().catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will not swallow an error', (done) => {
			commonSpys.get.and.returnValue(Promise.reject('error'));
			applicableModes().catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});
	});

	describe('Select Mode', () => {
		let setMode;

		beforeEach(() => {
			setMode = module.setMode;
		});

		it('will send delivery mode', () => {
			const id = 'cnc';
			const ctoken = 'b3c012af647';
			const expected = [
				API_END_POINT + Delivery.SET_MODE,
				{ body: `id=${id}&ctoken=${ctoken}` }
			];
			setMode(id, ctoken);
			expect(commonSpys.post).toHaveBeenCalledWith(...expected);
		});

		it('will save delivery mode', (done) => {
			const ctoken = 'b3c012af647';
			const expected = {
				name: 'Click + Collect',
				deliveryToStore: true,
				id: 'click-and-collect'
			};
			mockPost({ deliveryMode: {
				name: 'Click + Collect',
				deliveryToStore: true,
				id: 'click-and-collect'
			} });
			setMode(expected.id, ctoken)
				.then(actual => {
					expect(actual).toEqual(expected);
					done();
				})
				.catch(err => {
					expect(err).not.toBeDefined();
					done();
				});
		});

		it('will throw an error without response data', (done) => {
			const id = 'cnd';
			const ctoken = 'b3c012af647';
			mockPost({});
			setMode(id, ctoken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will throw an error without success', (done) => {
			const id = 'cnd';
			const ctoken = 'b3c012af647';
			mockPost();
			setMode(id, ctoken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will not swallow an error', (done) => {
			const id = 'cnd';
			const ctoken = 'b3c012af647';
			commonSpys.post.and.returnValue(Promise.reject('error'));
			setMode(id, ctoken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will throw an error without args', (done) => {
			setMode().catch(err => {
				expect(err).toContain('Missing args');
				done();
			});
		});
	});

	describe('Search Stores', () => {
		let searchStores;

		beforeEach(() => {
			searchStores = module.searchStores;
		});

		it('will send location text', () => {
			const locationText = '3000';
			const ctoken = 'b3c012af647';
			const expected = [
				API_END_POINT + Delivery.SEARCH_STORES,
				{ body: `locationText=${locationText}&ctoken=${ctoken}` }
			];
			searchStores(locationText, ctoken);
			expect(commonSpys.post).toHaveBeenCalledWith(...expected);
		});

		it('will fetch the stores by location text', (done) => {
			const locationText = '3000';
			const ctoken = 'b3c012af647';
			const expected = ['store1', 'store2', 'store3'];
			mockPost({ stores: ['store1', 'store2', 'store3'] });
			searchStores(locationText, ctoken)
				.then(actual => {
					expect(actual).toEqual(expected);
					done();
				})
				.catch(err => {
					expect(err).not.toBeDefined();
					done();
				});
		});

		it('will throw an error without response data', (done) => {
			const locationText = '3000';
			const ctoken = 'b3c012af647';
			mockPost({});
			searchStores(locationText, ctoken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will throw an error without success', (done) => {
			const locationText = '3000';
			const ctoken = 'b3c012af647';
			mockPost();
			searchStores(locationText, ctoken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will not swallow an error', (done) => {
			const locationText = '3000';
			const ctoken = 'b3c012af647';
			commonSpys.post.and.returnValue(Promise.reject('error'));
			searchStores(locationText, ctoken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will throw an error without args', (done) => {
			searchStores().catch(err => {
				expect(err).toContain('Missing args');
				done();
			});
		});
	});

	describe('Set Pickup Details', () => {
		let setPickupDetails;

		beforeEach(() => {
			setPickupDetails = module.setPickupDetails;
		});

		it('will send form data', () => {
			const form = {
				firstName: 'Glenn',
				lastName: 'Baker'
			};
			const ctoken = 'b3c012af647';
			const expected = [
				API_END_POINT + Delivery.SET_PICKUP_DETAILS,
				{ body: `ctoken=${ctoken}&firstName=${form.firstName}&lastName=${form.lastName}` }
			];
			setPickupDetails(form, ctoken);
			expect(commonSpys.post).toHaveBeenCalledWith(...expected);
		});

		it('will fetch the stores by location text', (done) => {
			const form = {
				firstName: 'Glenn',
				lastName: 'Baker'
			};
			const ctoken = 'b3c012af647';
			const expected = {
				contact: {
					name: 'Glenn Baker'
				},
				store: {
					storeNumber: '5000'
				}
			};
			deepfreeze(expected);
			mockPost(expected);
			setPickupDetails(form, ctoken)
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
			const form = {
				firstName: 'Glenn',
				lastName: 'Baker'
			};
			const ctoken = 'b3c012af647';
			mockPost();
			setPickupDetails(form, ctoken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will not swallow an error', (done) => {
			const form = {
				firstName: 'Glenn',
				lastName: 'Baker'
			};
			const ctoken = 'b3c012af647';
			commonSpys.post.and.returnValue(Promise.reject('error'));
			setPickupDetails(form, ctoken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will throw an error without args', (done) => {
			setPickupDetails().catch(err => {
				expect(err).toContain('Missing args');
				done();
			});
		});
	});

	describe('Fetch Address', () => {
		let getSavedAddresses;

		beforeEach(() => {
			getSavedAddresses = module.getSavedAddresses;
		});

		it('will fetch saved addresses', () => {
			const delMode = 'hd';
			const expected = API_END_POINT + Delivery.SAVED_ADDRESSESES;
			getSavedAddresses(delMode);
			expect(commonSpys.get).toHaveBeenCalledWith(expected);
		});

		it('will throw an error without args', () => {
			getSavedAddresses().catch(err => {
				expect(err).toContain('Missing args');
			});
		});

		it('will throw an error with empty arguments', (done) => {
			const delMode = 'hd';
			mockGet({});
			getSavedAddresses(delMode).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will not swallow an error', (done) => {
			const delMode = 'hd';
			commonSpys.get.and.returnValue(Promise.reject('error'));
			getSavedAddresses(delMode).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});
	});

	describe('Add Address', () => {
		let addAddress;

		beforeEach(() => {
			addAddress = module.addAddress;
		});

		it('will send form data', () => {
			const form = {
				addressLine1: '123',
				addressLine2: 'Street'
			};
			const ctoken = 'b3c012af647';
			const expected = [
				API_END_POINT + Delivery.CREATE_ADDRESS,
				{ body: `ctoken=${ctoken}&addressLine1=${form.addressLine1}` +
				`&addressLine2=${form.addressLine2}` }
			];
			addAddress(form, ctoken);
			expect(commonSpys.post).toHaveBeenCalledWith(...expected);
		});

		it('will send undefined as empty', () => {
			const form = {
				addressLine1: '123',
				addressLine2: undefined
			};
			const ctoken = 'b3c012af647';
			const expected = [
				API_END_POINT + Delivery.CREATE_ADDRESS,
				{ body: `ctoken=${ctoken}&addressLine1=${form.addressLine1}` +
				`&addressLine2=` }
			];
			addAddress(form, ctoken);
			expect(commonSpys.post).toHaveBeenCalledWith(...expected);
		});

		it('will throw an error without success', (done) => {
			const form = {
				addressLine1: '123',
				addressLine2: 'Fake Street'
			};
			const ctoken = 'b3c012af647';
			mockPost();
			addAddress(form, ctoken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will not swallow an error', (done) => {
			const form = {
				addressLine1: '123',
				addressLine2: 'Fake Street'
			};
			const ctoken = 'b3c012af647';
			commonSpys.post.and.returnValue(Promise.reject('error'));
			addAddress(form, ctoken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will throw an error without args', (done) => {
			addAddress().catch(err => {
				expect(err).toContain('Missing args');
				done();
			});
		});
	});

	describe('Search Address', () => {
		let searchAddress;
		let address;

		beforeEach(() => {
			searchAddress = module.searchAddress;
			address = '123 Fake';
		});

		it('will fetch saved addresses', () => {
			const ctoken = 'b3c012af647';
			const expected = [
				API_END_POINT + Delivery.SEARCH_ADDRESS,
				{ body: `text=123 Fake&ctoken=${ctoken}` }
			];
			searchAddress(address, ctoken);
			expect(commonSpys.post).toHaveBeenCalledWith(...expected);
		});

		it('will throw an error without args', () => {
			searchAddress().catch(err => {
				expect(err).toContain('Missing args');
			});
		});

		it('will throw an error with empty arguments', (done) => {
			mockPost({});
			searchAddress(address).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will not swallow an error', (done) => {
			commonSpys.get.and.returnValue(Promise.reject('error'));
			searchAddress(address).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});
	});

	describe('Set Address', () => {
		let setAddress;
		const addressId = 1;
		const deliveryMode = 'hd';
		const ctoken = 'b3c012af647';

		beforeEach(() => {
			setAddress = module.setAddress;
		});

		it('will send address id and delivery mode', () => {
			const expected = [
				API_END_POINT + Delivery.SET_ADDRESS,
				{ body: `addressId=${addressId}&deliveryModeId=${deliveryMode}&ctoken=${ctoken}` }
			];
			setAddress(addressId, deliveryMode, ctoken);
			expect(commonSpys.post).toHaveBeenCalledWith(...expected);
		});

		it('will throw an error without args', (done) => {
			setAddress().catch(err => {
				expect(err).toContain('Missing args');
				done();
			});
		});

		it('will throw an error without success', (done) => {
			mockPost();
			setAddress(addressId, deliveryMode, ctoken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will not swallow an error', (done) => {
			commonSpys.post.and.returnValue(Promise.reject('error'));
			setAddress(addressId, deliveryMode, ctoken).catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});
	});
});
