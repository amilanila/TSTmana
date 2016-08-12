import { getCmsContent } from '../../api/cms';

export const FETCH_CMSCONTENT_REQUEST = 'FETCH_CMSCONTENT_REQUEST';
export const FETCH_CMSCONTENT_SUCCESS = 'FETCH_CMSCONTENT_SUCCESS';
export const FETCH_CMSCONTENT_FAILURE = 'FETCH_CMSCONTENT_FAILURE';

// Sync Actions
export const fetchCmsContentRequest = () => ({
	type: FETCH_CMSCONTENT_REQUEST
});

export const fetchCmsContentSuccess = slots => ({
	type: FETCH_CMSCONTENT_SUCCESS,
	payload: {
		slots
	}
});

export const fetchCmsContentFailure = (error) => ({
	type: FETCH_CMSCONTENT_FAILURE,
	payload: { error }
});

// Async Action
export const fetchCmsContent = () => (dispatch, getState) => {
	const cmsContentIsLoaded = Object.keys(getState().cms.slots).length > 0;
	if (!getState().cms.isFetching && !cmsContentIsLoaded) {
		dispatch(fetchCmsContentRequest());
		getCmsContent()
			.then(
				slots => dispatch(fetchCmsContentSuccess(slots)),
				err => dispatch(fetchCmsContentFailure(err))
			)
			.catch(e => setTimeout(() => { throw e; }));
	}
};

// Reducer
export default (state = { slots: {} }, action) => {
	switch (action.type) {
	case FETCH_CMSCONTENT_REQUEST:
		return {
			isFetching: true,
			slots: {}
		};
	case FETCH_CMSCONTENT_SUCCESS:
		return {
			isFetching: false,
			slots: action.payload.slots
		};
	case FETCH_CMSCONTENT_FAILURE:
		return {
			isFetching: false,
			slots: {}
		};
	default:
		return state;
	}
};
