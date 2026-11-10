import daisyui from "daisyui"

export default {
    content: [ "./src/**/*.{js,jsx,ts,tsx}"],
    theme: { extend: {} },
    plugins: [daisyui],
    daisyui: {
        themes: [
            {
                light: {
                    "primary": "#4fbf8b",
                    "primary-focus": "#44ae7c",
                    "secondary": "#fbbf24",
                    "accent": "#f43f5e",
                    "neutral": "#3d4451",
                    "base-100": "#ffffff",
                    "info": "#2094f3",
                    "success": "#009485",
                    "warning": "#ff9900",
                    "error": "#ff5724",
                },
            },
            "forest"
        ],
    },
};