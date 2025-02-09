import {createTheme, colors} from '@mui/material';

const theme = createTheme({
	cssVariables: true,
	palette: {
		primary: {
			main: '#556cd6',
		},
		secondary: {
			main: '#19857b',
		},
		error: {
			main: colors.red.A400,
		},
	},
});

export default theme;
