import React from 'react';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';

const Players = () => {
	return (
		<List>
			<Subheader>Players</Subheader>
			<ListItem
				primaryText="Chelsea Otakan"
				leftAvatar={<Avatar src="/images/avatar1.jpg" />}
			/>
			<ListItem
				primaryText="James Anderson"
				leftAvatar={<Avatar src="/images/avatar2.jpg" />}
			/>
		</List>
	);
};

export default Players;
