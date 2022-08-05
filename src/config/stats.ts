// import { Configuration } from 'webpack/types'

// https://webpack.js.org/configuration/stats/#stats-options
const stats = {
  colors: true,
  hash: false,
  modules: true,
  performance: true,
  // logging: 'info',
  depth: true
}

// TODO Configuration
// Default export of the module has or is using private name 'StatsOptions'.ts(4082)
export default stats
