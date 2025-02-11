import React, {useState} from 'react';
import {Slider, Typography, Box} from '@mui/material';

export function AgeSlider({onAgeChange}: { onAgeChange: (minAge: number, maxAge: number) => void }) {
	const [ageRange, setAgeRange] = useState<number[]>([0, 25]);

	const handleSliderChange = (event: Event, newValue: number | number[]) => {
		setAgeRange(newValue as number[]);
		const [minAge, maxAge] = newValue as number[];
		onAgeChange(minAge, maxAge);
	};

	return (
		<Box sx={{padding: '20px'}}>
			<Typography variant="h6" gutterBottom>
				Age Range
			</Typography>
			<Slider
				aria-label={'Age range'}
				onChange={handleSliderChange}
				value={ageRange}
				valueLabelFormat={(value) => `${value} years`}
				valueLabelDisplay="auto"
				step={1}
				max={25}
				min={0}
			/>
			<Box display="flex" justifyContent="space-between">
				<Typography variant="body2">Min: {ageRange[0]} years</Typography>
				<Typography variant="body2">Max: {ageRange[1]} years</Typography>
			</Box>
		</Box>
	);
};
