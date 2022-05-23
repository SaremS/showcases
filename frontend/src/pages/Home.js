import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ShowcaseCard from '../components/ShowcaseCard'

const showcases = require('../assets/data/showcases.json');

const showCjson = JSON.parse(JSON.stringify(showcases))
const showcaseCards = showCjson.map((data)=>{
	return <Grid item xs = {4} xs = {12}>
		<ShowcaseCard 
		header={data.header}
		content={data.content}
		image={data.image}
		link={data.link}
		/>
	</Grid>}
)

export default function Home({state,updateState}){
	return(
	<div>
		<Box sx={{ flexGrow: 1 }}>
			<h1>Home</h1>
			<hr style={{opacity: 0.5, marginBottom: "30px"}}/>
			<Grid 
				container 
				spacing={2}
				alignItems="center"
			>
				
				<Grid item xs = {12} style={{marginRight:"60px"}}>
					<h2>Choose an element</h2>
				</Grid>
				
				{showcaseCards}
			</Grid>
			
		</Box>
	</div>
	)
	
}



