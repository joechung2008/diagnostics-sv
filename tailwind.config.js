import flowbite from "flowbite/plugin";

/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  darkMode: "media",
  plugins: [flowbite],
};

export default config;
