module.exports = {
    plugins: {
    // Tailwind v4 moved the PostCSS plugin to @tailwindcss/postcss
    // Use the adapter package which internally loads Tailwind correctly.
    "@tailwindcss/postcss": {},
    autoprefixer: {},
    }
}
