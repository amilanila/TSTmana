import React, { Component, PropTypes } from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';

const baseStyles = {
};

export class PlayerCard extends Component {

	render() {
		let player = this.props.info;
		
		return (
			<div style={ {...baseStyles} }>
				{!!player &&
					<Card>
						<CardHeader
							title={player.name}
							avatar="/images/avatar1.jpg"
						/>
						<CardText>
							Age: {player.birthday}<br/>
							Height: {player.height}<br/>
							Weight: {player.weight}<br/>
							Description: {player.description}<br/>
							Team: {player.team}<br/>
							Division: {player.division}<br/>
							Season: {player.season}
						</CardText>
					</Card>
				}
			</div>
		);
	}
}

export const propTypes = PlayerCard.propTypes = {
	info: PropTypes.object
};

export default PlayerCard;
