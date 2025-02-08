import {AuthService} from '~/services/Auth.service';
import {useNavigate, Outlet} from 'react-router';
import React, {useCallback, useEffect} from 'react';
import {container} from 'tsyringe';
import {AppBar, Box, Toolbar, Button} from '@mui/material';

const authService = container.resolve(AuthService);

export default function AuthenticatedLayout() {
	const navigate = useNavigate();

	useEffect(() => {
		if (!authService.isAuthenticated()) navigate('/login');
	}, []);

	const handleLogout = useCallback(async () => {
		await authService.logout();
		navigate('/login');
	}, []);

	return <>
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<Button color="inherit" onClick={handleLogout}>Logout</Button>
				</Toolbar>
			</AppBar>
		</Box>
		<Outlet/>
	</>;
}
