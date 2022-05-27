import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    ¥
  </Box>
);

export default function TitleSentimentCard({header, title, sentiment, count, color}) {
  return (
    <Card sx={{ minHeight: 150}} style={{backgroundColor: color}}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
	  {header}
        </Typography>
        <Typography variant="h3" component="div">
	  {title}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Average Sentiment
        </Typography>
        <Typography variant="body2">
	  {sentiment}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Comment Count
        </Typography>
	<Typography variant="body2">
	  {count}
        </Typography>
      </CardContent>
    </Card>
  );
}
