const webpack = require('webpack')
const { parsed: myEnv } = require('dotenv').config({ path: `.env.${process.env.APP_ENV}` })

if(!myEnv) console.log("Environment 'APP_ENV' is not set")

module.exports = {
  webpack(config) {
      config.plugins.push(new webpack.EnvironmentPlugin(myEnv))
      return config
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};
