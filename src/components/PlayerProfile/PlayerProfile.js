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
		let fullName = '';

		if (!!playerprofile && !!playerprofile.info && !!playerprofile.info.id) {
			fullName = playerprofile.info.fname + ' ' + playerprofile.info.lname;
		}

		return (
			<div>
				{!!playerprofile && !!playerprofile.info && !!playerprofile.info.id &&
					<Card>
						<CardHeader
							title={fullName}
							avatar="/images/avatar1.jpg"
						/>
						<CardText>
							Age: {playerprofile.info.age}<br/>
							Height: {playerprofile.info.height}<br/>
							Weight: {playerprofile.info.weight}<br/>
							Club: {playerprofile.info.club}
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
