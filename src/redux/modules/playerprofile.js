import { playerDetail } from '../../api/player';

export const FETCH_PLAYERPROFILE_REQUEST = 'FETCH_PLAYERPROFILE_REQUEST';
export const FETCH_PLAYERPROFILE_SUCCESS = 'FETCH_PLAYERPROFILE_SUCCESS';
export const FETCH_PLAYERPROFILE_FAILURE = 'FETCH_PLAYERPROFILE_FAILURE';

// Sync Actions
export const fetchPlayerProfileRequest = () => ({ type: FETCH_PLAYERPROFILE_REQUEST });
export const fetchPlayerProfileFailure = err => ({ type: FETCH_PLAYERPROFILE_FAILURE, error: err });
export const fetchPlayerProfileSuccess = playerProfile => ({
	type: FETCH_PLAYERPROFILE_SUCCESS,
	payload: {
		playerProfile
	}
});

// Async Action
export const fetchPlayerProfile = (id) => dispatch => {
	console.log('fetching player profile for .... ', id);
	dispatch(fetchPlayerProfileRequest());
	playerDetail(id)
		.then(
			playerProfile => {
				dispatch(fetchPlayerProfileSuccess(playerProfile));
			},
			err => dispatch(fetchPlayerProfileFailure(err))
		)
		.catch(e => setTimeout(() => { throw e; }));
};

// Reducer
export default (state = { info: {} }, action) => {
	switch (action.type) {
	case FETCH_PLAYERPROFILE_REQUEST:
		return {
			isFetching: true,
			fetchStatus: 'pending',
			info: [...state.info]
		};
	case FETCH_PLAYERPROFILE_SUCCESS:
		return {
			isFetching: false,
			fetchStatus: 'success',
			info: [...action.payload.playerProfile]
		};
	case FETCH_PLAYERPROFILE_FAILURE:
		return {
			isFetching: false,
			fetchStatus: 'failure',
			info: {}
		};
	default:
		return state;
	}
};
