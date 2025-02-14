import {Modal, Box, Typography} from '@mui/material';
import {useState, useMemo, useEffect} from 'react';
import {type IDog} from '~/interfaces/IDog.interface';
import {DogsService} from '~/services/Dogs.service';
import {container} from 'tsyringe';
import {DogCard} from '~/components/DogCard.component';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	pt: 2,
	px: 4,
	pb: 3,
};

export function MatchedDogModal({dogId, onClose}: { dogId: string|undefined, onClose: () => void }) {
	const [dogDetails, setDogDetails] = useState<IDog | undefined>(undefined);
	const dogsService = useMemo(() => container.resolve(DogsService), []);

	useEffect(() => {
		if (!dogId) return;
		dogsService.getDogsByDogIds([dogId as string]).then(dogs => {
			setDogDetails(dogs[0]);
		});
	}, [dogId]);

	if (!dogId) return null;
	return <Modal open={true} onClose={onClose} aria-labelledby="dog-match-modal"
				  aria-describedby="dog-match-modal-description">
		<Box sx={{...style}}>
			<Typography id="modal-modal-title" variant="h6" component="h2">
				Here is your future loved one!
			</Typography>
			<Typography id="modal-modal-description" sx={{mt: 2}}>
				{dogDetails && <DogCard dog={dogDetails} hideMatchButton={true}/>}
			</Typography>
		</Box>
	</Modal>
}
