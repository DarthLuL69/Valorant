module.exports = {
  theme: {
    extend: {
      animation: {
        bubble: 'bubble 3s infinite',
        'back-and-forth': 'backAndForth 3s infinite',
      },
      keyframes: {
        bubble: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        backAndForth: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
      },
    },
  },
};