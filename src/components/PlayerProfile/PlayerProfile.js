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
	componentDidMount() {
		if (!!this.props.selectedPlayer && !!this.props.selectedPlayer.id) {
			this.props.fetchPlayerProfile(this.props.selectedPlayer.id);
		}
	}

	render() {
		let { selectedPlayer } = this.props;
		const playerprofile = this.props.playerprofile;

		if (!!playerprofile && !!playerprofile.info && !!playerprofile.info.id) {
			selectedPlayer = playerprofile.info;
		}
		const fullName = selectedPlayer.fname + ' ' + selectedPlayer.lname;

		return (
			<div>
				<Card>
					<CardHeader
						title={fullName}
						avatar="/images/avatar1.jpg"
					/>
					<CardText>
						Age: {selectedPlayer.age}<br/>
						Height: {selectedPlayer.height}<br/>
						Weight: {selectedPlayer.weight}<br/>
						Club: {selectedPlayer.club}
					</CardText>
				</Card>
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
