import deepfreeze from 'deep-freeze';
import { feedbackError, feedbackDismiss } from './feedback';

describe('Pickup Details', () => {
	let reducer;
	let actions;
	let setPickupDetails;
	let analytics;

	const mockTrackData = (...args) => ({ 'called->analyticsCheckoutOption->With': args });

	beforeEach(() => {
		const api = jasmine.createSpyObj('api', ['setPickupDetails']);
		analytics = jasmine.createSpyObj('analytics', ['analyticsCheckoutOption']);
		const moduleInjector = require('inject!./pickupDetails');
		const module = moduleInjector({
			'../../api/delivery': api,
			'./analytics': analytics
		});
		reducer = module.default;
		actions = module;
		setPickupDetails = api.setPickupDetails;

		analytics.analyticsCheckoutOption.and.callFake(mockTrackData);
	});

	describe('reducer', () => {
		it('has an empty initial state', () => {
			const expected = {};
			const actual = reducer(undefined, {});
			expect(actual).toEqual(expected);
		});

		it('has a pending status for fetching', () => {
			const initialState = {};
			const action = {
				type: actions.SAVE_PICKUPDETAILS_REQUEST,
				payload: {
					fieldValues: {
						storeNumber: '5000',
						firstName: 'Glenn',
						lastName: 'Baker'
					}
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				saveInProgress: true,
				fieldValues: {
					storeNumber: '5000',
					firstName: 'Glenn',
					lastName: 'Baker'
				}
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('inits the pickup details', () => {
			const initialState = {};
			const action = {
				type: actions.INIT_PICKUPDETAILS,
				payload: {
					store: {
						storeNumber: '5000'
					},
					contact: {
						firstName: 'Glenn',
						lastName: 'Baker'
					}
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				saveInProgress: false,
				store: {
					storeNumber: '5000'
				},
				contact: {
					firstName: 'Glenn',
					lastName: 'Baker'
				}
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('sets the pickup details with whatever was saved', () => {
			const initialState = {};
			const action = {
				type: actions.SAVE_PICKUPDETAILS_SUCCESS,
				payload: {
					store: {
						storeNumber: '5000'
					},
					contact: {
						firstName: 'Glenn',
						lastName: 'Baker'
					}
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				saveInProgress: false,
				store: {
					storeNumber: '5000'
				},
				contact: {
					firstName: 'Glenn',
					lastName: 'Baker'
				}
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('replaces the existing pickup details with whatever was saved', () => {
			const initialState = {
				saveInProgress: false,
				store: {
					storeNumber: '5000'
				},
				contact: {
					firstName: 'Glen',
					lastName: 'Baker'
				}
			};
			const action = {
				type: actions.SAVE_PICKUPDETAILS_SUCCESS,
				payload: {
					store: {
						storeNumber: '6000'
					},
					contact: {
						firstName: 'Glenn',
						lastName: 'Baker'
					}
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				saveInProgress: false,
				store: {
					storeNumber: '6000'
				},
				contact: {
					firstName: 'Glenn',
					lastName: 'Baker'
				}
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('removes selected delivery mode when save failed', () => {
			const initialState = {
				saveInProgress: false,
				store: {
					storeNumber: '5000'
				},
				contact: {
					firstName: 'Glenn',
					lastName: 'Baker'
				}
			};
			const action = {
				type: actions.SAVE_PICKUPDETAILS_FAILURE,
				payload: {
					fieldValues: {
						storeNumber: '5000',
						firstName: 'Glenn',
						lastName: 'Baker'
					},
					error: 'Oops'
				}
			};
			deepfreeze(action);
			deepfreeze(initialState);
			const actual = reducer(initialState, action);
			const expected = {
				saveInProgress: false,
				fieldValues: {
					storeNumber: '5000',
					firstName: 'Glenn',
					lastName: 'Baker'
				}
			};
			expect(actual).toEqual(expected);
		});

		it('converts current store and contact', () => {
			const initialState = {
				saveInProgress: false,
				store: {
					storeNumber: '5000'
				},
				contact: {
					firstName: 'Glenn',
					lastName: 'Baker'
				}
			};
			const action = {
				type: actions.CHANGE_PICKUPDETAILS
			};
			deepfreeze(action);
			deepfreeze(initialState);
			const actual = reducer(initialState, action);
			const expected = {
				saveInProgress: false,
				fieldValues: {
					storeNumber: '5000',
					firstName: 'Glenn',
					lastName: 'Baker'
				}
			};
			expect(actual).toEqual(expected);
		});
	});

	describe('sync actions', () => {
		it('has a sync action initPickupDetails', () => {
			const payload = {
				store: {
					storeNumber: '5000'
				},
				contact: {
					firstName: 'Glenn',
					lastName: 'Baker'
				}
			};
			deepfreeze(payload);
			const expected = {
				type: actions.INIT_PICKUPDETAILS,
				payload: {
					store: payload.store,
					contact: payload.contact
				}
			};
			const actual = actions.initPickupDetails(payload);
			expect(actual).toEqual(expected);
		});

		it('has a sync action savePickupDetailsRequest', () => {
			const payload = {
				fieldValues: {
					storeNumber: '5000',
					firstName: 'Glenn',
					lastName: 'Baker'
				}
			};
			deepfreeze(payload);
			const expected = {
				type: actions.SAVE_PICKUPDETAILS_REQUEST,
				payload,
				meta: {
					feedback: feedbackDismiss()
				}
			};
			const actual = actions.savePickupDetailsRequest(payload.fieldValues);
			expect(actual).toEqual(expected);
		});

		it('has a sync action savePickupDetailsFailure', () => {
			const payload = {
				fieldValues: {
					storeNumber: '5000',
					firstName: 'Glenn',
					lastName: 'Baker'
				}
			};
			deepfreeze(payload);
			const expected = {
				type: actions.SAVE_PICKUPDETAILS_FAILURE,
				payload: {
					fieldValues: payload.fieldValues,
					error: 'Oops'
				},
				meta: {
					feedback: feedbackError('Error Message')
				}
			};
			const actual = actions.savePickupDetailsFailure(payload.fieldValues, 'Oops', 'Error Message');
			expect(actual).toEqual(expected);
		});

		it('has a sync action savePickupDetailsSuccess', () => {
			const payload = {
				store: {
					storeNumber: '5000'
				},
				contact: {
					firstName: 'Glenn',
					lastName: 'Baker'
				}
			};
			deepfreeze(payload);
			const expected = {
				type: actions.SAVE_PICKUPDETAILS_SUCCESS,
				payload: {
					store: payload.store,
					contact: payload.contact
				}
			};
			const actual = actions.savePickupDetailsSuccess(payload);
			expect(actual).toEqual(expected);
		});
	});

	describe('async action savePickupDetails', () => {
		let dispatch;
		let fakePromise;
		let getState;

		beforeEach(() => {
			dispatch = jasmine.createSpy('dispatch');
			getState = jasmine.createSpy('getState');
			fakePromise = jasmine.createSpyObj('fakePromise', ['then', 'catch']);
			setPickupDetails.and.returnValue(fakePromise);
			fakePromise.then.and.returnValue(fakePromise);
			fakePromise.catch.and.returnValue(fakePromise);
			getState.and.returnValue({ session: { info: { csrfToken: '~csrfToken~' } } });
			const thunk = actions.savePickupDetails({
				storeNumber: '5000',
				firstName: 'Glenn',
				lastName: 'Baker'
			});
			thunk(dispatch, getState);
		});

		it('initiates the request', () => {
			const expected = {
				type: actions.SAVE_PICKUPDETAILS_REQUEST,
				payload: {
					fieldValues: {
						storeNumber: '5000',
						firstName: 'Glenn',
						lastName: 'Baker'
					}
				},
				meta: {
					feedback: feedbackDismiss()
				}
			};
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('calls the api setPickupDetails', () => {
			expect(setPickupDetails).toHaveBeenCalledWith({
				storeNumber: '5000',
				firstName: 'Glenn',
				lastName: 'Baker'
			}, '~csrfToken~');
		});

		it('will dispatch a failure on api error', () => {
			dispatch.calls.reset();
			const expected = {
				type: actions.SAVE_PICKUPDETAILS_FAILURE,
				payload: {
					fieldValues: {
						storeNumber: '5000',
						firstName: 'Glenn',
						lastName: 'Baker'
					},
					error: 'Oops'
				},
				meta: {
					feedback: feedbackError(jasmine.any(String))
				}
			};
			const reject = fakePromise.then.calls.argsFor(0)[1];
			reject('Oops');
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will dispatch a success on api complete', () => {
			dispatch.calls.reset();
			const payload = {
				store: {
					storeNumber: '5000'
				},
				contact: {
					firstName: 'Glenn',
					lastName: 'Baker'
				}
			};
			deepfreeze(payload);
			const expected = {
				type: actions.SAVE_PICKUPDETAILS_SUCCESS,
				payload: {
					store: payload.store,
					contact: payload.contact
				}
			};
			const resolve = fakePromise.then.calls.argsFor(0)[0];
			resolve(payload);
			expect(dispatch).toHaveBeenCalledWith(expected);
		});
	});
});
