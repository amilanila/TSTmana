import deepfreeze from 'deep-freeze';
import { feedbackError, feedbackDismiss } from './feedback';
import localeText from '../../helpers/locale-text';
import { PaymentMethods } from '../../constants';

describe('selectedPaymentMethod', () => {
	let reducer;
	let actions;
	let setIpgMode;
	let fakePromise;
	const mockTrackData = (...args) => 'TrackData->' + args;
	const mockTrackEvent = (...args) => 'TrackEvent->' + args;

	beforeEach(() => {
		const api = jasmine.createSpyObj('api', ['setIpgMode', 'setPayPalMode']);
		const analytics = jasmine.createSpyObj('analytics',
			['analyticsCheckoutStep', 'analyticsEvent']);

		const moduleInjector = require('inject!./selectedPaymentMethod');
		const module = moduleInjector({
			'../../api/payment': api,
			'./analytics': analytics
		});
		fakePromise = jasmine.createSpyObj('fakePromise', ['then', 'catch']);
		api.setPayPalMode.and.returnValue(fakePromise);
		api.setIpgMode.and.returnValue(fakePromise);
		fakePromise.then.and.returnValue(fakePromise);
		fakePromise.catch.and.returnValue(fakePromise);
		reducer = module.default;
		actions = module;
		setIpgMode = api.setIpgMode;
		analytics.analyticsCheckoutStep.and.callFake(mockTrackData);
		analytics.analyticsEvent.and.callFake(mockTrackEvent);
	});

	describe('reducer', () => {
		it('has empty selectedPaymentMethod.method for initial state', () => {
			const actual = reducer(undefined, {});
			const expected = { method: {} };
			expect(actual).toEqual(expected);
		});

		it('has a pending status for fetching', () => {
			const initialState = {};
			const action = {
				type: actions.SAVE_PAYMENTMETHOD_REQUEST,
				payload: { intendedMethod: PaymentMethods.IPG }
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: true,
				method: {
					id: PaymentMethods.IPG,
					ipg: true,
					paypal: false
				}
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('sets the ipg method on success', () => {
			const initialState = {};
			const action = {
				type: actions.SAVE_PAYMENTMETHOD_SUCCESS,
				payload: {
					paymentMethod: PaymentMethods.IPG,
					iframeUrl: '/ipg-url'
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: false,
				method: {
					id: PaymentMethods.IPG,
					ipg: true,
					paypal: false,
					iframeUrl: '/ipg-url'
				}
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('sets the giftcard method on success', () => {
			const initialState = {};
			const action = {
				type: actions.SAVE_PAYMENTMETHOD_SUCCESS,
				payload: {
					paymentMethod: PaymentMethods.GIFTCARD,
					iframeUrl: '/ipg-url'
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: false,
				method: {
					id: PaymentMethods.GIFTCARD,
					ipg: true,
					paypal: false,
					iframeUrl: '/ipg-url'
				}
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('sets the paypal method intent', () => {
			const initialState = {};
			const action = {
				type: actions.PAYMENTMETHOD_INTENT,
				payload: {
					paymentMethod: PaymentMethods.PAYPAL
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: false,
				method: {
					id: PaymentMethods.PAYPAL,
					ipg: false,
					paypal: true
				}
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('sets the paypal method on success', () => {
			const initialState = {};
			const action = {
				type: actions.SAVE_PAYMENTMETHOD_SUCCESS,
				payload: {
					paymentMethod: PaymentMethods.PAYPAL
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: false,
				method: {
					id: PaymentMethods.PAYPAL,
					ipg: false,
					paypal: true
				}
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('keeps the paypal method set when it fails due to paypal', () => {
			const initialState = { method: { id: 'paypal' } };
			const action = {
				type: actions.SAVE_PAYMENTMETHOD_FAILURE,
				payload: {
					error: ''
				}
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: false,
				method: {
					id: PaymentMethods.PAYPAL,
					ipg: false,
					paypal: true
				}
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('has an empty method when save failed and isnt paypal', () => {
			const initialState = {
				isSaving: false,
				method: PaymentMethods.IPG
			};
			const action = {
				type: actions.SAVE_PAYMENTMETHOD_FAILURE
			};
			deepfreeze(action);
			deepfreeze(initialState);
			const expected = {
				isSaving: false,
				method: {}
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('can clear payment method', () => {
			const initialState = {
				isSaving: false,
				method: {
					id: 'anything'
				}
			};
			const action = { type: actions.CLEAR_PAYMENTMETHOD };
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				isSaving: false,
				method: {}
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});
	});

	describe('sync actions', () => {
		it('has a sync action savePaymentMethodRequest', () => {
			const expected = {
				type: actions.SAVE_PAYMENTMETHOD_REQUEST,
				payload: {
					intendedMethod: PaymentMethods.IPG
				},
				meta: {
					feedback: feedbackDismiss()
				}
			};
			const actual = actions.savePaymentMethodRequest(PaymentMethods.IPG);
			expect(actual).toEqual(expected);
		});

		it('has a sync action savePaymentMethodFailure', () => {
			const expected = {
				type: actions.SAVE_PAYMENTMETHOD_FAILURE,
				payload: {
					error: 'Oops'
				},
				meta: {
					track: mockTrackEvent('Payment Token ipg', 'Not Obtained'),
					feedback: feedbackError('Error Message')
				}
			};
			const actual = actions.savePaymentMethodFailure('ipg', 'Oops', 'Error Message');
			expect(actual).toEqual(expected);
		});

		it('has a sync action savePaymentMethodSuccess', () => {
			const expected = {
				type: actions.SAVE_PAYMENTMETHOD_SUCCESS,
				payload: {
					paymentMethod: PaymentMethods.IPG,
					iframeUrl: undefined
				},
				meta: {
					track: mockTrackEvent('Payment Token ' + PaymentMethods.IPG, 'Obtained')
				}
			};
			deepfreeze(expected);
			const actual = actions.savePaymentMethodSuccess(expected.payload);
			expect(actual).toEqual(expected);
		});

		it('has a sync action paymentMethodIntent', () => {
			const expected = {
				type: actions.PAYMENTMETHOD_INTENT,
				payload: {
					paymentMethod: PaymentMethods.PAYPAL
				}
			};
			const actual = actions.paymentMethodIntent({ paymentMethod: PaymentMethods.PAYPAL });
			expect(actual).toEqual(expected);
		});

		it('has a sync action clearPaymentMethod', () => {
			const expected = {
				type: actions.CLEAR_PAYMENTMETHOD,
				payload: {
					reason: 'reason'
				},
				meta: {
					track: mockTrackEvent('Payment Method cleared', 'reason')
				}
			};
			const actual = actions.clearPaymentMethod('reason');
			expect(actual).toEqual(expected);
		});

		it('has a sync action clearPaymentMethod without reason', () => {
			const expected = {
				type: actions.CLEAR_PAYMENTMETHOD,
				payload: {
					reason: undefined
				},
				meta: {
					track: undefined
				}
			};
			const actual = actions.clearPaymentMethod();
			expect(actual).toEqual(expected);
		});

		it('has a sync action trackPaymentMethod', () => {
			const expected = {
				type: actions.PAYMENT_CHOOSE,
				meta: {
					track: mockTrackData(3, PaymentMethods.PAYPAL)
				}
			};
			const actual = actions.trackPaymentMethod(PaymentMethods.PAYPAL);
			expect(actual).toEqual(expected);
		});
	});

	describe('async action choosePaymentMethod', () => {
		let dispatch;

		beforeEach(() => {
			dispatch = jasmine.createSpy('dispatch');
			setIpgMode.and.returnValue(fakePromise);
		});

		it('immediately dispatches an analyticsCheckoutStep with the method', () => {
			actions.choosePaymentMethod('somemethod')(dispatch);
			expect(dispatch).toHaveBeenCalledWith(actions.trackPaymentMethod('somemethod'));
		});

		it('immediately dispatches a sync failure with no param', () => {
			actions.choosePaymentMethod()(dispatch);
			expect(dispatch).toHaveBeenCalledWith(
				actions.savePaymentMethodFailure()
			);
		});

		it('immediately dispatches a sync success for paypal', () => {
			actions.choosePaymentMethod(PaymentMethods.PAYPAL)(dispatch);
			expect(dispatch).toHaveBeenCalledWith(
				actions.paymentMethodIntent({ paymentMethod: PaymentMethods.PAYPAL })
			);
		});

		it('dispatchs an async action for ipg', () => {
			actions.choosePaymentMethod(PaymentMethods.IPG)(dispatch);
			expect(dispatch.calls.mostRecent().args[0].toString())
				.toEqual(actions.saveIpgPaymentMethod(PaymentMethods.IPG).toString());
		});

		it('dispatchs an async action for giftcard', () => {
			actions.choosePaymentMethod(PaymentMethods.GIFTCARD)(dispatch);
			expect(dispatch.calls.mostRecent().args[0].toString())
				.toEqual(actions.saveIpgPaymentMethod(PaymentMethods.GIFTCARD).toString());
		});
	});

	describe('async action savePayPalPaymentMethod', () => {
		let dispatch;
		let getState;
		let state;

		beforeEach(() => {
			dispatch = jasmine.createSpy('dispatch');
			getState = jasmine.createSpy('getState');
			getState.and.callFake(() => state);
			state = {
				selectedPaymentMethod: { method: { id: 'paypal' } },
				session: { info: { csrfToken: '1b09130gn9342n0329' } }
			};
			actions.savePayPalPaymentMethod()(dispatch, getState);
		});

		it('initiates the request', () => {
			expect(dispatch).toHaveBeenCalledWith(actions.savePaymentMethodRequest('paypal'));
		});

		it('will dispatch a paypal unavailable message on api error', () => {
			dispatch.calls.reset();
			const expected = actions.savePaymentMethodFailure('paypal', 'Oops',
				localeText('paypal-unavailable'));
			const reject = fakePromise.then.calls.argsFor(0)[1];
			reject('Oops');
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will not dispatch anything if the methods dont match', () => {
			dispatch.calls.reset();
			state.selectedPaymentMethod.method.id = 'not-paypal';

			const resolve = fakePromise.then.calls.argsFor(0)[0];
			resolve({ id: 'paypal', paymentMethod: 'paypal' });
			expect(dispatch).not.toHaveBeenCalled();
		});

		it('will dispatch a success on api complete', () => {
			dispatch.calls.reset();
			const expected = actions.savePaymentMethodSuccess(
				{ id: 'paypal', paymentMethod: 'paypal' }
			);
			const resolve = fakePromise.then.calls.argsFor(0)[0];
			resolve({ id: 'paypal', paymentMethod: 'paypal' });
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('adds an intended mode based on state when there isnt one', () => {
			dispatch.calls.reset();
			const expected = {
				type: actions.SAVE_PAYMENTMETHOD_SUCCESS,
				payload: { paymentMethod: 'NEWMETHOD' },
				meta: {
					track: mockTrackEvent('Payment Token NEWMETHOD', 'Obtained')
				}
			};
			const resolve = fakePromise.then.calls.argsFor(0)[0];
			resolve({ paymentMethod: 'NEWMETHOD' });
			expect(dispatch).toHaveBeenCalledWith(expected);
		});
	});

	describe('async action saveIpgPaymentMethod', () => {
		let dispatch;
		let getState;
		let state;

		beforeEach(() => {
			dispatch = jasmine.createSpy('dispatch');
			getState = jasmine.createSpy('getState');
			getState.and.callFake(() => state);
			state = {
				selectedPaymentMethod: { method: { id: 'ipg' } },
				session: { info: { csrfToken: '1b09130gn9342n0329' } }
			};
			actions.saveIpgPaymentMethod('ipg')(dispatch, getState);
		});

		it('initiates the request', () => {
			expect(dispatch).toHaveBeenCalledWith(actions.savePaymentMethodRequest('ipg'));
		});

		it('will dispatch a failure on api error', () => {
			dispatch.calls.reset();
			const expected = actions.savePaymentMethodFailure('ipg', 'Oops',
				localeText('api-error-payment-save'));
			const reject = fakePromise.then.calls.argsFor(0)[1];
			reject('Oops');
			expect(dispatch).toHaveBeenCalledWith(expected);
		});

		it('will not dispatch anything if the methods dont match', () => {
			dispatch.calls.reset();
			state.selectedPaymentMethod.method.id = 'not-ipg';

			const resolve = fakePromise.then.calls.argsFor(0)[0];
			resolve({ id: 'ipg', paymentMethod: 'ipg' });
			expect(dispatch).not.toHaveBeenCalled();
		});

		it('will dispatch a success on api complete', () => {
			dispatch.calls.reset();
			const expected = actions.savePaymentMethodSuccess(
				{ id: 'ipg', paymentMethod: 'ipg' }
			);
			const resolve = fakePromise.then.calls.argsFor(0)[0];
			resolve({ id: 'ipg', paymentMethod: 'ipg' });
			expect(dispatch).toHaveBeenCalledWith(expected);
		});
	});
});
