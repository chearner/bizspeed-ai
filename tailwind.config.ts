import type { Config } from 'tailwindcss';
import plugin from 'flowbite/plugin';

export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	plugins: [plugin],
	darkMode: 'class',
	theme: {
		extend: {
			animation: {
				fadeIn: 'fadeIn .5s ease-in-out',
				fadeOut: 'fadeOut .5s ease-in-out'
			},
			keyframes: {
				fadeIn: {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				fadeOut: {
					from: { opacity: '1' },
					to: { opacity: '0' }
				}
			},
			zIndex: {
				'100': '100'
			},
			colors: {
				primary: {
					50: '#FFF5F2',
					100: '#FFF1EE',
					200: '#FFE4DE',
					300: '#FFD5CC',
					400: '#FFBCAD',
					500: '#FE795D',
					600: '#EF562F',
					700: '#EB4F27',
					800: '#CC4522',
					900: '#A5371B'
				},
				logo: {
					50: '#6B7280',
					100: '#6B7280',
					200: '#6B7280',
					300: '#6B7280',
					400: '#6B7280',
					500: '#6B7280',
					600: '#6B7280',
					700: '#6B7280',
					800: '#6B7280',
					900: '#6B7280'
				}
			}
		}
	}
} satisfies Config;
