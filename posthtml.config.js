module.exports = {
  plugins: {
    'posthtml-expressions': {
      locals: {
        PUBLIC_URL: process.env.PUBLIC_URL,
      },
    },
  },
}
