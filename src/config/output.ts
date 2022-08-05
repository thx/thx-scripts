import { join } from 'path'
import { Configuration } from 'webpack/types'
import { formatModuleFederationName } from './plugins'
import { getAppPath, getAppPkg } from '../utils'

const appPath = getAppPath()
const appPkg = getAppPkg(appPath)
const appName = appPkg.name // appPkg.name.replace(/[@/-]/g, '_')
const appVersion = appPkg.version

// const { ASSET_PATH } = process.env
const config: Configuration = {
  output: {
    // path: join(process.cwd(), process.env.BUILD_DEST || 'build'),
    path: join(process.cwd(), 'build'),
    filename: '[name].js',
    chunkFilename: '[id]_[contenthash].async.js',
    // publicPath: ASSET_PATH || '/'
    publicPath: 'auto',
    library: formatModuleFederationName(`${appName}/${appVersion}`)
  }
}

export default config
