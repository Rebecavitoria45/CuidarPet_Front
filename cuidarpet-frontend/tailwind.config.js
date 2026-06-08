/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { 
      colors: {
        "primary-container": "#f57c00",
        "primary": "#964900",
        "surface-container-lowest": "#ffffff",
        "on-surface-variant": "#574235",
        "outline-variant": "#dec1af",
      },
      spacing: {
        "base": "8px",
        "lg": "40px",
        "md": "24px",
        "margin-desktop": "32px",
        "margin-mobile": "16px",
        "xs": "4px",
      }
    },
  },
  plugins: [],
}