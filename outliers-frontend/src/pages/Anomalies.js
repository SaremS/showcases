import * as React from 'react';
import UploadField from '../components/UploadField';
import TsChartDual from '../components/TsChartDual'
import TsChartD3 from '../components/TsChartD3';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

export default function AnomalyDetection({state,updateState}){
	return(
	<div>
		<Box sx={{ flexGrow: 1 }}>
			<h1>Anomaly Detection for Time-Series data - Proof of Concept</h1>
			<hr style={{opacity: 0.5, marginBottom: "30px"}}/>
			<Grid 
				container 
				spacing={2}
				alignItems="center"
				justifyContent="center"
				direction="column"
			>
				<Grid item xs={12}>
					<Paper elevation={3}>
						<TsChartDual
							input={state.anomalies.values} 
							probs={state.anomalies.probabilities}
						/>
					</Paper>
				</Grid>
		
				<Grid item xs={12}>
					<UploadField handleUpdate={updateState}/>
				</Grid>	
				<Grid item xs = {12} style={{marginRight:"60px"}}>
					<h2>What does it do?</h2>
					<p>Technically, the model detects random changes in the statistical distribution of the time-series. Contrary, to "deep" methods, we don't need a lot of data to produce reasonable results. In addition, the model learns without any annotated labels (= unsupervised) and can do so quite efficiently. The preset dataset shows TSLA stock returns from 13/05/2017 - 13/05/2022 and corresponing anomaly score. (large "blue" values indicate high probability of anomaly)</p> 
					<p> Technically, we could also forecast the risk of anomalies at a future point in time. This is, however, not implemented yet.</p>
<hr style={{opacity: 0.5, marginBottom: "30px"}}/>
					<h2>How does it work?</h2>
					<p>The model is built in <a href="https://www.julialang.com" target="_blank">Julia</a> and runs as a webservice using <a href="https://github.com/JuliaWeb/HTTP.jl" target="_blank">HTTP.jl.</a></p>
<hr style={{opacity: 0.5, marginBottom: "30px"}}/>
				<h2>How do I use it?</h2>
				<p>Just upload your time-series as a .csv file by clicking the <b>Upload</b> button. The file should have a single column where each observation is stored in a new row (exporting a single-column Excel sheet as a .csv file should give you the correct format). The data is then sent to the model server which fits the model on your data and returns the probability of each observation being an anomaly. </p>
				<p><b>The data is only used for model training and anomaly detection - no data gets stored anywhere</b></p>
	<p>Unless the model server has to handle many requests in parallel, you should be able to get quick results if your dataset has a low 5-digit number of observations.</p>
		</Grid>


			</Grid>
			
					</Box>
	</div>
	)
	
}



