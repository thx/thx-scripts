import { join } from 'path'
import { getGitBranchVersion } from '../shared/getGitBranch'
import { Configuration } from 'webpack/types'
import { formatModuleFederationName } from '../shared/formatModuleFederation'
import { getAppPath, getAppPkg } from '../utils'

const appPath = getAppPath()
const appPkg = getAppPkg(appPath)
const appName = appPkg.name // appPkg.name.replace(/[@/-]/g, '_')
const appVersion = appPkg.version
const branchVersion = getGitBranchVersion(appPath)

// const { ASSET_PATH } = process.env
const config: Configuration = {
  output: {
    // path: join(process.cwd(), process.env.BUILD_DEST || 'build'),
    path: join(process.cwd(), 'build'),
    filename: '[name].js',
    chunkFilename: '[id]_[contenthash].async.js',
    // publicPath: ASSET_PATH || '/'
    publicPath: 'auto',
    library: formatModuleFederationName(`${appName}/${branchVersion || appVersion}`)
  }
}

export default config
