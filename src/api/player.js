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

export const loadPlayers = (category) => {
	let endPoint = API_END_POINT + Player.ALL;
	if (!!category) {
		endPoint = API_END_POINT + Player.PLAYER_BY_CATEGORY.replace(':cat', category);
	}
	return get(endPoint)
		.then(extractProp('players'));
};
