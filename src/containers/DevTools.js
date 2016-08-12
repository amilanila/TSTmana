import React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

const devTools = localStorage.getItem('devtools');
const isVisible = !devTools || devTools !== 'hide';

export default createDevTools(
	// Monitors are individually adjustable with props.
	// Consult their repositories to learn about those props.
	// Here, we put LogMonitor inside a DockMonitor.
	// Docs: https://github.com/gaearon/redux-devtools-dock-monitor
	<DockMonitor
		defaultIsVisible={isVisible}
		toggleVisibilityKey="ctrl-h"
		changePositionKey="ctrl-q"
		defaultPosition="left"
		fluid
	>
		<LogMonitor theme="tomorrow" />
	</DockMonitor>
);
