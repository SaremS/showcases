import { Chart } from 'react-google-charts';
import * as React from 'react';


export default function TsChartDual({input, probs}){
	var chartData = [["Index", "Probability of anomaly", "Time Series"]];

	for (let i = 1; i <= input.length; i++){
		chartData.push([i, probs[i], input[i]])
	};

	const options = {
		title: "Data",
		legend: { position: "bottom" },
		animation: {
			duration: 500,
			easing: "out",
			startup: true
		},
		series: {
			0: {targetAxisIndex: 1, lineWidth: 0.5},
			1: {targetAxisIndex: 0, lineWidth: 1.5}
		},
		vAxes: {
			0:{title: "Time Series"},
			1:{title: "Probability of anomaly"}
		}
	};
	return(
		<Chart
			chartType="LineChart"
			width="70vw"
			height="40vh"
			data={chartData}
			options={options}
		/>	
	)
}
