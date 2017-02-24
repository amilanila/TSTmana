export const API_END_POINT = 'http://localhost:8080/api';

export const Division = {
	ALL: '/division'
};

export const Team = {
	ALL: '/team',
	TEAM_BY_DIVISION: '/team/div/'
};

export const Misc = {
	SESSION: '/session',
	ENV: '/env'
};

export const Player = {
	ALL: '/player',
	PLAYER_BY_ID: '/player/:id',
	PLAYER_BY_CATEGORY: '/player/cat/:cat',
	PLAYER_PROFILE_BY_ID: '/playerprofile/:id'
};