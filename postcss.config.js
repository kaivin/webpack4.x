module.exports = {
    parser: 'postcss-scss',
    plugins: [
      require('precss'),
      require('postcss-cssnext')
    ]
}