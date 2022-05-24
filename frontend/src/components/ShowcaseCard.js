import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';


const cardImages = {"anomalies": require("../assets/img/anomalies.png"),
		    "reddit_stream": require("../assets/img/reddit_stream.png")}

export default function ShowcaseCard({header, content, image, link}) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image={cardImages[image]}
        alt="green iguaa"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
	  {header}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {content}
	</Typography>
      </CardContent>
      <CardActions>
        <Button size="small">
	  <Link to={link}>Visit</Link>
	</Button>
      </CardActions>
    </Card>
  );
}
