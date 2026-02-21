/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sora: ["'Sora'", "sans-serif"],
        dm: ["'DM Sans'", "sans-serif"],
        mono: ["'Courier New'", "monospace"],
      },
      colors: {
        accent1: "#4f8ef7",
        accent2: "#8b5cf6",
        accent3: "#e879a0",
        bgBase: "#080810",
        bgSurface: "#0f0f1a",
        bgCard: "#13131f",
        bgInput: "#1a1a28",
        bgHover: "#1e1e2e",
        green: "#34d399",
        orange: "#fbbf24",
        red: "#f87171",
      },
      animation: {
        blink: "blink 1.8s ease infinite",
        fadeUp: "fadeUp 0.6s ease both",
        pulseOut: "pulseOut 2s ease-in-out infinite",
        ellipsis: "ell 1.4s steps(3,end) infinite",
        slideDown: "slideDown 0.22s ease",
        pgFade: "pgFade 0.4s cubic-bezier(0.4,0,0.2,1)",
      },
      keyframes: {
        blink: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.25 } },
        fadeUp: { from: { opacity: 0, transform: "translateY(20px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        pulseOut: { "0%,100%": { transform: "scale(1)", opacity: 1 }, "50%": { transform: "scale(1.1)", opacity: 0.65 } },
        slideDown: { from: { opacity: 0, transform: "translateY(-8px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        pgFade: { from: { opacity: 0, transform: "translateY(12px)" }, to: { opacity: 1, transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};
