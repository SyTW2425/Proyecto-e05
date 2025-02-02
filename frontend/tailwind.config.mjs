// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
     }
    },
  },
  plugins: [
    // add scrollbar styles
    require('tailwind-scrollbar'),
  ],
  variants: {
    scrollbar: ['rounded'], // Optional
  },
};