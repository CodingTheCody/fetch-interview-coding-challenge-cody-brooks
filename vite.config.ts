import {reactRouter} from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import {defineConfig} from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import EnvironmentPlugin from 'vite-plugin-environment';
import mkcert from 'vite-plugin-mkcert';
// @ts-ignore (not sure why this throws an error, it works perfectly fine, hopefully it isn't an issue for someone else)
import eslintPlugin from 'vite-plugin-eslint';

export default defineConfig({
	server: {
		port: 5174, // Due to a bug in the dev server, we need to set a port. It keeps conflicting with another personal project
		proxy: {}, // enable https on localhost
	},
	plugins: [
		eslintPlugin(),
		process.env.NODE_ENV !== 'production' && mkcert(),
		tailwindcss(),
		reactRouter(),
		tsconfigPaths(),
		EnvironmentPlugin([
			'VITE_API_BASE_URI',
			'VITE_MAP_BOX_API_KEY',
		])],
});
