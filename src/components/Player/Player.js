import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Players from '../Players';

export class Player extends Component {
	render() {
		return (
			<Players/>
		);
	}
}

export const propTypes = Player.propTypes = {
	children: PropTypes.element
};

export default connect(
	state => ({
		players: state.players
	})
)(Player);

