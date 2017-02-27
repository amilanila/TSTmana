import { API_END_POINT, Player } from '../constants';
import { extractProp, get, disregarder } from './common';

export const allPlayers = disregarder(() => {
	return get(API_END_POINT + Player.ALL)
		.then(extractProp('players'));
});

export const playersByCategory = disregarder(() => {
	return get(API_END_POINT + Player.PLAYER_BY_CATEGORY)
		.then(extractProp('players'));
});

export const playerDetail = disregarder((id) => {
	return get(API_END_POINT + Player.PLAYER_BY_ID.replace(':id', id))
		.then(extractProp('player'));
});

export const playerProfile = disregarder((id) => {
	return get(API_END_POINT + Player.PLAYER_PROFILE_BY_ID.replace(':id', id))
		.then(extractProp('player'));
});

export const loadPlayers = (category) => {
	let endPoint = API_END_POINT + Player.ALL;
	return get(endPoint)
		.then(extractProp('members'));
};
