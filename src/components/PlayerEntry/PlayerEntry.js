import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

export class PlayerEntry extends Component {
	render() {
		const { entry } = this.props;
		const fullName = entry.fname + ' ' + entry.lname;
		return (
			<ListItem
				id={entry.id}
				primaryText={fullName}
				leftAvatar={<Avatar src="/images/avatar1.jpg" />}
			/>
		);
	}
}

export const propTypes = PlayerEntry.propTypes = {
	entry: PropTypes.object
};

export default connect(
	state => ({
		// TODO
	}),	{
		// TODO
	}
)(PlayerEntry);

