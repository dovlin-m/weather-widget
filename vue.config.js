const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
    ? '/weather-widget/'
    : '/',
  transpileDependencies: [
    'vuetify'
  ]
})
module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      })
    ]
  },
  chainWebpack:
    config => {
      config.optimization.delete('splitChunks')
    },
  filenameHashing: false
}
