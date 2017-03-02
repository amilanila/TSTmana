import { API_END_POINT, Player } from '../constants';
import { extractProp, get, disregarder } from './common';

export const loadPlayersStat = disregarder(() => {
	return get(API_END_POINT + Player.PLAYER_ALL)
		.then(extractProp('players'));
});

export const playerProfile = disregarder((id) => {
	return get(API_END_POINT + Player.PLAYER_PROFILE_BY_ID.replace(':id', id))
		.then(extractProp('player'));
});

export const loadMembers = () => {
	let endPoint = API_END_POINT + Player.MEMBER_ALL;
	return get(endPoint)
		.then(extractProp('members'));
};
