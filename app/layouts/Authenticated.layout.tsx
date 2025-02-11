import {AuthService} from '~/services/Auth.service';
import {useNavigate, Outlet} from 'react-router';
import React, {useCallback, useEffect, ChangeEvent} from 'react';
import {container} from 'tsyringe';
import {AppBar, Toolbar, Button, Container, Switch, Tooltip} from '@mui/material';
import {HttpService} from '~/services/Http.service';
import {TooltipContext} from '~/contexts/Tooltip.context';

const authService = container.resolve(AuthService);
const httpService = container.resolve(HttpService);

export default function AuthenticatedLayout() {
	const [tooltipsEnabled, setTooltipsEnabled] = React.useState(true);
	const navigate = useNavigate();

	const handleDeveloperTooltipsToggle = useCallback((evt: ChangeEvent, value: boolean) => {
		setTooltipsEnabled(value);
	}, []);

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
		<TooltipContext value={{enabled: tooltipsEnabled}}>
			<AppBar position="sticky">
				<Toolbar >
					<Button color="inherit" onClick={handleLogout}>Logout</Button>
					<span style={{flexGrow: 1}}></span>
					<span>Developer Tooltips? &nbsp;</span>
					<Switch sx={{backgroundColor: 'background.paper', borderRadius: 3}} checked={tooltipsEnabled} value={tooltipsEnabled} onChange={handleDeveloperTooltipsToggle}/>
				</Toolbar>
			</AppBar>

			<Container className="cody" sx={{flex: 1, minHeight: 'calc(100vh - 64px)'}}>
				<Outlet/>
			</Container>
		</TooltipContext>
	</>;
}
