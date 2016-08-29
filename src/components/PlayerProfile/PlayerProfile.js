import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
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
		const { playerprofile } = this.props;
		const fullName = playerprofile.info.fname + ' ' + playerprofile.info.lname
		return (
			<div>
				<Card>
					<CardHeader
						title={fullName}
						avatar="/images/avatar1.jpg"
					/>
					<CardText>
						{playerprofile.info.category}<br/>
						{playerprofile.info.profile}
					</CardText>
				</Card>
			</div>
		);
	}
}

export const propTypes = PlayerProfile.propTypes = {
	playerprofile: PropTypes.object
};

export default connect(
	state => ({
		playerprofile: state.playerprofile
	})
)(PlayerProfile);
