import { Configuration } from 'webpack/types'
const { NODE_ENV } = process.env

const watchConfig: Configuration = {
  watch: NODE_ENV === 'development',
  watchOptions: {
    ignored: ['node_modules']
    // poll: true
  }
}

// https://webpack.js.org/configuration/watch/#watch
export default watchConfig
