import * as React from 'react';
import UploadField from '../components/UploadField';
import TimeSeriesChart from '../components/TimeSeriesChart';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TitleSentimentCard from '../components/TitleSentimentCard';

export default function SentimentStream({state,titleSentiment,updateState}){
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
				<br/>
				<Grid container spacing={2} style={{minWidth:"70vw"}}>	
				<Grid item md={4} xs={12}>
					<TitleSentimentCard header={"Lowest average sentiment"}
							    title={titleSentiment["min"]["title"]}
							    sentiment={titleSentiment["min"]["avg_sentiment"]}
							    count={titleSentiment["min"]["count"]}
							    color={"#fc6a60"}
					/>	
				</Grid>
				<Grid item md={4} xs={12}>
					<TitleSentimentCard header={"Most comments"}

							    title={titleSentiment["countmax"]["title"]}
							    sentiment={titleSentiment["countmax"]["avg_sentiment"]}
							    count={titleSentiment["countmax"]["count"]}
							    color={"#ffffff"}
					/>	
				</Grid>
				<Grid item md={4} xs={12}>
					<TitleSentimentCard header={"Highest average sentiment"}
							    title={titleSentiment["max"]["title"]}
							    sentiment={titleSentiment["max"]["avg_sentiment"]}
							    count={titleSentiment["max"]["count"]}
							    color={"#66ff7a"}
					/>	
				</Grid>
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



