import { playerProfile } from '../../api/player';

export const FETCH_PLAYERPROFILE_REQUEST = 'FETCH_PLAYERPROFILE_REQUEST';
export const FETCH_PLAYERPROFILE_SUCCESS = 'FETCH_PLAYERPROFILE_SUCCESS';
export const FETCH_PLAYERPROFILE_FAILURE = 'FETCH_PLAYERPROFILE_FAILURE';

// Sync Actions
export const fetchPlayerProfileRequest = () => ({ type: FETCH_PLAYERPROFILE_REQUEST });
export const fetchPlayerProfileFailure = err => ({ type: FETCH_PLAYERPROFILE_FAILURE, error: err });
export const fetchPlayerProfileSuccess = playerProf => ({
	type: FETCH_PLAYERPROFILE_SUCCESS,
	payload: {
		playerProf
	}
});

// Async Action
export const fetchPlayerProfile = (id) => dispatch => {
	dispatch(fetchPlayerProfileRequest());
	playerProfile(id)
		.then(
			playerProf => {
				dispatch(fetchPlayerProfileSuccess(playerProf));
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
			info: {}
		};
	case FETCH_PLAYERPROFILE_SUCCESS:
		return {
			isFetching: false,
			fetchStatus: 'success',
			info: { ...action.payload.playerProf }
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
