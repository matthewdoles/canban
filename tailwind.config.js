module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {}
  },
  daisyui: {
    themes: [
      {
        primaryTheme: {
          primary: 'rgb(255, 211, 105)',
          secondary: 'rgb(34, 40, 49)',
          accent: 'rgb(57, 62, 70)',
          neutral: 'rgb(238, 238, 238)',
          'base-100': '#ffffff'
        }
      }
    ]
  },
  plugins: [require('daisyui')]
};
