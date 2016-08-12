import { searchStores } from '../../api/delivery';
import localeText from '../../helpers/locale-text';
import { feedbackError, feedbackDismiss } from './feedback';

export const INIT_SEARCHSTORES = 'INIT_SEARCHSTORES';
export const FETCH_SEARCHSTORES_REQUEST = 'FETCH_SEARCHSTORES_REQUEST';
export const FETCH_SEARCHSTORES_SUCCESS = 'FETCH_SEARCHSTORES_SUCCESS';
export const FETCH_SEARCHSTORES_FAILURE = 'FETCH_SEARCHSTORES_FAILURE';

// Sync Actions
export const initSearchStores = stores => ({
	type: INIT_SEARCHSTORES,
	payload: {
		stores
	}
});
export const fetchSearchStoresRequest = () => ({
	type: FETCH_SEARCHSTORES_REQUEST,
	meta: {
		feedback: feedbackDismiss()
	}
});
export const fetchSearchStoresFailure = (err, message) => ({
	type: FETCH_SEARCHSTORES_FAILURE,
	payload: {
		error: err
	},
	meta: {
		feedback: feedbackError(message)
	}
});
export const fetchSearchStoresSuccess = stores => ({
	type: FETCH_SEARCHSTORES_SUCCESS,
	payload: {
		stores
	}
});

// Async Action
export const fetchSearchStores = locationText => (dispatch, getState) => {
	dispatch(fetchSearchStoresRequest());
	searchStores(locationText, getState().session.info.csrfToken)
		.then(
			stores => dispatch(fetchSearchStoresSuccess(stores)),
			err => dispatch(fetchSearchStoresFailure(err, localeText('api-error-stores')))
		)
		.catch(e => setTimeout(() => { throw e; }));
};

// Reducer
export default (state = { list: [] }, action) => {
	switch (action.type) {
	case FETCH_SEARCHSTORES_REQUEST:
		return {
			isFetching: true,
			fetchStatus: 'pending',
			list: []
		};
	case FETCH_SEARCHSTORES_SUCCESS:
		return {
			isFetching: false,
			fetchStatus: 'success',
			list: [...action.payload.stores]
		};
	case FETCH_SEARCHSTORES_FAILURE:
		return {
			isFetching: false,
			fetchStatus: 'failure',
			list: []
		};
	case INIT_SEARCHSTORES:
		return {
			isFetching: false,
			fetchStatus: 'init',
			list: [...action.payload.stores]
		};
	default:
		return state;
	}
};
