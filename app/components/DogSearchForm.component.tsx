import React, {FormEvent, useEffect, useState, useCallback} from 'react';
import {BreedsFilter} from '~/components/BreedsFilter.component';
import {Button, Select, MenuItem, Typography, SelectChangeEvent} from '@mui/material';
import {container} from 'tsyringe';
import {DogsService} from '~/services/Dogs.service';
import {ISearchDogsQuery} from '~/interfaces/ISearchDogsQuery.interface';
import {AgeSlider} from '~/components/AgeSlider.component';
import {ISortable} from '~/interfaces/ISortable.interface';
import {DogSortableKeys} from '~/types/DogSortableKeys.type';

const dogsService = container.resolve(DogsService);

const SORTABLES: {
	title: string;
	sort: ISortable<DogSortableKeys> | undefined
}[] = [
	{
		title: 'None',
		sort: undefined,
	},
	{
		title: 'Youngest First',
		sort: {sort: 'age', order: 'asc'}
	},
	{
		title: 'Oldest First',
		sort: {sort: 'age', order: 'desc'}
	},
];

export function DogSearchForm({onSubmit, defaultQuery}: {
	onSubmit: (query: ISearchDogsQuery) => void,
	defaultQuery?: ISearchDogsQuery,
}) {
	const [breeds, setBreeds] = useState<string[] | undefined>(defaultQuery?.breeds);
	const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
	const [ageMin, setAgeMin] = useState(defaultQuery?.ageMin || 0);
	const [ageMax, setAgeMax] = useState(defaultQuery?.ageMax || 0);
	const [sortTitle, setSortTitle] = useState<string>('None');

	// get breeds (1 time call)
	useEffect(() => {
		if (breeds && breeds.length > 0) return;
		dogsService.getBreeds().then(breeds => {
			setBreeds(breeds);
		});
	}, []);

	const handleSortChange = useCallback((event: SelectChangeEvent) => {
		setSortTitle(event.target.value)
	}, []);

	const onSubmitCallback = useCallback((evt: FormEvent) => {
		evt.preventDefault();
		const sort = SORTABLES.find(s => s.title === sortTitle)?.sort;
		const query: ISearchDogsQuery = {
			breeds: selectedBreeds.length === 0 ? undefined : selectedBreeds,
			ageMin,
			ageMax,
			size: defaultQuery?.size || 10,
			sort,
		};
		onSubmit(query)
	}, [onSubmit, selectedBreeds, ageMin, ageMax, sortTitle]);

	const handleReset = useCallback(() => {
		if (!defaultQuery) return;
		setBreeds(defaultQuery.breeds);
		setSortTitle('None');
		setAgeMin(defaultQuery.ageMin || 0);
		setAgeMax(defaultQuery.ageMax || 25);
	}, [defaultQuery]);

	return <form onSubmit={onSubmitCallback}>
		<Typography variant="h6" gutterBottom>
			Sort
		</Typography>
		<Select variant="outlined" style={{width: '100%', marginBottom: 15}} onChange={handleSortChange}
				value={sortTitle}>
			{SORTABLES.map((s, index) => <MenuItem key={index} value={s.title} title={s.title}>{s.title}</MenuItem>)}
		</Select>

		<BreedsFilter breeds={breeds as string[]} selectedBreeds={selectedBreeds}
					  setSelectedBreeds={setSelectedBreeds}/>
		<AgeSlider onAgeChange={(min, max) => {
			setAgeMin(min);
			setAgeMax(max);
		}}/>
		<Button style={{width: '100%', marginBottom: 15}} variant="outlined" type="submit">Search</Button>
		<Button style={{width: '100%'}} variant="outlined" onClick={handleReset}>Reset</Button>
	</form>

}
