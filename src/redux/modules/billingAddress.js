import { setAddress } from '../../api/billing';
import { feedbackError, feedbackDismiss } from './feedback';
import localeText from '../../helpers/locale-text';

export const SET_BILLINGADDRESS_REQUEST = 'SET_BILLINGADDRESS_REQUEST';
export const SET_BILLINGADDRESS_SUCCESS = 'SET_BILLINGADDRESS_SUCCESS';
export const SET_BILLINGADDRESS_FAILURE = 'SET_BILLINGADDRESS_FAILURE';
export const INIT_BILLINGADDRESS = 'INIT_BILLINGADDRESS';
export const CLEAR_BILLINGADDRESS = 'CLEAR_BILLINGADDRESS';

// Sync Actions
export const initBillingAddress = billingAddress => ({
	type: INIT_BILLINGADDRESS,
	payload: {
		billingAddress
	}
});

export const setAddressRequest = formData => ({
	type: SET_BILLINGADDRESS_REQUEST,
	payload: {
		formData
	},
	meta: {
		feedback: feedbackDismiss()
	}
});
export const setAddressFailure = (err, message) => ({
	type: SET_BILLINGADDRESS_FAILURE,
	payload: {
		error: err
	},
	meta: {
		feedback: feedbackError(message)
	}
});
export const setAddressSuccess = billingAddress => ({
	type: SET_BILLINGADDRESS_SUCCESS,
	payload: {
		billingAddress
	}
});
export const clearBillingAddress = () => ({
	type: CLEAR_BILLINGADDRESS
});

export const selectCSRFToken = state =>
	state.session.info && state.session.info.csrfToken;

export const selectDelModeId = state =>
	state.selectedDeliveryMode && state.selectedDeliveryMode.mode.id;

// Async Action
export const setBillingAddress = formData => (dispatch, getState) => {
	if (!formData) {
		throw Error('setBillingAddress missing required args');
	}
	dispatch(setAddressRequest(formData));
	setAddress(formData, selectCSRFToken(getState()))
		.then(data => {
			dispatch(setAddressSuccess(data));
		},
			err => dispatch(setAddressFailure(err, localeText('api-error-billing')))
		)
		.catch(e => setTimeout(() => { throw e; }));
};

// Reducer
export default (state = {}, action) => {
	switch (action.type) {
	case INIT_BILLINGADDRESS:
		return {
			isSaving: false,
			billingAddress: action.payload.billingAddress
		};
	case SET_BILLINGADDRESS_REQUEST:
		return {
			isSaving: true,
			formData: action.payload.formData
		};
	case SET_BILLINGADDRESS_SUCCESS:
		return {
			isSaving: false,
			billingAddress: action.payload.billingAddress
		};
	case SET_BILLINGADDRESS_FAILURE:
		return {
			isSaving: false
		};
	case CLEAR_BILLINGADDRESS:
		return {
			isSaving: false
		};
	default:
		return state;
	}
};
