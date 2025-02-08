import {reactRouter} from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import {defineConfig} from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import EnvironmentPlugin from 'vite-plugin-environment';
import mkcert from 'vite-plugin-mkcert';
// import eslint from 'vite-plugin-eslint';

export default defineConfig({
	server: {
		proxy: {},
	},
	plugins: [
		mkcert(),
		tailwindcss(),
		reactRouter(),
		tsconfigPaths(),
		EnvironmentPlugin([
			'VITE_API_BASE_URI'
		])],
});
