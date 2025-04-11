
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
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom theme colors
				teal: {
					50: '#e6f7f6',
					100: '#ccefe9',
					200: '#99dfd3',
					300: '#66cfbe',
					400: '#4ECDC4', // Primary teal
					500: '#33bfb4',
					600: '#269990',
					700: '#1c736d',
					800: '#134c49',
					900: '#092625'
				},
				lavender: {
					50: '#f5f3f7',
					100: '#ebe7ef',
					200: '#d6cfdf',
					300: '#c2b7d0',
					400: '#9E8FB2', // Secondary lavender
					500: '#8b7ba3',
					600: '#766690',
					700: '#5c4e72',
					800: '#3d344c',
					900: '#1e1a26'
				},
				peach: {
					50: '#fff1ef',
					100: '#ffe4df',
					200: '#ffc9bf',
					300: '#ffaea0',
					400: '#FF9A8B', // Accent peach
					500: '#ff7d6a',
					600: '#ff5a42',
					700: '#ff3719',
					800: '#e01e00',
					900: '#b81800'
				},
				slate: {
					50: '#edf0f2',
					100: '#dbe1e6',
					200: '#b7c3cd',
					300: '#93a6b3',
					400: '#6f889a',
					500: '#536f85',
					600: '#405969',
					700: '#2F4858', // Text slate
					800: '#1f2f3a',
					900: '#10171d'
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
