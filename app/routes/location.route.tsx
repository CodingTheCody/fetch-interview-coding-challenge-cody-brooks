import {useState, useEffect, useDeferredValue, useMemo, useCallback, SyntheticEvent} from 'react';
import {Autocomplete, TextField, CircularProgress, Box, Button, MenuItem} from '@mui/material';
import {ILocationSearchBody} from '~/interfaces/ILocationSearchBody.interface';
import {container} from 'tsyringe';
import {ILocation} from '~/interfaces/ILocation.interface';
import {LocationsService} from '~/services/Locations.service';
import {Link, useNavigate} from 'react-router';
import {FetchLogoSvg} from '~/components/FetchLogoSvg.component';

const DEBOUNCE_DELAY_IN_MILLISECONDS = 500; // 500ms delay for API calls
const STATE_ABBREVIATIONS = new Set(['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY']);

export default function LocationSearch() {
	const navigate = useNavigate();
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<ILocation[]>([]);
	const [loading, setLoading] = useState(false);

	const deferredQuery = useDeferredValue(query.trim());

	// Resolve service once
	const locationsService = useMemo(() => container.resolve(LocationsService), []);

	const getLocations = useCallback(async () => {
		if (!deferredQuery) return;
		setLoading(true);

		try {
			let requestBody: ILocationSearchBody;

			if (STATE_ABBREVIATIONS.has(deferredQuery.toUpperCase())) {
				requestBody = {states: [deferredQuery.toUpperCase()]};
			} else {
				requestBody = {city: deferredQuery};
			}

			const response = await locationsService.searchLocations(requestBody);
			setResults(response.results);
		} catch (error) {
			console.error('Failed to fetch locations:', error);
		} finally {
			setLoading(false);
		}
	}, [deferredQuery, locationsService]);

	useEffect(() => {
		const handler = setTimeout(() => {
			getLocations();
		}, DEBOUNCE_DELAY_IN_MILLISECONDS);

		return () => clearTimeout(handler);
	}, [getLocations]);

	const handleLocationSelect = useCallback((event: SyntheticEvent, value: string | null) => {
		if (!value) return;
		const zipCode = value.split('(')[1].split(')')[0];
		navigate('search', {state: {zipCode}});
	}, []);

	return (
		<Box sx={{backgroundColor: 'background.paper'}} padding={5}>
			<br/>
			<FetchLogoSvg/>
			<br/>
			<p>Please enter a city or state abbreviation to search for locations:</p>
			<br/>
			<Link to={'/search'}>
				<Button variant="outlined" size="large">See all</Button>
			</Link>
			<Autocomplete
				freeSolo
				options={results.map(location => `${location.city}, ${location.state} (${location.zip_code})`)}
				loading={loading}
				onChange={handleLocationSelect}
				onInputChange={(event, newValue) => setQuery(newValue)}
				renderOption={(props, option) => (<MenuItem {...props}>{option}</MenuItem>)}
				renderInput={(params) => (
					<TextField
						{...params}
						label="Enter City or State"
						fullWidth
						margin="normal"
						slotProps={{
							input: {
								...params.InputProps,
								endAdornment: (
									<>
										{loading ? <CircularProgress size={20}/> : null}
										{params.InputProps.endAdornment}
									</>
								),
							},
						}}
					/>
				)}
			/>
		</Box>
	);
}
