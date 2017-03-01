import React, { Component, PropTypes } from 'react';
import { BarChart } from 'react-easy-chart';

const baseStyles = {
	padding: 30
};

export class ScoreBarChart extends Component {

	render() {
		let graphData = this.props.graphData;
		
		return (
			<div style={ {...baseStyles} }>
				{!!graphData && !!graphData.length &&
					<BarChart
					    axisLabels={{x: 'Game', y: 'Score', y2: ' '}}
					    axes
					    grid
					    colorBars
					    height={250}
					    width={650}
					    xDomainRange={[1, 15]}
						yDomainRange={[0, 20]}
						interpolate={'cardinal'}
						y2Type="linear"
					    data={graphData}
					    lineData={graphData}
					 />
				}
			</div>
		);
	}
}

export const propTypes = ScoreBarChart.propTypes = {
	graphData: PropTypes.object
};

export default ScoreBarChart;
