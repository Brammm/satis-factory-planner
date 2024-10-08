/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#DF691A',
                secondary: '#2B3E50',
                tertiary: '#4E5D6C',
            },
        },
    },
    plugins: [],
};
