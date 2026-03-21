import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"IBM Plex Sans Arabic"', 'sans-serif'],
        body: ['"IBM Plex Sans Arabic"', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.02em' }],
        'sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'base': ['1rem', { lineHeight: '1.75', letterSpacing: '0.01em' }],
        'lg': ['1.125rem', { lineHeight: '1.7', letterSpacing: '0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '1.4', letterSpacing: '-0.015em' }],
        '4xl': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        '6xl': ['3.75rem', { lineHeight: '1.15', letterSpacing: '-0.025em' }],
        '7xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        '8xl': ['6rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
      },
      colors: {
        'luxury-gold': 'hsl(217, 91%, 60%)',
        'luxury-teal': 'hsl(213, 52%, 25%)',
        'luxury-navy': 'hsl(222, 47%, 11%)',
        'luxury-cream': 'hsl(220, 20%, 97%)',
        
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'chart-2': 'hsl(220, 70%, 50%)',
        'chart-3': 'hsl(120, 70%, 50%)',
        'chart-4': 'hsl(280, 70%, 50%)',
        'chart-5': 'hsl(40, 70%, 50%)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'luxury': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        'luxury-lg': '0 35px 80px -20px rgba(0, 0, 0, 0.2)',
        'glow-teal': '0 0 60px -15px rgba(30, 58, 95, 0.4)',
        'glow-gold': '0 0 40px -10px rgba(59, 130, 246, 0.5)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.08)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "float-subtle": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(59, 130, 246, 0.6)" },
        },
        "iconBounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "20%": { transform: "translateY(-0.3em)" },
          "40%": { transform: "translateY(0)" },
          "60%": { transform: "translateY(-0.1em)" },
          "80%": { transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "float-subtle": "float-subtle 8s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "iconBounce": "iconBounce 0.6s ease",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;