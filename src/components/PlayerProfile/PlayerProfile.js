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

export class PlayerProfile extends Component {

	render() {
		const playerprofile = this.props.playerprofile;

		return (
			<div>
				{!!playerprofile && !!playerprofile.info && !!playerprofile.info[0] && !!playerprofile.info[0].id &&
					<Card>
						<CardHeader
							title={playerprofile.info[0].name}
							avatar="/images/avatar1.jpg"
						/>
						<CardText>
							Age: {playerprofile.info[0].birthday}<br/>
							Height: {playerprofile.info[0].height}<br/>
							Weight: {playerprofile.info[0].weight}<br/>
							Description: {playerprofile.info[0].description}<br/>
							Team: {playerprofile.info[0].team}
						</CardText>
					</Card>
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
