/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        success: "#16a34a",
        warning: "#facc15",
        danger: "#dc2626",
        neutral: "#1f2937",
      },
      boxShadow: {
        card: "0 10px 30px -15px rgba(15, 23, 42, 0.35)",
      },
    },
  },
  plugins: [],
};
