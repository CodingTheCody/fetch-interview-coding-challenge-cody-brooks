import type {Route} from './+types/search.route';
import {
	Grid2 as Grid,
	Container,
	Pagination,
	Typography,
	Button,
	Paper,
	Select,
	MenuItem,
	SelectChangeEvent, Box,
	Badge
} from '@mui/material';
import React, {useState, useEffect, useCallback} from 'react';
import {styled} from '@mui/system';
import {container} from 'tsyringe';
import {DogsService} from '~/services/Dogs.service';
import {IDog} from '~/interfaces/IDog.interface';
import {DogCard} from '~/components/DogCard.component';
import {ISearchDogsQuery} from '~/interfaces/ISearchDogsQuery.interface';
import {DogSearchForm} from '~/components/DogSearchForm.component';
import {useLocation, Link} from 'react-router';
import {SearchRouteState} from '~/routes/search.route.state';
import {DogMatchContext} from '~/contexts/DogMatch.context';
import {MatchedDogModal} from '~/components/MatchedDogModal.component';

export function meta({}: Route.MetaArgs) {
	return [
		{title: 'Dog Search'},
	];
}

const Item = styled(Paper)(({theme}) => ({
	backgroundColor: '#fff',
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
	...theme.applyStyles('dark', {
		backgroundColor: '#1A2027',
	}),
}));

const DEFAULT_QUERY: ISearchDogsQuery = {
	size: 20,
	from: 0,
	ageMin: 0,
	ageMax: 30,
};

