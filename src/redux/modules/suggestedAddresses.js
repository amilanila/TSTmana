import { searchAddress } from '../../api/delivery';
import localeText from '../../helpers/locale-text';
import { feedbackError, feedbackDismiss } from './feedback';

export const FETCH_SUGGESTEDADDRESSES_REQUEST = 'FETCH_SUGGESTEDADDRESSES_REQUEST';
export const FETCH_SUGGESTEDADDRESSES_SUCCESS = 'FETCH_SUGGESTEDADDRESSES_SUCCESS';
export const FETCH_SUGGESTEDADDRESSES_FAILURE = 'FETCH_SUGGESTEDADDRESSES_FAILURE';
export const SELECT_SUGGESTEDADDRESS = 'SELECT_SUGGESTEDADDRESS';
export const UPDATE_SUGGESTEDADDRESSES = 'UPDATE_SUGGESTEDADDRESSES';
export const CLEAR_SUGGESTEDADDRESSES = 'CLEAR_SUGGESTEDADDRESSES';
export const SUGGESTEDADDRESSES_TOOMANY_MATCHES = 'SUGGESTEDADDRESSES_TOOMANY_MATCHES';

// Sync Actions
export const clearSuggestedAddresses = () => ({
	type: CLEAR_SUGGESTEDADDRESSES,
	meta: {
		feedback: feedbackDismiss()
	}
});

export const fetchSuggestedAddressesRequest = searchTerm => ({
	type: FETCH_SUGGESTEDADDRESSES_REQUEST,
	payload: {
		searchTerm
	},
	meta: {
		feedback: feedbackDismiss()
	}
});

export const fetchSuggestedAddressesFailure = (err, message) => ({
	type: FETCH_SUGGESTEDADDRESSES_FAILURE,
	payload: {
		error: err
	},
	meta: {
		feedback: feedbackError(message)
	}
});

export const fetchSuggestedAddressesTooManyResults = () => ({
	type: SUGGESTEDADDRESSES_TOOMANY_MATCHES
});

export const fetchSuggestedAddressesSuccess = list => ({
	type: FETCH_SUGGESTEDADDRESSES_SUCCESS,
	payload: {
		list
	}
});

export const selectSuggestedAddress = address => ({
	type: SELECT_SUGGESTEDADDRESS,
	payload: {
		address
	}
});

export const updateSearchTerm = searchTerm => ({
	type: UPDATE_SUGGESTEDADDRESSES,
	payload: {
		searchTerm
	},
	meta: {
		feedback: feedbackDismiss()
	}
});

// Async Action
const handleError = (err, dispatch) => {
	switch (err.code) {
	case 'ERR_TOOMANY_MATCHES':
		dispatch(fetchSuggestedAddressesTooManyResults());
		break;
	case 'ERR_NO_MATCH':
		// Empty list is handled on frontend
		dispatch(fetchSuggestedAddressesSuccess([]));
		break;
	case 'ERR_QAS_UNAVAILABLE':
		dispatch(fetchSuggestedAddressesFailure(err, localeText('suggested-unavailable')));
		break;
	default:
		dispatch(fetchSuggestedAddressesFailure(err, localeText('suggested-unavailable')));
		break;
	}
};

export const fetchSuggestedAddresses = address => (dispatch, getState) => {
	dispatch(fetchSuggestedAddressesRequest(address));
	searchAddress(address, getState().session.info.csrfToken)
		.then(
			addressList => {
				if (address === getState().suggestedAddresses.searchTerm) {
					dispatch(fetchSuggestedAddressesSuccess(addressList));
				}
			},
			err => handleError(err, dispatch)
		)
		.catch(e => setTimeout(() => { throw e; }));
};

// Reducer
export default (state = { list: [], searchTerm: '' }, action) => {
	switch (action.type) {
	case CLEAR_SUGGESTEDADDRESSES:
		return {
			isFetching: false,
			list: [],
			searchTerm: '',
			valid: false
		};
	case FETCH_SUGGESTEDADDRESSES_REQUEST:
		return {
			isFetching: true,
			list: state.list,
			searchTerm: action.payload.searchTerm,
			valid: false
		};
	case FETCH_SUGGESTEDADDRESSES_SUCCESS:
		return {
			isFetching: false,
			fetchStatus: 'success',
			list: [...action.payload.list],
			searchTerm: state.searchTerm,
			valid: state.valid
		};
	case FETCH_SUGGESTEDADDRESSES_FAILURE:
		return {
			isFetching: false,
			fetchStatus: 'failure',
			list: [],
			searchTerm: state.searchTerm,
			valid: false
		};
	case SELECT_SUGGESTEDADDRESS:
		return {
			isFetching: false,
			list: state.list,
			searchTerm: action.payload.address.label,
			valid: true,
			address: action.payload.address
		};
	case UPDATE_SUGGESTEDADDRESSES:
		return {
			isFetching: false,
			list: state.list,
			searchTerm: action.payload.searchTerm,
			valid: false
		};
	case SUGGESTEDADDRESSES_TOOMANY_MATCHES:
		return {
			isFetching: false,
			list: [],
			searchTerm: state.searchTerm,
			tooManyResults: true,
			valid: false
		};
	default:
		return state;
	}
};
