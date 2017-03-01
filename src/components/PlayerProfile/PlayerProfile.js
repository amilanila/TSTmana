import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchPlayerProfile } from '../../redux/modules/playerprofile';
import StatTable from '../StatTable';
import ScoreBarChart from '../ScoreBarChart';
import PlayerCard from '../PlayerCard';

const baseStyles = {
	padding: 30
};

class GraphDataEntry {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

export class PlayerProfile extends Component {

	render() {
		const { info } = !!this.props.playerprofile && this.props.playerprofile;
		const graphData = new Array();

		if (!!info && !!info.map) {
			info.map((player) => {
				let graphDataEntry = new GraphDataEntry(player.match, player.runs);
				graphData.push(graphDataEntry);
			});	
		}

		return (
			<div>
				<div style={ {...baseStyles} }>
					{!!info && !!info.length && !!info[0].id &&
						<PlayerCard info={info[0]}/>
					}
				</div>
				<div style={ {...baseStyles} }>
					{!!info &&
						<StatTable info={info}/>
					}
				</div>
				<div style={ {...baseStyles} }>
					{!!graphData && !!graphData.length &&
						<ScoreBarChart graphData={graphData}/>
					}
				</div>				
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
