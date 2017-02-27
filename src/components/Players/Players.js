import React, { Component, PropTypes } from 'react';
import { List } from 'material-ui/List';
import { connect } from 'react-redux';
import { fetchPlayers } from '../../redux/modules/player';
import Subheader from 'material-ui/Subheader';
import PlayerEntry from '../PlayerEntry';
import PlayerProfile from '../PlayerProfile';
import { Grid, Row, Col } from 'react-bootstrap';

export class Players extends Component {
	componentDidMount() {
		this.props.fetchPlayers();
	}

	render() {
		const { list } = this.props.players;
		return (
			<Grid>
				{!!list && !!list.length &&
					<Row className="show-grid">
						<Col xs={12} md={8}>
							<Subheader>Players</Subheader>
							<List>
								{list.map((player) =>
									<PlayerEntry entry={player} key={player.id} playerId={player.id}/>
								)}
							</List>
						</Col>
						<Col xs={6} md={4}>
							<PlayerProfile/>
						</Col>
					</Row>
				}
			</Grid>
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

