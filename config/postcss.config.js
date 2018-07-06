module.exports = {
    parser: 'postcss-scss',
    plugins: [
      require('precss'),
      require('autoprefixer')({ browsers: '> 0.1%', })
    ]
}