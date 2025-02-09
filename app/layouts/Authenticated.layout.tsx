import {AuthService} from '~/services/Auth.service';
import {useNavigate, Outlet} from 'react-router';
import React, {useCallback, useEffect} from 'react';
import {container} from 'tsyringe';
import {AppBar, Box, Toolbar, Button, Container} from '@mui/material';
import {HttpService} from '~/services/Http.service';
import Grid from '@mui/material/Grid2';

const authService = container.resolve(AuthService);
const httpService = container.resolve(HttpService);

export default function AuthenticatedLayout() {
	const navigate = useNavigate();

	useEffect(() => {
		if (!authService.isAuthenticated()) navigate('/login');

		// Handle de-authenticating from time-out
		httpService.setGlobalErrorHandler((err) => {
			if (err.response.status === 401) {
				navigate('/login');
			}
		});
	}, []);

	const handleLogout = useCallback(async () => {
		await authService.logout();
		navigate('/login');
	}, []);

	return <>
		<AppBar position="sticky">
			<Toolbar>
				<Toolbar>
					<Button color="inherit" onClick={handleLogout}>Logout</Button>
				</Toolbar>
			</Toolbar>
		</AppBar>

		<Container className='cody' sx={{ flex: 1, minHeight: "calc(100vh - 64px)" }}>
			<Outlet/>
		</Container>
	</>;
}
