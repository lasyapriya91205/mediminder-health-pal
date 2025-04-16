import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#005a8d', // Navy Blue
					light: '#0073b3',
					dark: '#003366',
					foreground: '#ffffff'
				},
				secondary: {
					DEFAULT: '#333333', // Charcoal Gray
					light: '#4d4d4d',
					dark: '#1a1a1a',
					foreground: '#ffffff'
				},
				accent: {
					DEFAULT: '#87CEFA', // Sky Blue
					light: '#b3e0ff',
					dark: '#5D9B9B',
					foreground: '#333333'
				},
				highlight: {
					DEFAULT: '#F7F7F7', // Soft White
					foreground: '#333333'
				},
				teal: {
					50: '#e6f3f7',
					100: '#cce7ef',
					200: '#99cfdf',
					300: '#66b7cf',
					400: '#005a8d', // Primary navy blue
					500: '#004d78',
					600: '#003366', // Darker navy blue
					700: '#002952',
					800: '#001f3d',
					900: '#001229'
				},
				lavender: {
					50: '#f2f2f2',
					100: '#e6e6e6',
					200: '#cccccc',
					300: '#b3b3b3',
					400: '#333333', // Secondary charcoal gray
					500: '#292929',
					600: '#1f1f1f',
					700: '#141414',
					800: '#0a0a0a',
					900: '#000000'
				},
				peach: {
					50: '#f0f9ff',
					100: '#e1f3fe',
					200: '#b3e0ff',
					300: '#87CEFA', // Accent sky blue
					400: '#5D9B9B', // Darker accent
					500: '#4d8282',
					600: '#3d6868',
					700: '#2e4f4f',
					800: '#1e3535',
					900: '#0f1a1a'
				},
				slate: {
					50: '#F7F7F7', // Highlight soft white
					100: '#f0f0f0',
					200: '#e6e6e6',
					300: '#d9d9d9',
					400: '#bfbfbf',
					500: '#a6a6a6',
					600: '#8c8c8c',
					700: '#333333', // Charcoal gray
					800: '#1a1a1a',
					900: '#0d0d0d'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-soft': {
					'0%, 100%': { 
						opacity: '1',
						transform: 'scale(1)'
					},
					'50%': { 
						opacity: '0.9',
						transform: 'scale(1.03)'
					}
				},
				'fade-in': {
					'0%': { 
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': { 
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-soft': 'pulse-soft 3s infinite ease-in-out',
				'fade-in': 'fade-in 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
