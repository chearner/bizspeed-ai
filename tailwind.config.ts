import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import defaultTheme from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	daisyui: {
		themes: ['business', 'light', 'dark']
	},
	theme: {
		extend: {
			fontFamily: {
				sans: ['Helvetica-Roman', ...defaultTheme.fontFamily.sans]
			}
		},
		colors: {
			bizblue: {
				50: '#E6E9EF',
				100: '#CDD4DF',
				200: '#9BA8C0',
				300: '#697DA0',
				400: '#495974',
				500: '#293241',
				600: '#222935',
				700: '#181D26',
				800: '#101319',
				900: '#080A0D',
				950: '#040506'
			},
			bizorange: {
				50: '#FFECEB',
				100: '#FFD9D6',
				200: '#FFAEA9',
				300: '#FE8880',
				400: '#FE5E52',
				500: '#FE382A',
				600: '#EA1101',
				700: '#B20D01',
				800: '#750801',
				900: '#3D0400',
				950: '#1E0200'
			}
		}
	},
	plugins: [daisyui]
} satisfies Config;
