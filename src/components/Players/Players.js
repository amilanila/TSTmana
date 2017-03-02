import React, { Component, PropTypes } from 'react';
import { List } from 'material-ui/List';
import PlayerEntry from '../PlayerEntry';

export class Players extends Component {
	
	render() {
		const { list } = this.props;
		
		return (
			<div>
				{!!list && !!list.length &&
					<List>
						{list.map((player) =>
							<PlayerEntry entry={player} key={player.id} playerId={player.id}/>
						)}
					</List>
				}
				
			</div>
		);
	}
}

export const propTypes = Players.propTypes = {
	list: PropTypes.object
};

export default Players;

