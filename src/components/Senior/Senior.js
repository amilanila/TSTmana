import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Players from '../Players';

export class Senior extends Component {
	render() {
		return (
			<Players category="S"/>
		);
	}
}

export const propTypes = Senior.propTypes = {
	children: PropTypes.element
};

export default connect(
	state => ({
		players: state.players
	})
)(Senior);

