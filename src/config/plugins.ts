import * as fs from 'fs'
import { join } from 'path'

import { WebpackPluginInstance, HotModuleReplacementPlugin, container, DefinePlugin, ProvidePlugin } from 'webpack'
import { Configuration } from 'webpack/types'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import * as ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'

// 单 webpack 配置实例
import entry from './entry'
import { getAppPath, getAppPkg, getAppRC } from '../utils'

// 2022.3.17 支持多 webpack 配置实例
import { getEntry } from '../shared/getEntry'

import getModuleFederationLibrary from '../shared/getModuleFederationLibrary'
// const { PAGE } = process.env

const WebpackBar = require('webpackbar')

// const cliProgress = require('cli-progress') // https://github.com/AndiDittrich/Node.CLI-Progress
// const cliProgressBar = new cliProgress.SingleBar({
//   format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | {message}'
// }, cliProgress.Presets.legacy)

const {
  NODE_ENV,
  MM_MODE,
  ANALYZE, ANALYZE_PORT
} = process.env

const appPath = getAppPath()
const appRC = getAppRC(appPath)

export function factory (appConfig?: Configuration, appConfigIndex?: number, appConfigArray?: Configuration[]) {
  const plugins: Array<WebpackPluginInstance> = [
    new WebpackBar({}),
    // 等价于 DefinePlugin，参见 https://webpack.js.org/plugins/environment-plugin/
    // new EnvironmentPlugin({
    //   'MM_MODE': MM_MODE || 'production'
    // }),
    new DefinePlugin({
      // MO TODO 按需补充
      'process.platform': JSON.stringify(process.platform),
      'process.env': JSON.stringify(process.env),
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV || 'production'),
      'process.env.MM_MODE': JSON.stringify(MM_MODE || 'production'),
      ...Object.entries(appRC?.__unstable_env || {}).reduce((acc, cur) => {
        const [key, value] = cur
        acc[`process.env.${key}`] = value
        return acc
      }, {})
    }),
    new ProvidePlugin({})
  ]

  if (NODE_ENV === 'development') {
    plugins.push(
      new HotModuleReplacementPlugin(),
      new ReactRefreshWebpackPlugin()
    )
  }

  // ModuleFederationPlugin
  // 默认开启 Webpack 5 ModuleFederationPlugin。当 __unstable_module_federation 为 false 时禁用。
  if (!appRC || appRC.__unstable_module_federation !== false) {
  // const appPkg = require(join(process.cwd(), 'package.json'))
    const appPkg = getAppPkg(appPath)
    const appName = appPkg.name // appPkg.name.replace(/[@/-]/g, '_')
    let exposes = Object.entries(entry).reduce((acc, cur) => {
      const [name, path] = cur
      if (path) acc[`./${name}`] = path
      return acc
    }, {})
    // 2022.3.17 支持多 webpack 配置实例
    if (appConfig) {
      exposes = Object.entries(getEntry(undefined, appConfig)).reduce((acc, cur) => {
        const [name, path] = cur
        if (path) acc[`./${name}`] = path
        return acc
      }, {})
    }
    const shared = {
    // ...appPkg.dependencies,
    // react: {
    //   eager: true,
    //   import: 'react',
    //   shareKey: 'react',
    //   shareScope: 'legacy',
    //   singleton: true,
    //   requiredVersion: appPkg.dependencies.react
    // },
    // 'react-dom': {
    //   eager: true,
    //   singleton: true,
    //   requiredVersion: appPkg.dependencies['react-dom']
    // }
    }
    // 指定依赖的远程应用
    const remotes = appRC?.__unstable_module_federation_remotes || {} // eslint-disable-line camelcase
    let filename = 'remote.js'
    // 2022.3.17 支持多 webpack 配置实例
    if (appConfigArray && appConfigArray.length > 1 && appConfigIndex > 0) {
      filename = `remote.${appConfigIndex}.js`
    }
    const options: any = {
      name: appName,
      library: { type: 'umd', name: getModuleFederationLibrary(appPath) },
      filename,
      exposes,
      shared,
      remotes,
      remoteType: 'script'
    }
    plugins.push(
      new container.ModuleFederationPlugin(options)
    )
  }

  // HtmlWebpackPlugin
  // 默认关闭 Webpack HtmlWebpackPlugin。当 __unstable_html_webpack_plugin 为 true 时启用。
  if (NODE_ENV === 'development') {
    if (appRC && appRC.__unstable_html_webpack_plugin === true) {
      const template = join(process.cwd(), 'public/index.html')
      if (fs.existsSync(template)) {
        plugins.push(
          new HtmlWebpackPlugin({
            inject: true,
            template
          })
        )
      }
    }
  }

  // BundleAnalyzerPlugin
  if (ANALYZE) {
    plugins.push(
    // https://github.com/webpack-contrib/webpack-bundle-analyzer
      new BundleAnalyzerPlugin({
        analyzerMode: NODE_ENV === 'development' ? 'server' : 'static',
        analyzerPort: ANALYZE_PORT || 'auto',
        openAnalyzer: false,
        generateStatsFile: true
      })
    )
  }

  return plugins
}

export default factory()
