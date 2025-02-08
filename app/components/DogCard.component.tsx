import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import {type IDog} from '../interfaces/IDog.interface';
import React from 'react';

export const DogCard: React.FC<{ dog: IDog }> = ({ dog }) => (
	<Card>
		<CardMedia style={{maxHeight: '140px'}} component="img" height="140" image={dog.img} alt={dog.name} />
		<CardContent>
			<Typography variant="h6">{dog.name}</Typography>
			<Typography>Breed: {dog.breed}</Typography>
			<Typography>Age: {dog.age} years</Typography>
			<Typography>Location: {dog.zip_code}</Typography>
		</CardContent>
	</Card>
);
