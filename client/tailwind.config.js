/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                midnight: '#0f172a',
                'neon-cyan': '#06b6d4',
                'neon-purple': '#8b5cf6',
            },
        },
    },
    plugins: [],
}
