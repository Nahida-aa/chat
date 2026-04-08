import { cloudflare } from '@cloudflare/vite-plugin';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const config = defineConfig({
	plugins: [
		cloudflare({ viteEnvironment: { name: 'ssr' } }),
		devtools(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/paraglide',
			strategy: ['cookie', 'preferredLanguage', 'baseLocale'],
			cookieName: 'PARAGLIDE_LOCALE',
			routeStrategies: [{ match: '/api/:path(.*)?', exclude: true }],
		}),
		tailwindcss(),
		tanstackStart(),
		react(),
		babel({
			presets: [reactCompilerPreset()],
		}),
	],
	ssr: {
		noExternal: ['@convex-dev/better-auth'],
	},
})

export default config;
