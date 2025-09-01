// tailwind.config.js
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#FF6300',
                secondary: '#FFA325',
            },
            backgroundImage: {
                'degrad-1': 'linear-gradient(180deg, #FF6400 0%, #FFA325 24.32%, #FF8A47 56.4%)',
                'degrad-2': 'linear-gradient(180deg, #FFF2E9 0%, #FFEFDA 24.32%, #FFF7F3 56.4%)',
                'degrad-3': 'linear-gradient(90deg, rgba(255, 255, 255, 0.06) 0%, rgba(153, 153, 153, 0.08) 100%)',
            },
        },
    },
    plugins: [],
}
