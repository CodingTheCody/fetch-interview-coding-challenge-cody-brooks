import 'reflect-metadata';

if (!Reflect) {
	throw new Error('reflect-metadata is required for tsyringe');
}

import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from 'react-router';

import type {Route} from './+types/root';
import './app.css';
import {ThemeProvider} from '@mui/material';
import theme from '~/theme';
import {container} from 'tsyringe';
import {HttpService} from '~/services/Http.service';

export const links: Route.LinksFunction = () => [
	{rel: 'preconnect', href: 'https://fonts.googleapis.com'},
	{
		rel: 'preconnect',
		href: 'https://fonts.gstatic.com',
		crossOrigin: 'anonymous',
	},
	{
		rel: 'stylesheet',
		href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
	},
];

export function Layout({children}: { children: React.ReactNode }) {
	return (
		<html lang="en">
		<head>
			<link href="https://api.mapbox.com/mapbox-gl-js/v3.9.4/mapbox-gl.css" rel="stylesheet"/>
			<meta charSet="utf-8"/>
			<meta name="viewport" content="width=device-width, initial-scale=1"/>
			<link rel="preconnect" href="https://fonts.googleapis.com"/>
			<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
			<link
				rel="stylesheet"
				href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
			/>
			<Meta/>
			<Links/>
		</head>
		<body>
		<ThemeProvider theme={theme}>
			{children}
		</ThemeProvider>
		<ScrollRestoration/>
		<Scripts/>
		</body>
		</html>
	);
}

export default function App() {
	return <Outlet/>;
}

export function ErrorBoundary({error}: Route.ErrorBoundaryProps) {
	let message = 'Oops!';
	let details = 'An unexpected error occurred.';
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? '404' : 'Error';
		details =
			error.status === 404
				? 'The requested page could not be found.'
				: error.statusText || details;
	} else if (process.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
			)}
		</main>
	);
}

const httpService = container.resolve(HttpService);
httpService.setDefaultHeaders({
	'content-type': 'application/json',
	'accept': 'application/json',
});
