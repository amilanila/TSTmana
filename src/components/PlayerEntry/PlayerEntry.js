import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchPlayerProfile } from '../../redux/modules/playerprofile';
import { ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

export class PlayerEntry extends Component {

	constructor() {
		super();
		this._onClick = this._onClick.bind(this);
	}

	_onClick() {
		this.props.fetchPlayerProfile(this.props.entry.id);
	}

	render() {
		const { entry } = this.props;
		return (
			<ListItem
				id={entry.id}
				primaryText={entry.name}
				leftAvatar={<Avatar src="/images/avatar1.jpg"/>}
				onClick={this._onClick}
			/>
		);
	}
}

export const propTypes = PlayerEntry.propTypes = {
	entry: PropTypes.object,
	fetchPlayerProfile: PropTypes.func.isRequired
};

export default connect(
	state => ({
		playerProfile: state.playerProfile
	}),	{
		fetchPlayerProfile
	}
)(PlayerEntry);

