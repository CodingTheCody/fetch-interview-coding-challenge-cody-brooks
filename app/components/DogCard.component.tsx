import {Card, CardMedia, CardContent, Typography, Button} from '@mui/material';
import {type IDog} from '~/interfaces/IDog.interface';
import React, {useMemo, useContext} from 'react';
import {DogMatchContext} from '~/contexts/DogMatch.context';

export const DogCard: React.FC<{ dog: IDog, hideMatchButton?: boolean }> = ({dog, hideMatchButton}) => {
	const dogMatchContext = useContext(DogMatchContext);
	const isMatched = useMemo(() => dogMatchContext.dogIds.has(dog.id), [dogMatchContext.dogIds, dog.id]);

	const handleMatch = () => {
		isMatched ? dogMatchContext.removeDogId(dog.id) : dogMatchContext.addDogId(dog.id);
	};

	return (
		<Card>
			<CardMedia style={{maxHeight: '140px'}} component="img" height="140" image={dog.img}
					   alt={'Dog named ' + dog.name}/>
			<CardContent>
				<Typography variant="h6">{dog.name}</Typography>
				<Typography>Breed: {dog.breed}</Typography>
				<Typography>Age: {dog.age === 0 ? `Under 1 years` : dog.age + ` year${dog.age === 1 ? '' : 's'}`} old</Typography>
				<Typography>Zip Code: {dog.zip_code}</Typography>

				{!hideMatchButton &&
                    <Button variant="outlined" color={isMatched ? 'warning' : 'primary'} onClick={handleMatch}>{isMatched ? 'Unmatch' : 'Match'}</Button>}
			</CardContent>
		</Card>
	);
}
