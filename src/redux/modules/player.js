import { allPlayers } from '../../api/player';

export const FETCH_PLAYERS_REQUEST = 'FETCH_PLAYERS_REQUEST';
export const FETCH_PLAYERS_SUCCESS = 'FETCH_PLAYERS_SUCCESS';
export const FETCH_PLAYERS_FAILURE = 'FETCH_PLAYERS_FAILURE';

// Sync Actions
export const fetchPlayersRequest = () => ({ type: FETCH_PLAYERS_REQUEST });
export const fetchPlayersFailure = err => ({ type: FETCH_PLAYERS_FAILURE, error: err });
export const fetchPlayersSuccess = players => ({
	type: FETCH_PLAYERS_SUCCESS,
	payload: {
		players
	}
});

// Async Action
export const fetchPlayers = () => dispatch => {
	dispatch(fetchPlayersRequest());
	allPlayers()
		.then(
			players => {
				dispatch(fetchPlayersSuccess(players));
			},
			err => dispatch(fetchPlayersFailure(err))
		)
		.catch(e => setTimeout(() => { throw e; }));
};

// Reducer
export default (state = { list: [] }, action) => {
	switch (action.type) {
	case FETCH_PLAYERS_REQUEST:
		return {
			isFetching: true,
			fetchStatus: 'pending',
			list: [...state.list]
		};
	case FETCH_PLAYERS_SUCCESS:
		return {
			isFetching: false,
			fetchStatus: 'success',
			list: [...action.payload.players]
		};
	case FETCH_PLAYERS_FAILURE:
		return {
			isFetching: false,
			fetchStatus: 'failure',
			list: []
		};
	default:
		return state;
	}
};
