import { applyVoucher, removeVoucher as removeAPI } from '../../api/voucher';
import { feedbackError, feedbackDismiss } from './feedback';
import localeText from '../../helpers/locale-text';

export const INIT_VOUCHER = 'INIT_VOUCHER';
export const SAVE_VOUCHER_REQUEST = 'SAVE_VOUCHER_REQUEST';
export const SAVE_VOUCHER_SUCCESS = 'SAVE_VOUCHER_SUCCESS';
export const SAVE_VOUCHER_FAILURE = 'SAVE_VOUCHER_FAILURE';
export const REMOVE_VOUCHER_REQUEST = 'REMOVE_VOUCHER_REQUEST';
export const REMOVE_VOUCHER_SUCCESS = 'REMOVE_VOUCHER_SUCCESS';
export const REMOVE_VOUCHER_FAILURE = 'REMOVE_VOUCHER_FAILURE';

// Sync Actions
export const initVoucher = voucher => ({
	type: INIT_VOUCHER,
	payload: {
		voucher
	}
});
export const saveVoucherRequest = code => ({
	type: SAVE_VOUCHER_REQUEST,
	payload: { code },
	meta: {
		feedback: feedbackDismiss()
	}
});
export const saveVoucherFailure = (err, message) => ({
	type: SAVE_VOUCHER_FAILURE,
	payload: { error: err },
	meta: {
		feedback: feedbackError(message)
	}
});
export const saveVoucherSuccess = voucher => ({
	type: SAVE_VOUCHER_SUCCESS,
	payload: {
		voucher
	},
	meta: {
		cart: { summaryForceUpdate: true }
	}
});

export const removeVoucherRequest = () => ({
	type: REMOVE_VOUCHER_REQUEST,
	meta: {
		feedback: feedbackDismiss()
	}
});

export const removeVoucherFailure = (err, message) => ({
	type: REMOVE_VOUCHER_FAILURE,
	payload: { error: err },
	meta: {
		feedback: feedbackError(message)
	}
});

export const removeVoucherSuccess = () => ({
	type: REMOVE_VOUCHER_SUCCESS,
	meta: {
		cart: { summaryForceUpdate: true }
	}
});

const mapErrorCodeToLocaleText = errCode => {
	switch (errCode) {
	case 'ERR_VOUCHER_CONDITIONS_NOT_MET':
		return localeText('voucher-conditions');
	case 'ERR_VOUCHER_DOES_NOT_EXIST':
		return localeText('voucher-does-not-exist');
	default:
		return localeText('api-error-promo');
	}
};

// Async Action
export const saveVoucher = code => (dispatch, getState) => {
	dispatch(saveVoucherRequest(code));
	applyVoucher(code, getState().session.info.csrfToken)
		.then(
			data => dispatch(saveVoucherSuccess(data)),
			err => {
				const errorText = mapErrorCodeToLocaleText(err && err.code);
				dispatch(saveVoucherFailure(err, errorText));
			}
		)
		.catch(e => setTimeout(() => { throw e; }));
};

export const removeVoucher = () => (dispatch, getState) => {
	dispatch(removeVoucherRequest());
	removeAPI(getState().session.info.csrfToken)
		.then(
			() => dispatch(removeVoucherSuccess()),
			err => {
				dispatch(removeVoucherFailure(err, localeText('voucher-remove-failure')));
			}
		);
};

// Reducer
export default (state = {}, action) => {
	switch (action.type) {
	case INIT_VOUCHER:
		return {
			isSaving: false,
			applied: 'successful',
			code: action.payload.voucher.code
		};
	case SAVE_VOUCHER_REQUEST:
		return {
			isSaving: true
		};
	case SAVE_VOUCHER_SUCCESS:
		return {
			isSaving: false,
			applied: 'successful',
			code: action.payload.voucher.code
		};
	case SAVE_VOUCHER_FAILURE:
		const rejected = action.payload.error.code &&
			action.payload.error.code.indexOf('ERR_VOUCHER') >= 0;
		return {
			isSaving: false,
			applied: rejected ? 'rejected' : undefined
		};
	case REMOVE_VOUCHER_REQUEST:
		return {
			...state,
			isSaving: true
		};
	case REMOVE_VOUCHER_SUCCESS:
		return {};
	case REMOVE_VOUCHER_FAILURE:
		return {
			...state,
			isSaving: false
		};
	default:
		return state;
	}
};
