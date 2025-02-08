import {Autocomplete, TextField, Grid2, MenuItem} from '@mui/material';
import React, {useState} from 'react';

export function BreedsFilter({setSelectedBreeds, selectedBreeds, breeds}: {
	setSelectedBreeds: (breeds: string[]) => void,
	selectedBreeds: string[],
	breeds: string[],
}) {
	const [breedsInputValue, setBreedsInputValue] = useState('');

	const handleSelect = (event: never, breed: string) => {
		if (!selectedBreeds.includes(breed)) {
			setSelectedBreeds([...selectedBreeds, breed]);
		}
	};

	return (
		<Grid2>
			<Autocomplete
				freeSolo
				multiple
				value={selectedBreeds}
				options={breeds as string[]}
				inputValue={breedsInputValue}
				onInputChange={(event, newInputValue) => {
					setBreedsInputValue(newInputValue);
				}}
				onChange={(event, values) => {
					setSelectedBreeds(values);
				}}
				renderInput={(params) => (
					<TextField {...params} label="Breeds" variant="outlined"/>
				)}
				renderOption={(props, option) => (
					<MenuItem
						{...props}
						key={option}
						onClick={(event) => handleSelect(event as never, option)}
					>
						{option}
					</MenuItem>
				)}
			/>
		</Grid2>
	);
}
