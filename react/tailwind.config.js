/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: '#FF8201',
        'primary-light': '#F5E6DD',
        'primary-dark': '#C45100',
        'primary-bg': '#fff7ed',
        'primary-hover': 'rgba(232, 106, 16, 0.1)',

        // Tier Colors
        'tier-green': '#76b900',
        'tier-green-light': '#8ed600',
        'tier-green-dark': '#5c8f00',

        // Text Colors
        'text-primary': '#2d3748',
        'text-secondary': '#718096',
        'text-tertiary': '#a0aec0',

        // Background Colors
        'bg-white': '#ffffff',
        'bg-gray-50': '#f7fafc',
        'bg-gray-100': '#edf2f7',
        'bg-gray-200': '#e2e8f0',

        // Border Colors
        'border-color': '#e2e8f0',
        'border-color-dark': '#cbd5e0',

        // Status Colors
        success: '#48bb78',
        error: '#e53e3e',
        warning: '#ed8936',
        info: '#4299e1',

        // Member Tier Colors
        member: '#F86303',
        elite: '#C14C00',
        vip: '#666',
        bronze: '#CD7814',
        silver: '#9EA3A6',
        gold: '#D3A80F',

        // Additional Colors
        accent: '#000000',
        'light-orange': '#f7e9e4e6',
        'light-green': '#E6F3EB',
        'dark-green': '#3E883D',
        'light-red': '#F6E6E6',
        'dark-red': '#AD360B',
      },
    },
  },
  plugins: [],
} 