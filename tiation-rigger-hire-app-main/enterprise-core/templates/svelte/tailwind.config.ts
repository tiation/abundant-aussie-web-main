import { join } from 'path'
import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin'

export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	theme: {
		extend: {
			colors: {
				// Tiation brand colors
				'tiation-cyan': '#00FFFF',
				'tiation-magenta': '#FF00FF',
				'tiation-dark': '#0A0A0A',
				'tiation-gray': '#1A1A1A',
				// Gradient variants
				'neon-cyan': {
					50: '#E6FFFF',
					100: '#B3FFFF',
					200: '#80FFFF',
					300: '#4DFFFF',
					400: '#1AFFFF',
					500: '#00FFFF',
					600: '#00E6E6',
					700: '#00CCCC',
					800: '#00B3B3',
					900: '#009999',
				},
				'neon-magenta': {
					50: '#FFE6FF',
					100: '#FFB3FF',
					200: '#FF80FF',
					300: '#FF4DFF',
					400: '#FF1AFF',
					500: '#FF00FF',
					600: '#E600E6',
					700: '#CC00CC',
					800: '#B300B3',
					900: '#990099',
				},
			},
			fontFamily: {
				'tiation': ['Quicksand', 'system-ui', 'sans-serif'],
				'display': ['Space Grotesk', 'system-ui', 'sans-serif'],
			},
			boxShadow: {
				'neon-cyan': '0 0 5px #00FFFF, 0 0 10px #00FFFF, 0 0 15px #00FFFF',
				'neon-magenta': '0 0 5px #FF00FF, 0 0 10px #FF00FF, 0 0 15px #FF00FF',
				'neon-gradient': '0 0 5px #00FFFF, 0 0 10px #FF00FF, 0 0 15px #00FFFF',
			},
			animation: {
				'pulse-neon': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'glow': 'glow 2s ease-in-out infinite alternate',
			},
			keyframes: {
				glow: {
					from: { boxShadow: '0 0 5px #00FFFF, 0 0 10px #00FFFF, 0 0 15px #00FFFF' },
					to: { boxShadow: '0 0 10px #FF00FF, 0 0 20px #FF00FF, 0 0 30px #FF00FF' },
				},
			},
		},
	},
	plugins: [
		forms,
		typography,
		skeleton({
			themes: {
				preset: [
					{
						name: 'skeleton',
						enhancements: true,
					},
					{
						name: 'wintry',
						enhancements: true,
					},
					{
						name: 'modern',
						enhancements: true,
					},
					{
						name: 'hamlindigo',
						enhancements: true,
					},
					{
						name: 'rocket',
						enhancements: true,
					},
					{
						name: 'sahara',
						enhancements: true,
					},
					{
						name: 'gold-nouveau',
						enhancements: true,
					},
					{
						name: 'vintage',
						enhancements: true,
					},
					{
						name: 'seafoam',
						enhancements: true,
					},
					{
						name: 'crimson',
						enhancements: true,
					},
				],
			},
		}),
	],
} satisfies Config;
