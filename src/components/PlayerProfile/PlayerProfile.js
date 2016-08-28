import React from 'react';
import {
	Card,
	CardActions,
	CardHeader,
	CardMedia,
	CardTitle,
	CardText
} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const PlayerProfile = () => {
	return (
		<div>
			<Card>
				<CardHeader title="URL Avatar" subtitle="Subtitle" avatar="/images/avatar1.jpg"/>
				<CardTitle title="Card title" subtitle="Card subtitle" />
				<CardText>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
					Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
					Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
				</CardText>
			</Card>
		</div>
	);
};

export default PlayerProfile;
