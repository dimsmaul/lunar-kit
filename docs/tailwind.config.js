/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './content/**/*.{md,mdx}',
        './node_modules/fumadocs-ui/dist/**/*.js',
        '../packages/core/src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: 'hsl(262, 80%, 50%)',
                secondary: 'hsl(49, 100%, 50%)',
                destructive: 'hsl(0, 100%, 50%)',
                muted: 'hsl(240, 3.7%, 15.9%)',
                accent: 'hsl(262, 80%, 50%)',
                foreground: 'hsl(0, 0%, 100%)',
                background: 'hsl(240, 10%, 3.9%)',
            },
        },
    },
};
