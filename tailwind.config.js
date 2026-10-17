/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ffed00',
          deep: '#e6d200',
        },
        'on-primary': '#000000',
        ink: '#000000',
        body: '#222222',
        charcoal: '#333333',
        mute: '#666666',
        ash: '#8a8a8a',
        stone: '#c4c4c4',
        'on-dark': {
          DEFAULT: '#ffffff',
          mute: 'rgba(255,255,255,0.72)',
        },
        canvas: '#ffffff',
        'surface-soft': '#f7f7f7',
        'surface-card': '#ffffff',
        'surface-dark': '#000000',
        'surface-deep': '#111111',
        hairline: {
          DEFAULT: '#f2f2f2',
          strong: '#000000',
        },
        'divider-dark': 'rgba(255,255,255,0.16)',
        'badge-new': '#ffed00',
        link: '#0000ee',
        error: '#be6464',
        warning: '#f0ad4e',
        success: '#8dc572',
        info: '#337ab7',
      },
      fontFamily: {
        sans: ['NouvelR', 'Inter Tight', 'Manrope', 'sans-serif'],
        display: ['NouvelR', 'Inter Tight', 'Manrope', 'sans-serif'],
      },
      borderRadius: {
        none: '0px',
        xs: '2px',
        sm: '3px',
        md: '4px',
        pill: '46px',
        full: '9999px',
      },
      spacing: {
        xxs: '4px',
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '20px',
        xl: '24px',
        xxl: '32px',
        xxxl: '40px',
        section: '80px',
      },
      maxWidth: {
        content: '1440px',
      },
      lineHeight: {
        display: '0.95',
        button: '1.0',
        subtitle: '1.3',
        tight1: '1.0',
      },
      letterSpacing: {
        btn: '0.144px',
        btnSm: '0.13px',
      },
    },
  },
  plugins: [],
};
