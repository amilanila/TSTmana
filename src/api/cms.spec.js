import deepfreeze from 'deep-freeze';
import * as common from './common';
import { API_END_POINT, CmsAPI } from '../constants';

describe('API Cms', () => {
	let module;
	let commonSpys;

	const mockGet = data => {
		commonSpys.get.and.returnValue(Promise.resolve({
			success: !!data,
			data
		}));
	};

	beforeEach(() => {
		commonSpys = jasmine.createSpyObj('common', ['get', 'extractProp']);
		module = require('inject!./cms')({
			'./common': commonSpys
		});
		commonSpys.extractProp.and.callFake(common.extractProp);
		commonSpys.get.and.callFake(data => Promise.resolve(data));
	});

	describe('getCmsContent', () => {
		let getCmsContent;

		beforeEach(() => {
			getCmsContent = module.getCmsContent;
		});

		it('will ask cms summary', () => {
			const expected = API_END_POINT + CmsAPI.CONTENT;
			getCmsContent();
			expect(commonSpys.get).toHaveBeenCalledWith(expected);
		});

		it('will throw an error without success', (done) => {
			mockGet();
			getCmsContent().catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('will not swallow an error', (done) => {
			commonSpys.get.and.returnValue(Promise.reject('error'));
			getCmsContent().catch(err => {
				expect(err).toBeDefined();
				done();
			});
		});

		it('returns an error when response is empty', (done) => {
			mockGet({});
			getCmsContent().catch(err => {
				expect(err).toEqual('extract-prop-error');
				done();
			});
		});

		it('will fetch cms content', (done) => {
			const expected = {
				SpcFooter: '<p>paragraph 1<\/p>'
			};
			deepfreeze(expected);
			mockGet({
				slots: {
					SpcFooter: '<p>paragraph 1<\/p>'
				}
			});
			getCmsContent()
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
