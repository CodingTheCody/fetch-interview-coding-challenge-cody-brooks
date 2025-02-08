import {FormEvent, useEffect, useState, useCallback} from 'react';
import {BreedsFilter} from '~/components/BreedsFilter.component';
import {Button} from '@mui/material';
import {container} from 'tsyringe';
import {DogsService} from '~/services/Dogs.service';
import {ISearchDogsQuery} from '~/interfaces/ISearchDogsQuery.interface';
import {AgeSlider} from '~/components/AgeSlider.component';

const dogsService = container.resolve(DogsService);

export function DogSearchForm({onSubmit, defaultQuery}: {
	onSubmit: (query: ISearchDogsQuery) => void,
	defaultQuery?: ISearchDogsQuery,
}) {
	const [breeds, setBreeds] = useState<string[] | undefined>(defaultQuery?.breeds);
	const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
	const [ageMin, setAgeMin] = useState(defaultQuery?.ageMin || 0);
	const [ageMax, setAgeMax] = useState(defaultQuery?.ageMax || 0);

	// get breeds (1 time call)
	useEffect(() => {
		if (breeds && breeds.length > 0) return;
		dogsService.getBreeds().then(breeds => {
			setBreeds(breeds);
		});
	}, []);

	const onSubmitCallback = useCallback((evt: FormEvent) => {
		evt.preventDefault();
		const query: ISearchDogsQuery = {
			breeds: selectedBreeds.length === 0 ? undefined : selectedBreeds,
			ageMin,
			ageMax,
			size: defaultQuery?.size || 10,
		};
		onSubmit(query)
	}, [onSubmit, selectedBreeds, ageMin, ageMax]);

	return <form onSubmit={onSubmitCallback}>
		<BreedsFilter breeds={breeds as string[]} selectedBreeds={selectedBreeds}
					  setSelectedBreeds={setSelectedBreeds}/>
		<AgeSlider onAgeChange={(min, max) => {
			setAgeMin(min);
			setAgeMax(max);
		}}/>
		<Button style={{width: '100%'}} variant="outlined" type="submit">Search</Button>
	</form>

}