export default function SearchRoute() {
	const location = useLocation();
	const [matchedDogId, setMatchedDogId] = useState<string | undefined>(undefined);
	const [matchedDogIds, setMatchedDogIds] = useState<Set<string>>(new Set<string>());
	const [resultsPerPage, setResultsPerPage] = useState(DEFAULT_QUERY.size as number);
	const [lastQuery, setLastQuery] = useState(DEFAULT_QUERY);
	const [currentPage, setCurrentPage] = useState(1);
	const [dogResultIds, setDogResultIds] = useState<string[]>([]);
	const [totalDogResults, setTotalDogResults] = useState(0);
	const [dogResults, setDogResults] = useState<IDog[] | undefined>(undefined);
	const dogsService = container.resolve(DogsService);

	const addDogIdToMatched = useCallback((dogId: string) => {
		const newSet = new Set<string>(matchedDogIds);
		newSet.add(dogId);
		setMatchedDogIds(newSet);
	}, [matchedDogIds]);

	const removeDogFromMatched = useCallback((dogId: string) => {
		const newSet = new Set<string>(matchedDogIds);
		newSet.delete(dogId);
		setMatchedDogIds(newSet);
	}, [matchedDogIds]);

	const searchForDogs = useCallback((query: ISearchDogsQuery) => {
		const loc: SearchRouteState | undefined = location.state;
		setDogResults(undefined); // show loader
		const queryWithPagination: ISearchDogsQuery = Object.assign({}, query, {
			from: (currentPage - 1) * resultsPerPage,
			zipCodes: loc?.zipCodes,
			size: resultsPerPage,
		} as ISearchDogsQuery);
		setLastQuery(queryWithPagination);
		dogsService.searchDogs(queryWithPagination).then((dogs) => {
			setTotalDogResults(dogs.total);
			setDogResultIds(dogs.resultIds);
		});
	}, [currentPage, resultsPerPage, location]);

	const onSearchFormSubmit = useCallback((query: ISearchDogsQuery) => {
		setCurrentPage(1);
		searchForDogs(query);
	}, [currentPage, lastQuery]);

	const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
		setCurrentPage(value);
	}, [lastQuery]);

	const handleResultsPerPageChange = useCallback((event: SelectChangeEvent<number>) => {
		setResultsPerPage(event.target.value as number);
		setCurrentPage(1);
	}, []);

	const findMyMatch = useCallback(async () => {
		const response = await dogsService.matchWithDog(Array.from(matchedDogIds));
		setMatchedDogId(response.match);
	}, [dogsService]);

	// get dog infos by dog ids
	useEffect(() => {
		if (dogResultIds.length === 0) return setDogResults([]);
		setDogResults(undefined);
		dogsService.getDogsByDogIds(dogResultIds).then(dogs => {
			setDogResults(dogs);
		});
	}, [dogResultIds]);

	// initial default search
	useEffect(() => {
		searchForDogs(lastQuery);
	}, [currentPage, resultsPerPage]);

	return <>
		<DogMatchContext value={{dogIds: matchedDogIds, addDogId: addDogIdToMatched, removeDogId: removeDogFromMatched}}>
			<MatchedDogModal dogId={matchedDogId} onClose={() => {
				setMatchedDogId(undefined);
				setMatchedDogIds(new Set<string>());
			}}/>
			<Container className="home-route">
				<Grid container spacing={2}>
					<Grid size={{xs: 12, md: 4}}>
						<Item style={{position: 'sticky'}} sx={{position: 'sticky', top: 64}}>
							<DogSearchForm defaultQuery={DEFAULT_QUERY} onSubmit={onSearchFormSubmit}/>
							<Item style={{marginTop: 15}} sx={{}}>
								<Button variant="outlined" disabled={matchedDogIds.size === 0} onClick={findMyMatch}>Find
									My Match &nbsp;&nbsp;&nbsp; <Badge badgeContent={matchedDogIds.size}
																	   color="primary">
									</Badge></Button>
							</Item>
						</Item>
					</Grid>
					<Grid size={{xs: 12, md: 8}}>
						<Item className="home-route-scrollable">
							<Link to="/">
								<Button variant="outlined" size="large" style={{marginBottom: '0.5em'}}>
									To location search
								</Button>
							</Link>
							{dogResults === undefined &&
                                <img alt="loading" src="loading-dog.gif" style={{width: '100%'}}/>}
							{dogResults && dogResults.length === 0 &&
                                <>
                                    <img src="no-dogs-found.gif" alt="no-dogs-found" style={{width: '100%'}}/>
                                    <Typography variant={'h5'}>No dogs found</Typography>
                                </>
							}
							{dogResults && <Grid container spacing={2}>
								{dogResults.map((dog) => (
									<Grid key={dog.id} size={{xs: 12, sm: 6, md: 4}}>
										<DogCard dog={dog}/>

										{/*This should never show*/}
										{location.state?.zipCodes.indexOf(dog.zip_code) === -1 &&
                                            <Typography variant="caption" color="error">This dog is not in the search
                                                area</Typography>}
									</Grid>
								))}
                            </Grid>}
						</Item>
					</Grid>
				</Grid>
			</Container>
			<Container sx={{
				background: 'white',
				borderRadius: '5px 5px 0 0',
				position: 'sticky',
				bottom: 0,
				width: '100%',
				py: 1
			}}>
				<Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<Pagination
						style={{margin: 'auto'}}
						page={currentPage}
						count={Math.ceil(totalDogResults / resultsPerPage)}
						onChange={handlePageChange}
						aria-label="Pagination"
					/>
					<Select
						label="Results per page"
						aria-label="Results per page"
						size="small"
						value={resultsPerPage}
						onChange={handleResultsPerPageChange}
						style={{marginLeft: '0.5em', width: 100}}
					>
						<MenuItem value={10} role="option" aria-selected={resultsPerPage === 10}>10</MenuItem>
						<MenuItem value={20} role="option" aria-selected={resultsPerPage === 20}>20</MenuItem>
						<MenuItem value={50} role="option" aria-selected={resultsPerPage === 50}>50</MenuItem>
						<MenuItem value={100} role="option" aria-selected={resultsPerPage === 100}>100</MenuItem>
					</Select>
				</Box>
			</Container>
		</DogMatchContext>
	</>
}
