import { checkIsCustomer } from '../../api/customer';
import localeText from '../../helpers/locale-text';
import { feedbackError } from './feedback';
import { validationError } from '../../api/common';

export const CHECK_EMAIL_REQUEST = 'CHECK_EMAIL_REQUEST';
export const CHECK_EMAIL_EXISTS = 'CHECK_EMAIL_EXISTS';
export const CHECK_EMAIL_NOT_FOUND = 'CHECK_EMAIL_NOT_FOUND';
export const CHECK_EMAIL_FAILURE = 'CHECK_EMAIL_FAILURE';
export const CHECKOUT_AS_GUEST = 'CHECKOUT_AS_GUEST';
export const SESSION_HAS_ACCOUNT = 'SESSION_HAS_ACCOUNT';

// Sync Actions
export const checkEmailRequest = (email) => ({
	type: CHECK_EMAIL_REQUEST,
	payload: {
		email
	}
});
export const checkEmailFailure = (err, message) => ({
	type: CHECK_EMAIL_FAILURE,
	payload: {
		error: err
	},
	meta: {
		feedback: feedbackError(message)
	}
});
export const checkEmailExists = () => ({
	type: CHECK_EMAIL_EXISTS
});
export const checkEmailNotFound = () => ({
	type: CHECK_EMAIL_NOT_FOUND
});
export const checkoutAsGuest = () => ({
	type: CHECKOUT_AS_GUEST
});

export const sessionHasAccount = (customer) => ({
	type: SESSION_HAS_ACCOUNT,
	payload: {
		email: customer.email,
		hasExistingAccount: true
	}
});

// Async Action
export const checkEmail = email => (dispatch, getState) => {
	dispatch(checkEmailRequest(email));

	return checkIsCustomer(email, getState().session.info.csrfToken)
		.then(result => {
			dispatch(result.isRegistered ? checkEmailExists() : checkEmailNotFound());
		}, err => {
			switch (err.code) {
			case 'ERR_INVALID_EMAIL':
				return validationError({ email: localeText('email-invalid') });
			default:
				dispatch(checkEmailFailure(err, localeText('api-error')));
			}
		})
		.catch(e => setTimeout(() => { throw e; }));
};

// Reducer
export default (state = {
	hasCheckedEmail: false,
	hasExistingAccount: false
}, action) => {
	switch (action.type) {
	case CHECK_EMAIL_REQUEST:
		return { ...state, email: action.payload.email };
	case SESSION_HAS_ACCOUNT:
		return { ...state,
			hasCheckedEmail: true,
			hasExistingAccount: true,
			email: action.payload.email };
	case CHECK_EMAIL_EXISTS:
		return { ...state, hasCheckedEmail: true, hasExistingAccount: true };
	case CHECK_EMAIL_NOT_FOUND:
		return { ...state, hasCheckedEmail: true, hasExistingAccount: false };
	case CHECKOUT_AS_GUEST:
		return { ...state, checkoutAsGuest: true };
	default:
		return state;
	}
};
