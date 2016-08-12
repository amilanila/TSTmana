import localeText from '../../helpers/locale-text';
import { setIpgMode, setPayPalMode } from '../../api/payment';
import { feedbackError, feedbackDismiss } from './feedback';
import { PaymentMethods } from '../../constants';
import { analyticsCheckoutStep, analyticsEvent } from './analytics';

export const PAYMENTMETHOD_INTENT = 'PAYMENTMETHOD_INTENT';
export const CLEAR_PAYMENTMETHOD = 'CLEAR_PAYMENTMETHOD';
export const SAVE_PAYMENTMETHOD_REQUEST = 'SAVE_PAYMENTMETHOD_REQUEST';
export const SAVE_PAYMENTMETHOD_SUCCESS = 'SAVE_PAYMENTMETHOD_SUCCESS';
export const SAVE_PAYMENTMETHOD_FAILURE = 'SAVE_PAYMENTMETHOD_FAILURE';
export const PAYMENT_CHOOSE = 'PAYMENT_CHOOSE';

// Sync Actions
export const savePaymentMethodRequest = intendedMethod => ({
	type: SAVE_PAYMENTMETHOD_REQUEST,
	payload: {
		intendedMethod
	},
	meta: {
		feedback: feedbackDismiss()
	}
});
export const savePaymentMethodFailure = (intendedMethod, err, message) => ({
	type: SAVE_PAYMENTMETHOD_FAILURE,
	payload: {
		error: err
	},
	meta: {
		track: analyticsEvent('Payment Token ' + intendedMethod, 'Not Obtained'),
		feedback: feedbackError(message)
	}
});
export const savePaymentMethodSuccess = data => ({
	type: SAVE_PAYMENTMETHOD_SUCCESS,
	payload: data,
	meta: {
		track: analyticsEvent('Payment Token ' + data.paymentMethod, 'Obtained')
	}
});
export const paymentMethodIntent = data => ({
	type: PAYMENTMETHOD_INTENT,
	payload: data
});
export const clearPaymentMethod = (reason) => ({
	type: CLEAR_PAYMENTMETHOD,
	payload: {
		reason
	},
	meta: {
		track: reason && analyticsEvent('Payment Method cleared', reason)
	}
});

export const trackPaymentMethod = intendedMethod => ({
	type: PAYMENT_CHOOSE,
	meta: {
		track: analyticsCheckoutStep(3, intendedMethod)
	}
});


const selectCSRFToken = state =>
	state.session.info && state.session.info.csrfToken;

const selectSelectedPaymentMethodId = state =>
	state.selectedPaymentMethod.method && state.selectedPaymentMethod.method.id;

const isPaypal = method => method === PaymentMethods.PAYPAL;

// Async Action
const savePaymentMethod = (api, intendedMethod) => (dispatch, getState) => {
	dispatch(savePaymentMethodRequest(intendedMethod));
	api(intendedMethod, selectCSRFToken(getState()))
		.then(
			method => {
				// Ignore success unless same as intended
				if (selectSelectedPaymentMethodId(getState()) === intendedMethod) {
					// PayPal API call does not return an intendedMethod, so one is generated
					const successObj = !method.paymentMethod ?
						{ paymentMethod: intendedMethod, ...method } : method;

					dispatch(savePaymentMethodSuccess(successObj));
				}
			},
			err => {
				const errorText = isPaypal(intendedMethod) ?
					localeText('paypal-unavailable') : localeText('api-error-payment-save');
				dispatch(savePaymentMethodFailure(intendedMethod, err, errorText));
			}
		)
		.catch(e => setTimeout(() => { throw e; }));
};

export const saveIpgPaymentMethod = intendedMethod => {
	return savePaymentMethod(setIpgMode, intendedMethod);
};

export const savePayPalPaymentMethod = () => {
	return savePaymentMethod(setPayPalMode, PaymentMethods.PAYPAL);
};

export const choosePaymentMethod = method => (dispatch) => {
	dispatch(trackPaymentMethod(method));
	if (typeof method !== 'string') {
		dispatch(savePaymentMethodFailure());
	} else if (isPaypal(method)) {
		// Dispatch the success immediately if paypal..
		// We are not talking to the server
		dispatch(paymentMethodIntent({ paymentMethod: method }));
	} else {
		// Dispatch the IPG async action and have a conversation with the server
		dispatch(saveIpgPaymentMethod(method));
	}
};

const methodReducer = (payload) => {
	const { intendedMethod, paymentMethod, ...additionalData } = payload;
	const methodId = intendedMethod || paymentMethod;

	switch (methodId) {
	case PaymentMethods.IPG:
		return {
			id: methodId,
			ipg: true,
			paypal: false,
			...additionalData
		};
	case PaymentMethods.GIFTCARD:
		return {
			id: methodId,
			ipg: true,
			paypal: false,
			...additionalData
		};
	case PaymentMethods.PAYPAL:
		return {
			id: methodId,
			ipg: false,
			paypal: true,
			...additionalData
		};
	default:
		return {};
	}
};

// Reducer
export default (state = { method: {} }, action) => {
	switch (action.type) {
	case SAVE_PAYMENTMETHOD_REQUEST:
		return {
			isSaving: true,
			method: methodReducer(action.payload)
		};
	case SAVE_PAYMENTMETHOD_SUCCESS:
		return {
			isSaving: false,
			method: methodReducer(action.payload)
		};
	case SAVE_PAYMENTMETHOD_FAILURE:
		return {
			isSaving: false,
			method: state.method && isPaypal(state.method.id) ?
				methodReducer({ intendedMethod: PaymentMethods.PAYPAL }) : {}
		};
	case CLEAR_PAYMENTMETHOD:
		return {
			isSaving: false,
			method: {}
		};
	case PAYMENTMETHOD_INTENT:
		return {
			isSaving: false,
			method: methodReducer(action.payload)
		};
	default:
		return state;
	}
};
