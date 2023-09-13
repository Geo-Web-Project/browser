const webpack = require('webpack')
const { parsed: myEnv } = require('dotenv').config({ path: `.env.${process.env.APP_ENV}` })

if(!myEnv) console.log("Environment 'APP_ENV' is not set")

module.exports = {
  output: 'export',
  webpack(config) {
      config.plugins.push(new webpack.EnvironmentPlugin(myEnv))
      return config
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['@geo-web/mud-world-base-client', '@geo-web/mud-world-base-contracts'],
};