import { isAbsolute, join } from 'path'
import { blueBright } from 'chalk'
import * as webpack from 'webpack'
import logger, { logEnv, logConfig } from './logger'

import getAppConfig from './shared/getAppConfig'
import defaultWebpackConfig from './config/webpack.config'
import { factory as pluginsFactory } from './config/plugins'
import statsConfig from './config/stats'

process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

const appConfig = getAppConfig()
const appConfigArray: Array<any> = Array.isArray(appConfig) ? appConfig : [appConfig]

// 校验配置
appConfigArray.forEach(item => {
  // 应用无配置
  if (!item) return
  // 应用自定义 output，修正为绝对路径
  if (!item.output) return
  const { output } = item
  if (!isAbsolute(output.path)) {
    output.path = join(process.cwd(), output.path)
  }
})

// 合并配置
const webpackConfigArray = appConfigArray.map((appConfig, appConfigIndex, appConfigArray) => ({
  ...defaultWebpackConfig,
  ...appConfig,
  devServer: appConfig.devServer ? appConfig.devServer : undefined,
  // 插件配置项 plugins 采用合并方式
  plugins: [
    // ...(defaultWebpackConfig.plugins || []),
    // 如果有多个 Webpack 配置实例，并且开启了模块邦联，产生 remote.js 可能会相互覆盖。
    ...(pluginsFactory(appConfig, appConfigIndex, appConfigArray) || []),
    ...(appConfig?.plugins || [])
    // new CompilerResolvedPlugin()
  ]
}))

// 环境日志
logger.info(blueBright(__filename))
logger.info(process.argv)
// 环境信息
logEnv()
// 配置信息
logConfig(webpackConfigArray)
logger.info('webpackConfigArray', webpackConfigArray)

// 启动编译器
webpackConfigArray.forEach(options => {
  webpack(options, (error, stats) => {
    if (error) throw error
    console.log(stats.toString(statsConfig))
  })
})
