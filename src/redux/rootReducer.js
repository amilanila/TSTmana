import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import staticRender from './modules/staticRender';
import env from './modules/env';

export default combineReducers({
	staticRender,
	env,
	form
});
