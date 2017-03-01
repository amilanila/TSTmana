import React, { Component, PropTypes } from 'react';
import { List } from 'material-ui/List';
import { connect } from 'react-redux';
import { fetchPlayers } from '../../redux/modules/player';
import Subheader from 'material-ui/Subheader';
import PlayerEntry from '../PlayerEntry';
import PlayerProfile from '../PlayerProfile';

export class Players extends Component {
	componentDidMount() {
		this.props.fetchPlayers();
	}

	render() {
		const { list } = this.props.players;
		return (
			<div>
				{!!list && !!list.length &&
					<List>
						{list.map((player) =>
							<PlayerEntry entry={player} key={player.id} playerId={player.id}/>
						)}
					</List>
				}
			</div>
		);
	}
}

export const propTypes = Players.propTypes = {
	fetchPlayers: PropTypes.func.isRequired,
	players: PropTypes.object
};

export default connect(
	state => ({
		players: state.player
	}),	{
		fetchPlayers
	}
)(Players);

