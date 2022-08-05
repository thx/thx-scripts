// https://webpack.js.org/configuration/resolve/#resolve
import { resolve } from 'path'
import { Configuration } from 'webpack/types'

const resolveConfig: Configuration = {
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.less', '.sass', '.scss', '.styl'],
    // https://github.com/webpack/node-libs-browser
    fallback: {
      os: require.resolve('os-browserify/browser'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify')
    },
    alias: {
      '@': resolve(process.cwd(), 'src')
      // types: resolve(process.cwd(), 'types')
      // ...(appRC?.__unstable_resolve_alias || {})
    }
  }
}

export default resolveConfig.resolve
