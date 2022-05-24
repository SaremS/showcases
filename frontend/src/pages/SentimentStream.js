import * as React from 'react';
import UploadField from '../components/UploadField';
import TimeSeriesChart from '../components/TimeSeriesChart';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

export default function SentimentStream({state,updateState}){
	return(
	<div>
		<Box sx={{ flexGrow: 1 }}>
			<h1>Streaming sentiment analysis of comments on r/news</h1>
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
						<TimeSeriesChart
							data={state.map(x => ({"index": x["time"], "value": x["sentiment_moving_avg"]}))} 
						/>
					</Paper>
				</Grid>
		
				<Grid item xs={12}>
					<UploadField handleUpdate={updateState}/>
				</Grid>	
				<Grid item xs = {12} style={{marginRight:"60px"}}>
					<h2>What does it do?</h2>
<hr style={{opacity: 0.5, marginBottom: "30px"}}/>
					<h2>How does it work?</h2>
<hr style={{opacity: 0.5, marginBottom: "30px"}}/>
				<h2>How do I use it?</h2>
		</Grid>


			</Grid>
			
					</Box>
	</div>
	)
	
}



