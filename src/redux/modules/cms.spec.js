import deepfreeze from 'deep-freeze';

describe('cms', () => {
	let reducer;
	let actions;
	let getCmsContent;

	beforeEach(() => {
		const api = jasmine.createSpyObj('api', ['getCmsContent']);
		const moduleInjector = require('inject!./cms');
		const module = moduleInjector({
			'../../api/cms': api
		});
		reducer = module.default;
		actions = module;
		getCmsContent = api.getCmsContent;
	});

	describe('sync actions', () => {
		it('has a sync action fetchCmsContentFailure', () => {
			const expected = {
				type: actions.FETCH_CMSCONTENT_FAILURE,
				payload: {
					error: 'Oops'
				}
			};
			const actual = actions.fetchCmsContentFailure('Oops');
			expect(actual).toEqual(expected);
		});

		it('has a sync action fetchCmsContentSuccess', () => {
			const expected = {
				type: actions.FETCH_CMSCONTENT_SUCCESS,
				payload: {
					slots: {
						SpcFooter: '<p>paragraph 1</p>'
					}
				}
			};
			const actual = actions.fetchCmsContentSuccess({
				SpcFooter: '<p>paragraph 1</p>'
			});
			expect(actual).toEqual(expected);
		});
	});

	describe('async action fetchCmsContent', () => {
		let fakePromise;
		let dispatch;
		let getState;

		beforeEach(() => {
			dispatch = jasmine.createSpy('dispatch');
			getState = jasmine.createSpy('getState');
			fakePromise = jasmine.createSpyObj('fakePromise', ['then', 'catch']);
			getCmsContent.and.returnValue(fakePromise);
			fakePromise.then.and.returnValue(fakePromise);
			fakePromise.catch.and.returnValue(fakePromise);
			getState.and.returnValue({ cms: { slots: {} } });
		});

		it('will dispatch a failure on api error', () => {
			actions.fetchCmsContent()(dispatch, getState);
			dispatch.calls.reset();
			const expected = actions.fetchCmsContentFailure('Oops');
			const reject = fakePromise.then.calls.argsFor(0)[1];
			reject('Oops');
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will dispatch a success on api complete', () => {
			actions.fetchCmsContent()(dispatch, getState);
			dispatch.calls.reset();
			const expected = actions.fetchCmsContentSuccess({
				slots: {
					SpcFooter: '<p>paragraph 1</p>'
				}
			});
			const resolve = fakePromise.then.calls.argsFor(0)[0];
			resolve({
				slots: {
					SpcFooter: '<p>paragraph 1</p>'
				}
			});
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will fetch cms content if not already fetched, and not currently fetching', () => {
			getState.and.returnValue(
				{
					cms: {
						slots: {},
						isFetching: false
					}
				}
			);

			const thunk = actions.fetchCmsContent();
			thunk(dispatch, getState);

			actions.fetchCmsContent()(dispatch, getState);
			const expected = actions.fetchCmsContentSuccess({
				slots: {
					SpcFooter: '<p>paragraph 1</p>'
				}
			});
			const resolve = fakePromise.then.calls.argsFor(0)[0];
			resolve({
				slots: {
					SpcFooter: '<p>paragraph 1</p>'
				}
			});

			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will not fetch cms content when already fetching', () => {
			dispatch.calls.reset();
			getState.and.returnValue(
				{
					cms: {
						slots: {},
						isFetching: true
					}
				}
			);
			const thunk = actions.fetchCmsContent();
			thunk(dispatch, getState);
			actions.fetchCmsContent()(dispatch, getState);
			expect(dispatch).not.toHaveBeenCalled();
		});

		it('will not fetch cms content when already retrieved', () => {
			getState.and.returnValue(
				{
					cms: {
						slots: {
							SpcFooter: '<p>paragraph 1</p>'
						},
						isFetching: false
					}
				}
			);

			const thunk = actions.fetchCmsContent();
			thunk(dispatch, getState);

			actions.fetchCmsContent()(dispatch, getState);
			expect(dispatch).not.toHaveBeenCalled();
		});
	});

	describe('reducer', () => {
		it('has an initial state with an empty slots object', () => {
			const actual = reducer(undefined, {});
			const expected = { slots: {} };
			expect(actual).toEqual(expected);
		});

		it('gets the cms slot data', () => {
			const initialState = {};
			const action = {
				type: actions.FETCH_CMSCONTENT_SUCCESS,
				payload: {
					slots: {
						SpcFooter: '<p>paragraph 1</p>'
					}
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: false,
				slots: {
					SpcFooter: '<p>paragraph 1</p>'
				}
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('returns an empty slots object on error', () => {
			const initialState = {};
			const action = {
				type: actions.FETCH_CMSCONTENT_FAILURE,
				payload: {
					slots: {
						SpcFooter: '<p>paragraph 1</p>'
					}
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isFetching: false,
				slots: {}
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});
	});
});
