import 'reflect-metadata';
import {type RouteConfig, index, route, layout} from '@react-router/dev/routes';

export default [
	layout("layouts/Authenticated.layout.tsx", [
		index("routes/location.route.tsx"),
		route("search", "routes/search.route.tsx"),
	]),
	route("/login", "routes/login.route.tsx")
] satisfies RouteConfig;
