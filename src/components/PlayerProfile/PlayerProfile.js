import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchPlayerProfile } from '../../redux/modules/playerprofile';
import {
	Card,
	CardActions,
	CardHeader,
	CardMedia,
	CardTitle,
	CardText
} from 'material-ui/Card';
import { List } from 'material-ui/List';
import { Grid, Row, Col } from 'react-bootstrap';

export class PlayerProfile extends Component {

	render() {
		const playerprofile = this.props.playerprofile;
		const { info } = !!this.props.playerprofile && this.props.playerprofile;

		return (
			<div>
				{!!info && !!info.length && !!info[0].id &&
					<Card>
						<CardHeader
							title={info[0].name}
							avatar="/images/avatar1.jpg"
						/>
						<CardText>
							Age: {info[0].birthday}<br/>
							Height: {info[0].height}<br/>
							Weight: {info[0].weight}<br/>
							Description: {info[0].description}<br/>
							Team: {info[0].team}<br/>
							Division: {info[0].division}<br/>
							Season: {info[0].season}
						</CardText>
					</Card>
				}
				<hr/>
				{!!info && !!info.length && !!info[0].id &&
					<Grid>
						{info.map((player) =>
							<Row className="show-grid">
						      <Col xs={1} md={1}>{player.match}</Col>
						      <Col xs={1} md={1}>{player.runs}</Col>
						      <Col xs={1} md={1}>{player.outs}</Col>
						      <Col xs={1} md={1}>{player.oversBowled}</Col>
						      <Col xs={1} md={1}>{player.wickets}</Col>
						      <Col xs={1} md={1}>{player.runsConceded}</Col>
						      <Col xs={1} md={1}>{player.catches}</Col>
						      <Col xs={1} md={1}>{player.contribution}</Col>
						    </Row>
						)}				
					</Grid>
				}
			</div>
		);
	}
}

export const propTypes = PlayerProfile.propTypes = {
	playerprofile: PropTypes.object,
	fetchPlayerProfile: PropTypes.func.isRequired,
	selectedPlayer: PropTypes.object
};

export default connect(
	state => ({
		playerprofile: state.playerprofile
	}), {
		fetchPlayerProfile
	}
)(PlayerProfile);
