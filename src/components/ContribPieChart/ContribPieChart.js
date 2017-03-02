import React, { Component, PropTypes } from 'react';
import { PieChart } from 'react-easy-chart';

const baseStyles = {
	padding: 30
};

class GraphDataEntry {
	constructor(key, value) {
		this.key = key;
		this.value = value;
	}
}

export class ContribPieChart extends Component {

	render() {
		const { data } = this.props;
		const graphData = new Array();

		if (!!data && !!data.size) {
			data.forEach((val, key) => {
				if ( val > 0) {
					let entry = new GraphDataEntry(key, val);
					graphData.push(entry);	
				}
			});
		}

		return (
			<div style={ {...baseStyles} }>
				{!!graphData && !!graphData.length &&
					<PieChart
						size={250}
						labels
					    data={graphData}
					    styles={{
					      '.chart_text': {
					        fontSize: '1em',
					        fill: '#fff'
					      }
					    }}
					/>
				}
			</div>
		);
	}
}

export const propTypes = ContribPieChart.propTypes = {
	data: PropTypes.object
};

export default ContribPieChart;
