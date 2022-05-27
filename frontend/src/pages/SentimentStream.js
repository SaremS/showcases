import * as React from 'react';
import UploadField from '../components/UploadField';
import TimeSeriesChart from '../components/TimeSeriesChart';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TitleSentimentCard from '../components/TitleSentimentCard';

const explainImg = require("../assets/img/sentiment-stream-img.jpg")

export default function SentimentStream({state,titleSentiment,updateState}){
	return(
	<div>
		<Box sx={{ flexGrow: 1 }}>
			<h1>Streaming sentiment analysis of comments on r/CryptoCurrency</h1>
			<hr style={{opacity: 0.5, marginBottom: "30px"}}/>
			<Grid 
				container 
				spacing={2}
				alignItems="center"
				justifyContent="center"
			>
				<Grid item xs={12} md={12}>
					<Paper elevation={3}>
						<TimeSeriesChart
							data={state.map(x => ({"index": x["time"], "value": x["sentiment_moving_avg"]}))} 
						/>
					</Paper>
				</Grid>
				<br/>
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
				<Grid item xs = {12} style={{marginRight:"60px"}}>
				<h2>How does it work?</h2>
				<img src={explainImg} style={{width: "50%", height:"50%"}}/>
		</Grid>


			</Grid>
			
					</Box>
	</div>
	)
	
}



