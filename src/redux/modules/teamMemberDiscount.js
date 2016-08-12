import { applyTmd as applyTmdAPI } from '../../api/voucher';
import { feedbackError, feedbackDismiss } from './feedback';
import localeText from '../../helpers/locale-text';

export const INIT_TMD = 'INIT_TMD';
export const APPLY_TMD_REQUEST = 'APPLY_TMD_REQUEST';
export const APPLY_TMD_SUCCESS = 'APPLY_TMD_SUCCESS';
export const APPLY_TMD_FAILURE = 'APPLY_TMD_FAILURE';

// Sync Actions

export const initTmd = tmdNumber => ({
	type: INIT_TMD,
	payload: {
		tmdNumber
	}
});
export const applyTmdRequest = tmdNumber => ({
	type: APPLY_TMD_REQUEST,
	payload: {
		tmdNumber
	},
	meta: {
		feedback: feedbackDismiss()
	}
});
export const applyTmdFailure = (err, message) => ({
	type: APPLY_TMD_FAILURE,
	payload: {
		error: err
	},
	meta: {
		feedback: feedbackError(message)
	}
});
export const applyTmdSuccess = tmdNumber => ({
	type: APPLY_TMD_SUCCESS,
	payload: {
		tmdNumber
	},
	meta: { cart: { summaryForceUpdate: true } }
});

export const selectCSRFToken = state =>
	state.session.info && state.session.info.csrfToken;

// Async Action

export const applyTmd = tmdNumber => (dispatch, getState) => {
	if (!tmdNumber) {
		throw Error('applyTmd missing required args');
	}
	dispatch(applyTmdRequest(tmdNumber));
	applyTmdAPI(tmdNumber, selectCSRFToken(getState()))
		.then(data => {
			dispatch(applyTmdSuccess(data));
		},
			err => {
				if (err.code === 'ERR_TMD_INVALID') {
					dispatch(applyTmdFailure(err, localeText('invalid-tmd')));
				} else {
					dispatch(applyTmdFailure(err, localeText('api-error-tmd')));
				}
			}
		)
		.catch(e => setTimeout(() => { throw e; }));
};

// Reducer
export default (state = {}, action) => {
	switch (action.type) {
	case INIT_TMD:
		return {
			isSaving: false,
			applied: 'successful',
			tmdNumber: action.payload.tmdNumber
		};
	case APPLY_TMD_REQUEST:
		return {
			isSaving: true
		};
	case APPLY_TMD_SUCCESS:
		return {
			isSaving: false,
			applied: 'successful',
			tmdNumber: action.payload.tmdNumber
		};
	case APPLY_TMD_FAILURE:
		const rejected = !!action.payload.error.code;
		return {
			isSaving: false,
			applied: rejected ? 'rejected' : undefined
		};
	default:
		return state;
	}
};
