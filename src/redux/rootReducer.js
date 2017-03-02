import { combineReducers } from 'redux';
// import { reducer as form } from 'redux-form';
import staticRender from './modules/staticRender';
// import env from './modules/env';
import player from './modules/player';
import playerprofile from './modules/playerprofile';
import playersStat from './modules/playersStat';

export default combineReducers({
	staticRender,
	// env,
	// form,
	player,
	playerprofile,
	playersStat
});
