import { getCountryList } from '../../api/billing';

export const FETCH_COUNTRYLIST_REQUEST = 'FETCH_COUNTRYLIST_REQUEST';
export const FETCH_COUNTRYLIST_SUCCESS = 'FETCH_COUNTRYLIST_SUCCESS';
export const FETCH_COUNTRYLIST_FAILURE = 'FETCH_COUNTRYLIST_FAILURE';

const StrayaM8 = [{ isocode: 'AU', name: 'Australia' }];

// Sync Actions
export const fetchCountryListRequest = () => ({
	type: FETCH_COUNTRYLIST_REQUEST
});

export const fetchCountryListSuccess = countries => ({
	type: FETCH_COUNTRYLIST_SUCCESS,
	payload: {
		countries
	}
});

export const fetchCountryListFailure = error => ({
	type: FETCH_COUNTRYLIST_FAILURE,
	payload: { error }
});

// Async Action
export const fetchCountryList = () => (dispatch, getState) => {
	if (!getState().countryList.isFetching) {
		dispatch(fetchCountryListRequest());
		getCountryList()
			.then(
				countries => dispatch(fetchCountryListSuccess(countries)),
				err => dispatch(fetchCountryListFailure(err))
			)
			.catch(e => setTimeout(() => { throw e; }));
	}
};

// Reducer
export default (state = { countries: StrayaM8, isFetching: false }, action) => {
	switch (action.type) {
	case FETCH_COUNTRYLIST_REQUEST:
		return {
			isFetching: true,
			countries: state.countries
		};
	case FETCH_COUNTRYLIST_SUCCESS:
		return {
			isFetching: false,
			countries: action.payload.countries
		};
	case FETCH_COUNTRYLIST_FAILURE:
		return {
			isFetching: false,
			countries: StrayaM8
		};
	default:
		return state;
	}
};
