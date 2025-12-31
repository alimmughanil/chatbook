import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";
import badgeStyle from './resources/js/locales/badgeStyle.json'

function extractClasses(obj) {
  return Object.values(obj)
    .flatMap(str => str.split(' '))
    .filter(Boolean)
}

/** @type {import('tailwindcss').Config} */
export default {
  safelist: extractClasses(badgeStyle),
  darkMode: ["class"],
  content: [
    "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
    "./storage/framework/views/*.php",
    "./resources/views/**/*.blade.php",
    "./resources/views/*.blade.php",
    "./resources/js/**/*.jsx",
    "./resources/js/**/*.js",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Figtree',
          ...defaultTheme.fontFamily.sans
        ]
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
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
        'bg-button': 'rgba(255, 255, 255, 0.2)',
        'main-black': 'rgba(33, 37, 41, 1)',
        'tag-free': 'rgba(251, 218, 63, 1)',
        'price': 'rgba(255, 0, 0, 1)',
        'main-blue': 'rgba(33, 68, 222, 1)',
        'main-gray': 'rgba(128, 128, 128, 1)',
        'disabled': 'rgba(236, 236, 236, 1)',
        'success': 'rgba(41, 171, 108, 1)',
        'purple-light': 'rgba(249, 236, 255, 1)',
        'purple-main': 'rgba(163, 46, 213, 1)',
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
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },

  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          'primary': process.env.VITE_PRIMARY_COLOR ?? "#6017BE",
          'primary-focus': process.env.VITE_PRIMARY_FOCUS_COLOR ?? "#6017BE",
          'primary-content': 'white',
          'success': '#00A96E',
          'success-focus': '#166534',
          'secondary': '#FABC09',
          'secondary-content': 'black',
          'error': '#DC2626',
          'error-content': 'white',
          '--btn-text-case': 'normal'
        }
      }
    ]
  },

  plugins: [forms, require('daisyui'), require('tailwind-scrollbar'), require("tailwindcss-animate")]
};
