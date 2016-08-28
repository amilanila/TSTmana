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
				<Subheader>Players</Subheader>
				{!!list && !!list.length &&
					<List>
						{(list.filter(plyr => plyr.category === this.props.category)).map((player) =>
							<PlayerEntry entry={player} key={player.id} playerId={player.id}/>
						)}
					</List>
				}
				<PlayerProfile/>
			</div>
		);
	}
}

export const propTypes = Players.propTypes = {
	fetchPlayers: PropTypes.func.isRequired,
	players: PropTypes.object,
	category: PropTypes.string
};

export default connect(
	state => ({
		players: state.player
	}),	{
		fetchPlayers
	}
)(Players);

