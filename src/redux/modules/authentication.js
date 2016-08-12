import { signIn as customerSignIn } from '../../api/customer';
import navigate from '../../routes/navigate';
import localeText from '../../helpers/locale-text';
import { feedbackError, feedbackDismiss } from './feedback';
import { validationError } from '../../api/common';

export const SIGN_IN_REQUEST = 'SIGN_IN_REQUEST';
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS';
export const SIGN_IN_FAILURE = 'SIGN_IN_FAILURE';

// Sync Actions
export const signInRequest = () => ({
	type: SIGN_IN_REQUEST,
	meta: {
		feedback: feedbackDismiss()
	}
});
export const signInSuccess = data => ({
	type: SIGN_IN_SUCCESS,
	payload: {
		redirectUrl: data.redirectUrl
	}
});
export const signInFailure = (err, message) => ({
	type: SIGN_IN_FAILURE,
	payload: {
		error: err
	},
	meta: {
		feedback: feedbackError(message)
	}
});

// Async Action
export const signIn = (email, password) => (dispatch) => {
	dispatch(signInRequest());

	return customerSignIn(email, password)
		.then(result => {
			dispatch(signInSuccess(result));
			navigate.replaceWithCheckoutRedirect();
		}, err => {
			switch (err.code) {
			case 'ERR_LOGIN_BAD_CREDENTIALS':
				return validationError({ password: localeText('login-failed') });
			case 'ERR_LOGIN_ACCOUNT_LOCKED':
				return validationError({ _error: localeText('locked-account') });
			default:
				dispatch(signInFailure(err.code, localeText('api-error')));
			}
		})
		.catch(e => setTimeout(() => { throw e; }));
};

// Reducer
export default (state = {}, action) => {
	switch (action.type) {
	case SIGN_IN_REQUEST:
		return {};
	case SIGN_IN_SUCCESS:
		return {
			redirectUrl: action.payload.redirectUrl
		};
	case SIGN_IN_FAILURE:
		return {};
	default:
		return state;
	}
};
