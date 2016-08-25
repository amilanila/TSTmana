import React, { Component, PropTypes } from 'react';
import { List } from 'material-ui/List';
import { connect } from 'react-redux';
import { fetchPlayers } from '../../redux/modules/player';
import Subheader from 'material-ui/Subheader';
import PlayerEntry from '../PlayerEntry';

export class Players extends Component {
	componentDidMount() {
		this.props.fetchPlayers(this.props.category);
	}

	render() {
		const { list } = this.props.players;
		return (
			<div>
				<Subheader>Players</Subheader>
				{!!list && !!list.length &&
					<List>
						{list.map((player) =>
							<PlayerEntry entry={player} key={player.id}/>
						)}
					</List>
				}
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

