import React, { Component, PropTypes } from 'react';
import { List } from 'material-ui/List';
import { connect } from 'react-redux';
import { fetchPlayers } from '../../redux/modules/player';
import { fetchPlayersStat } from '../../redux/modules/playersStat';
import Subheader from 'material-ui/Subheader';
import PlayerEntry from '../PlayerEntry';
import ContribPieChart from '../ContribPieChart';

export class Players extends Component {
	componentDidMount() {
		this.props.fetchPlayers();
		this.props.fetchPlayersStat();
	}

	render() {
		const { list } = this.props.players;
		const { stats } = this.props.playersStat;

		const playersTotalRunsMap = new Map();
		const playersTotalWicketsMap = new Map();
		const playersTotalRunsConcededMap = new Map();
		const playersTotalContributionMap = new Map();
		
		if (!!list && !!list.length && !!stats && !!stats.length) {
			for (let member of list) {

				let totalRuns = 0;
				let totalWickets = 0;
				let totalRunsConceded = 0;
				let totalContribution = 0;

				for (let player of stats) {
					if (member.id === player.id) {

						totalRuns += player.runs;
						totalWickets += player.wickets;
						totalRunsConceded += player.runsConceded;
						totalContribution += player.contribution;
					}
				}

				let fullName = member.name;
				let firstName = fullName.substr(0, fullName.indexOf(' '));

				// Runs
				playersTotalRunsMap.set(firstName, totalRuns);

				// Wickets
				playersTotalWicketsMap.set(firstName, totalWickets);
				
				// Runs conceded
				playersTotalRunsConcededMap.set(firstName, totalRunsConceded);
				
				// Contribution
				playersTotalContributionMap.set(firstName, totalContribution);
			}
		}
		
		return (
			<div>
				{!!list && !!list.length &&
					<List>
						{list.map((player) =>
							<PlayerEntry entry={player} key={player.id} playerId={player.id}/>
						)}
					</List>
				}
				{!!playersTotalRunsMap && !!playersTotalRunsMap.size &&
					<ContribPieChart data={playersTotalRunsMap}/>
				}
			</div>
		);
	}
}

export const propTypes = Players.propTypes = {
	fetchPlayers: PropTypes.func.isRequired,
	fetchPlayersStat: PropTypes.func.isRequired,
	players: PropTypes.object,
	playersStat: PropTypes.object
};

export default connect(
	state => ({
		players: state.player,
		playersStat: state.playersStat
	}),	{
		fetchPlayers,
		fetchPlayersStat
	}
)(Players);

