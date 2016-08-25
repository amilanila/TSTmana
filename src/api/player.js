import { API_END_POINT, Player } from '../constants';
import { extractProp, extractAll, get, disregarder } from './common';

export const allPlayers = disregarder(() => {
	return get(API_END_POINT + Player.ALL)
		.then(extractProp('players'));
});

export const playersByCategory = disregarder(() => {
	return get(API_END_POINT + Player.PLAYER_BY_CATEGORY)
		.then(extractProp('players'));
});

export const playerDetail = disregarder(() => {
	return get(API_END_POINT + Player.PLAYER_BY_ID)
		.then(extractAll());
});

export const loadPlayers = (category) => {
	let endPoint = API_END_POINT + Player.ALL;
	if (!!category) {
		endPoint = API_END_POINT + Player.PLAYER_BY_CATEGORY.replace(':cat', category);
	}
	return get(endPoint)
		.then(extractProp('players'));
};
