import { join } from 'path'
import { Configuration } from 'webpack/types'
import getModuleFederationLibrary from '../shared/getModuleFederationLibrary'
import { getAppPath } from '../utils'

const appPath = getAppPath()

// const { ASSET_PATH } = process.env
const config: Configuration = {
  output: {
    // path: join(process.cwd(), process.env.BUILD_DEST || 'build'),
    path: join(process.cwd(), 'build'),
    filename: '[name].js',
    chunkFilename: '[id]_[contenthash].async.js',
    // publicPath: ASSET_PATH || '/'
    publicPath: 'auto',
    library: getModuleFederationLibrary(appPath)
  }
}

export default config
