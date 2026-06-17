/** @type {import('tailwindcss').Config} */
// Generated from the UrbanFlow design system (design-system.json).
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  // "class" lets us drive dark mode manually via nativewind's colorScheme API.
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Brand — purple
        primary: {
          DEFAULT: "#6912E2",
          hover: "#5A0DC0",
          light: "#F3E8FF",
          foreground: "#FFFFFF",
        },
        // Semantic
        success: "#34C759",
        warning: "#FF9F0A",
        error: "#FF3B30",
        info: "#007AFF",

        // Light neutrals
        background: "#FFFFFF",
        subtle: "#F5F5F7",
        card: "#FFFFFF",
        border: "#E5E5EA",
        ink: {
          DEFAULT: "#0A0A0A",
          muted: "#6E6E73",
          placeholder: "#AEAEB2",
        },

        // Dark neutrals (design system ships light only — these mirror the
        // Apple-style dark palette so dark mode §6 stays on-brand)
        "background-dark": "#0A0A0A",
        "subtle-dark": "#000000",
        "card-dark": "#1C1C1E",
        "border-dark": "#2C2C2E",
        "ink-dark": "#F5F5F7",
        "ink-dark-muted": "#8E8E93",
      },
      // Outfit, loaded at runtime via @expo-google-fonts/outfit.
      // One family per weight (RN doesn't auto-pick weight files).
      fontFamily: {
        sans: ["Outfit_400Regular"],
        "sans-medium": ["Outfit_500Medium"],
        "sans-semibold": ["Outfit_600SemiBold"],
        "sans-bold": ["Outfit_700Bold"],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        md: "10px",
        lg: "14px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "28px",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
