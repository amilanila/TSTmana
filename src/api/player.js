import { API_END_POINT, Player } from '../constants';
import { extractAll, get, disregarder } from './common';

export const players = disregarder(() => {
	return get(API_END_POINT + Player.ALL)
		.then(extractAll());
});

export const playerDetail = disregarder(() => {
	return get(API_END_POINT + Player.PLAYER_BY_ID)
		.then(extractAll());
});

export const playersByCategory = disregarder(() => {
	return get(API_END_POINT + Player.PLAYER_BY_CATEGORY)
		.then(extractAll());
});
