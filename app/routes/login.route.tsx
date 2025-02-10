import {Container, Box, Typography, TextField, Button, Alert} from '@mui/material';
import {useState, useCallback, useEffect} from 'react';
import {FetchLogoSvg} from '~/components/FetchLogoSvg.component';
import {useNavigate} from 'react-router';
import {AuthService} from '~/services/Auth.service';
import {container} from 'tsyringe';

export default function LoginRoute() {
	const [name, setName] = useState('test');
	const [email, setEmail] = useState('test@email.com');
	const [error, setError] = useState<string | undefined>(undefined);

	const navigate = useNavigate();

	const isValidEmail = (email: string) =>
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	const isValidForm = name.length >= 3 && isValidEmail(email);

	const onSubmitCallback = useCallback(async () => {
		setError(undefined);
		const authService = container.resolve(AuthService);
		try {
			await authService.login({name, email});
			navigate('/');
		} catch (ex) {
			console.error(ex);
			setError('There was an error logging in');
		}
	}, [navigate, name, email]);

	useEffect(() => {
		// Clear the error when the user starts typing
		if (error) setError(undefined);
	}, [name, email]);

	return (
		<Container
			maxWidth="sm"
			sx={{
				display: 'flex',
				justifyContent: 'center',
				flexDirection: 'column',
				alignItems: 'center',
				textAlign: 'center',
				height: '100vh',
			}}
		>
			<Box
				sx={{
					p: 4,
					boxShadow: 3,
					borderRadius: 2,
					textAlign: 'center',
					backgroundColor: 'background.paper',
				}}
			>
				<Container sx={{justifyContent: 'center', display: 'flex'}}>
					<FetchLogoSvg/>
				</Container>
				<Typography variant="h4" mb={2}>
					Welcome to Cody's Fetch Coding Challenge
				</Typography>
				<Typography variant="h5" mb={2}>Login</Typography>
				<TextField
					fullWidth
					label="Name"
					margin="normal"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<TextField
					fullWidth
					label="Email"
					type="email"
					margin="normal"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<Button
					fullWidth
					variant="contained"
					color="primary"
					sx={{mt: 2}}
					onClick={onSubmitCallback}
					disabled={!isValidForm}
				>
					Submit
				</Button>
				<Alert severity='error' hidden={error === undefined}>
					{error}
				</Alert>
			</Box>
		</Container>
	);
}
