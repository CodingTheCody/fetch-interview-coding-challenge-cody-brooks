import type {Route} from './+types/home.route';
import {Container, Pagination} from '@mui/material';
import React, {useState, useEffect, useCallback} from 'react';
import {styled} from '@mui/system';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import {container} from 'tsyringe';
import {DogsService} from '~/services/Dogs.service';
import {IDog} from '~/interfaces/IDog.interface';
import {DogCard} from '~/components/DogCard.component';
import {ISearchDogsQuery} from '~/interfaces/ISearchDogsQuery.interface';
import './home.route.scss';
import {DogSearchForm} from '~/components/DogSearchForm.component';

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
	size: 10,
	from: 0,
	ageMin: 0,
	ageMax: 30,
};

export default function HomeRoute() {
	const [lastQuery, setLastQuery] = useState(DEFAULT_QUERY);
	const [currentPage, setCurrentPage] = useState(1);
	const [dogResultIds, setDogResultIds] = useState<string[]>([]);
	const [totalDogResults, setTotalDogResults] = useState(0);
	const [dogResults, setDogResults] = useState<IDog[] | undefined>(undefined);
	const dogsService = container.resolve(DogsService);

	const searchForDogs = useCallback((query: ISearchDogsQuery) => {
		setDogResults(undefined); // show loader
		const queryWithPagination: ISearchDogsQuery = Object.assign({}, query, {
			from: (currentPage - 1) * (DEFAULT_QUERY.size as number)
		} as ISearchDogsQuery);
		setLastQuery(queryWithPagination);
		dogsService.searchDogs(queryWithPagination).then((dogs) => {
			setTotalDogResults(dogs.total);
			setDogResultIds(dogs.resultIds);
		});
	}, [currentPage]);

	const onSearchFormSubmit = useCallback((query: ISearchDogsQuery) => {
		setCurrentPage(1);
		searchForDogs(query);
	}, [currentPage, lastQuery]);

	const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
		setCurrentPage(value);
	}, [lastQuery]);

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
	}, [currentPage]);

	return <Container className="home-route">
		<Grid container spacing={2} style={{position: 'relative', height: 'calc(100vh - 64px)'}}>
			<Grid size={{xs: 12, md: 4}}>
				<Item>
					<DogSearchForm onSubmit={onSearchFormSubmit}/>
				</Item>
			</Grid>
			<Grid size={{xs: 12, md: 8}}>
				<Item className="home-route-scrollable">
					{dogResults === undefined && <img alt="loading" src="loading-dog.gif" style={{
						position: 'absolute',
						left: '50%',
						top: '50%',
						transform: 'translate(-50%, -50%)'
					}}/>}
					{dogResults && <Grid container spacing={2}>
						{dogResults.map((dog) => (
							<Grid key={dog.id} size={{xs: 12, sm: 6, md: 4}}>
								<DogCard dog={dog}/>
							</Grid>
						))}
                    </Grid>}
				</Item>
			</Grid>
			<Grid size={12} style={{position: 'absolute', bottom: 0, alignItems: 'center'}}>
				<Item>
					<Pagination
						page={currentPage}
						count={Math.ceil(totalDogResults / (DEFAULT_QUERY.size as number))}
						onChange={handlePageChange}
					/>
				</Item>
			</Grid>
		</Grid>
	</Container>
}
