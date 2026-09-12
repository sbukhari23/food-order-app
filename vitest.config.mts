import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./vitest.setup.ts'],
		exclude: ['node_modules/**', 'e2e/**'],
	},
	resolve: {
		alias: {
			'@': path.resolve(process.cwd()),
		},
	},
});
