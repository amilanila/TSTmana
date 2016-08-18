import { players } from '../../api/player';

export const FETCH_PLAYER_REQUEST = 'FETCH_PLAYER_REQUEST';
export const FETCH_PLAYER_SUCCESS = 'FETCH_PLAYER_SUCCESS';
export const FETCH_PLAYER_FAILURE = 'FETCH_PLAYER_FAILURE';

// Sync Actions
export const fetchPlayerRequest = () => ({ type: FETCH_PLAYER_REQUEST });
export const fetchPlayerFailure = err => ({ type: FETCH_PLAYER_FAILURE, error: err });
export const fetchPlayerSuccess = player => ({
	type: FETCH_PLAYER_SUCCESS,
	payload: {
		player
	}
});

// Async Action
export const fetchPlayers = () => dispatch => {
	dispatch(fetchPlayerRequest());
	players()
		.then(
			player => {
				dispatch(fetchPlayerSuccess(player));
			},
			err => dispatch(fetchPlayerFailure(err))
		)
		.catch(e => setTimeout(() => { throw e; }));
};

// Reducer
export default (state = { info: {} }, action) => {
	switch (action.type) {
	case FETCH_PLAYER_REQUEST:
		return {
			isFetching: true,
			fetchStatus: 'pending',
			info: {}
		};
	case FETCH_PLAYER_SUCCESS:
		return {
			isFetching: false,
			fetchStatus: 'success',
			info: { ...action.payload.players }
		};
	case FETCH_PLAYER_FAILURE:
		return {
			isFetching: false,
			fetchStatus: 'failure',
			info: {}
		};
	default:
		return state;
	}
};
