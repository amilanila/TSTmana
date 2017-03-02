import { loadPlayersStat } from '../../api/player';

export const FETCH_PLAYERS_STAT_REQUEST = 'FETCH_PLAYERS_STAT_REQUEST';
export const FETCH_PLAYERS_STAT_SUCCESS = 'FETCH_PLAYERS_STAT_SUCCESS';
export const FETCH_PLAYERS_STAT_FAILURE = 'FETCH_PLAYERS_STAT_FAILURE';

// Sync Actions
export const fetchPlayersStatRequest = () => ({ type: FETCH_PLAYERS_STAT_REQUEST });
export const fetchPlayersStatFailure = err => ({ type: FETCH_PLAYERS_STAT_FAILURE, error: err });
export const fetchPlayersStatSuccess = playersStat => ({
	type: FETCH_PLAYERS_STAT_SUCCESS,
	payload: {
		playersStat
	}
});

// Async Action
export const fetchPlayersStat = () => dispatch => {
	dispatch(fetchPlayersStatRequest());
	loadPlayersStat()
		.then(
			playersStat => {
				dispatch(fetchPlayersStatSuccess(playersStat));
			},
			err => dispatch(fetchPlayersStatFailure(err))
		)
		.catch(e => setTimeout(() => { throw e; }));
};

// Reducer
export default (state = { stats: [] }, action) => {
	switch (action.type) {
	case FETCH_PLAYERS_STAT_REQUEST:
		return {
			isFetching: true,
			fetchStatus: 'pending',
			stats: [...state.stats]
		};
	case FETCH_PLAYERS_STAT_SUCCESS:
		return {
			isFetching: false,
			fetchStatus: 'success',
			stats: [...action.payload.playersStat]
		};
	case FETCH_PLAYERS_STAT_FAILURE:
		return {
			isFetching: false,
			fetchStatus: 'failure',
			stats: []
		};
	default:
		return state;
	}
};
