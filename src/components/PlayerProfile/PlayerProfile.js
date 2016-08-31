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
		const fullName = playerprofile.info.fname + ' ' + playerprofile.info.lname;
		return (
			<div>
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
