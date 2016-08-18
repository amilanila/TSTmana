import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchPlayers } from '../../redux/modules/player';
import Players from '../Players';
import PlayerProfile from '../PlayerProfile';
import Divider from 'material-ui/Divider';
import { Grid, Row, Col } from 'react-bootstrap';

export class Junior extends Component {
	componentDidMount() {
		this.props.fetchPlayers();
	}

	render() {
		return (
			<div>
				<h2>Junior</h2>
				<span>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
				sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
				Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
				nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet,
				consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
				labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
				exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
				</span>
				<Divider/>
				<Grid>
					<Row className="show-grid">
						<Col xs={6} md={4}>
							<Players/>
						</Col>
						<Col xs={12} md={8}>
							<PlayerProfile/>
						</Col>
					</Row>
				</Grid>
			</div>
		);
	}
}

export const propTypes = Junior.propTypes = {
	children: PropTypes.element,
	fetchPlayers: PropTypes.func.isRequired
};

export default connect(
	state => ({
		players: state.players
	}),	{
		fetchPlayers
	}
)(Junior);

