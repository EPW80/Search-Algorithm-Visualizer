/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Holographic sky blue theme colors
        primary: {
          50: '#e6f7ff',
          100: '#b3e5ff',
          200: '#80d4ff',
          300: '#4dc2ff',
          400: '#1ab0ff',
          500: '#009ee6',
          600: '#007bb3',
          700: '#005880',
          800: '#00354d',
          900: '#00121a',
        },
        blockchain: {
          dark: '#0a0e27',
          medium: '#1a1f3a',
          light: '#2a3055',
          accent: '#00d4ff',
        },
        grid: {
          unvisited: '#1a1f3a',
          visited: '#4dc2ff',
          path: '#00ff88',
          wall: '#334155',
          start: '#00ff88',
          end: '#ff0055',
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 212, 255, 0.5)',
        'glow-sm': '0 0 10px rgba(0, 212, 255, 0.3)',
        'glow-lg': '0 0 30px rgba(0, 212, 255, 0.7)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'gridScan': 'gridScan 4s linear infinite',
        'particleFloat': 'particleFloat 20s ease-in-out infinite',
        'holoScan': 'holoScan 3s linear infinite',
        'gradientShift': 'gradientShift 4s ease infinite',
        'platformPulse': 'platformPulse 3s ease-in-out infinite',
        'legendScan': 'legendScan 3s linear infinite',
        'pathPulse': 'pathPulse 2s infinite',
        'activePulse': 'activePulse 2s ease-in-out infinite',
        'expandDescription': 'expandDescription 0.3s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 212, 255, 0.2), 0 0 10px rgba(0, 212, 255, 0.2)' },
          '100%': { boxShadow: '0 0 10px rgba(0, 212, 255, 0.4), 0 0 20px rgba(0, 212, 255, 0.4)' },
        },
        gridScan: {
          '0%': { transform: 'translateY(0)', opacity: '0.8' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(600px)', opacity: '0.8' },
        },
        particleFloat: {
          '0%, 100%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
        },
        holoScan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        platformPulse: {
          '0%, 100%': { opacity: '0.6', transform: 'translateX(-50%) scaleX(1)' },
          '50%': { opacity: '1', transform: 'translateX(-50%) scaleX(1.05)' },
        },
        legendScan: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(400px)' },
        },
        pathPulse: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 20px rgba(0, 255, 245, 0.8)' },
          '50%': { transform: 'scale(1.1)', boxShadow: '0 0 30px rgba(0, 255, 245, 1)' },
        },
        activePulse: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0', transform: 'scale(1.05)' },
        },
        expandDescription: {
          'from': { opacity: '0', maxHeight: '0' },
          'to': { opacity: '1', maxHeight: '100px' },
        }
      }
    },
  },
  plugins: [],
}
