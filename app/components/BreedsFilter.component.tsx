import {Autocomplete, TextField, Grid2, MenuItem} from '@mui/material';
import React, {useState} from 'react';
import {TriggerableTooltip} from '~/components/TriggerableTooltip.component';

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
			<TriggerableTooltip
				title="I was not able to have it search for multiple breeds, but I was able to have it search for one breed at a time. This is an issue with the API.">
				<Autocomplete
					aria-label="Breeds"
					multiple
					value={selectedBreeds}
					options={breeds as string[]}
					clearOnBlur={false}
					disableCloseOnSelect={false}
					inputValue={breedsInputValue}
					onInputChange={(event, newInputValue) => {
						setBreedsInputValue(newInputValue);
					}}
					onChange={(event, values) => {
						setSelectedBreeds(values);
					}}
					renderInput={(params) => (
						<TextField slotProps={{ input: { 'aria-label': 'Breeds input' } }} {...params} label="Breeds" variant="outlined"/>
					)}
					renderOption={(props, option, { selected }) => (
						<MenuItem
							{...props}
							key={option}
							onClick={(event) => handleSelect(event as never, option)}
							role="option"
							aria-selected={selected}
						>
							{option}
						</MenuItem>
					)}
				/>
			</TriggerableTooltip>
		</Grid2>
	);
}
