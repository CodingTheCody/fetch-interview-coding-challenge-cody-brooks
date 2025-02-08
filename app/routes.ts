import 'reflect-metadata';
import {type RouteConfig, index, route, layout} from '@react-router/dev/routes';

export default [
	layout("layouts/Authenticated.layout.tsx", [
		index("routes/home.route.tsx"),
	]),
	route("/login", "routes/login.route.tsx")
] satisfies RouteConfig;
