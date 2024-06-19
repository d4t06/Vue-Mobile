/** @type {import('tailwindcss').Config} */
export default {
   content: [],
   purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
   theme: {
      extend: {},
      container: {
         padding: {
            DEFAULT: "10px",
         },
      },
   },
   plugins: [],
};
