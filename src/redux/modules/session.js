import { getSession } from '../../api/misc';

import { sessionHasAccount } from './registration';

export const FETCH_SESSION_REQUEST = 'FETCH_SESSION_REQUEST';
export const FETCH_SESSION_SUCCESS = 'FETCH_SESSION_SUCCESS';
export const FETCH_SESSION_FAILURE = 'FETCH_SESSION_FAILURE';

// Sync Actions
export const fetchSessionRequest = () => ({ type: FETCH_SESSION_REQUEST });
export const fetchSessionFailure = err => ({ type: FETCH_SESSION_FAILURE, error: err });
export const fetchSessionSuccess = session => ({
	type: FETCH_SESSION_SUCCESS,
	payload: {
		session
	}
});

// Async Action
export const fetchSession = () => dispatch => {
	function hasAccount(session) {
		if (session.customer && session.customer.email) {
			dispatch(sessionHasAccount(session.customer));
		}
	}

	dispatch(fetchSessionRequest());
	getSession()
		.then(session => {
			dispatch(fetchSessionSuccess(session));
			hasAccount(session);
		}
		, err => dispatch(fetchSessionFailure(err)))
		.catch(e => setTimeout(() => { throw e; }));
};

// Reducer
export default (state = { info: {} }, action) => {
	switch (action.type) {
	case FETCH_SESSION_REQUEST:
		return {
			isFetching: true,
			fetchStatus: 'pending',
			info: {}
		};
	case FETCH_SESSION_SUCCESS:
		return {
			isFetching: false,
			fetchStatus: 'success',
			info: { ...action.payload.session }
		};
	case FETCH_SESSION_FAILURE:
		return {
			isFetching: false,
			fetchStatus: 'failure',
			info: {}
		};
	default:
		return state;
	}
};
