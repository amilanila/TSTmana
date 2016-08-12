import { getEnv } from '../../api/misc';
import * as gtm from '../../helpers/gtm';

export const FETCH_ENV_REQUEST = 'FETCH_ENV_REQUEST';
export const FETCH_ENV_SUCCESS = 'FETCH_ENV_SUCCESS';
export const FETCH_ENV_FAILURE = 'FETCH_ENV_FAILURE';

// Sync Actions
export const fetchEnvRequest = () => ({ type: FETCH_ENV_REQUEST });
export const fetchEnvFailure = err => ({ type: FETCH_ENV_FAILURE, error: err });
export const fetchEnvSuccess = env => ({
	type: FETCH_ENV_SUCCESS,
	payload: {
		env
	}
});

// Async Action
export const fetchEnv = () => dispatch => {
	dispatch(fetchEnvRequest());
	getEnv()
		.then(
			env => {
				gtm.create(env.gtmId);
				dispatch(fetchEnvSuccess(env));
			},
			err => dispatch(fetchEnvFailure(err))
		)
		.catch(e => setTimeout(() => { throw e; }));
};

// Reducer
export default (state = { info: {} }, action) => {
	switch (action.type) {
	case FETCH_ENV_REQUEST:
		return {
			isFetching: true,
			fetchStatus: 'pending',
			info: {}
		};
	case FETCH_ENV_SUCCESS:
		return {
			isFetching: false,
			fetchStatus: 'success',
			info: { ...action.payload.env }
		};
	case FETCH_ENV_FAILURE:
		return {
			isFetching: false,
			fetchStatus: 'failure',
			info: {}
		};
	default:
		return state;
	}
};
