import { isAbsolute, join } from 'path'
import { blueBright, greenBright, grey, yellowBright, whiteBright } from 'chalk'
import * as webpack from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'
import logger, { logEnv, logConfig } from './logger'

import getAppConfig from './shared/getAppConfig'
import defaultWebpackConfig from './config/webpack.config'
import defaultDevServerConfig from './config/devServer'
import { factory as pluginsFactory } from './config/plugins'
import statsConfig from './config/stats'
import { Configuration, Compiler } from 'webpack/types'

import { getAppPath, getAppRC, onetab } from './utils'

process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

const appPath = getAppPath()
const appRC = getAppRC(appPath)

const appConfig = getAppConfig()
const appConfigArray: Array<Configuration> = Array.isArray(appConfig) ? appConfig : [appConfig]

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

// 合并配置：默认配置 + 应用配置
const webpackConfigArray = appConfigArray.map((appConfig, appConfigIndex, appConfigArray) => {
  ['entry', 'output'].map(key => {
    if (defaultWebpackConfig[key] && appConfig[key]) {
      if (JSON.stringify(defaultWebpackConfig[key]) !== JSON.stringify(appConfig[key])) {
        console.log()
        console.log(yellowBright(`💢 发现不一致的 ${blueBright(key)} 配置：`))
        console.log(yellowBright('⛔️ 忽略默认配置：'), grey(JSON.stringify(defaultWebpackConfig[key], null, 2)))
        console.log(yellowBright('💡 采用自定义配置：'), whiteBright.bold(JSON.stringify(appConfig[key], null, 2)))
        console.log()
      }
    }
  })
  return {
    ...defaultWebpackConfig,
    ...appConfig,
    devServer: appConfig.devServer ? appConfig.devServer : undefined,
    // 插件配置项 plugins 采用合并方式
    plugins: [
      // ...(defaultWebpackConfig.plugins || []),
      // 如果有多个 Webpack 配置实例，并且开启了模块邦联，产生 remote.js 可能会相互覆盖。
      ...(pluginsFactory(appConfig, appConfigIndex, appConfigArray) || []),
      ...(appConfig?.plugins || [])
    ]
  }
})
const devServerConfigArray = appConfigArray.map((appConfig, index) => {
  // 除非设置 devServer 为 false，否则默认启动 WebpackDevServer
  if (appConfig.devServer === false) return
  return {
    ...defaultDevServerConfig,
    ...appConfig.devServer
  }
})

// 详细日志
logger.info(blueBright(__filename))
logger.info(process.argv)
// 环境信息
logEnv()
// 配置信息
logConfig(webpackConfigArray)
logger.info('webpackConfigArray', webpackConfigArray)
logger.info('devServerConfigArray', devServerConfigArray)

// 启动编译器和本地服务
function compilerHandler (error, stats) {
  if (error) throw error
  console.log(stats.toString(statsConfig))
}
// const compilerArray: Array<Compiler> = webpackConfigArray.map(options => webpack(options))
// const devServerArray = compilerArray.map((compiler, index) => {
//   if (!devServerConfigArray[index]) {
//     if (webpackConfigArray[index].watch) {
//       compiler.watch(webpackConfigArray[index].watchOptions, compilerHandler)
//     } else {
//       compiler.run(compilerHandler)
//     }
//     return
//   }
//   return new WebpackDevServer(compiler, devServerConfigArray[index])
// })
const compilerArray: Array<Compiler> = []
const devServerArray: Array<WebpackDevServer> = []
webpackConfigArray.forEach((options: Configuration, index) => {
  const nextOptions = { ...options, watch: devServerConfigArray[index] ? false : options.watch }
  const compiler = nextOptions.watch ? webpack(nextOptions, compilerHandler) : webpack(nextOptions)
  if (!nextOptions.watch && !devServerConfigArray[index]) compiler.run(compilerHandler)
  compilerArray.push(compiler)

  devServerArray.push(
    devServerConfigArray[index]
      ? new WebpackDevServer(compiler, devServerConfigArray[index])
      : undefined
  )
})

function startDevServerArray () {
  if (startDevServerArray.ready) return
  startDevServerArray.ready = true
  devServerArray.forEach((devServer, index) => {
    if (!devServer) return
    const devServerOptions = devServerConfigArray[index]
    const httpServer = devServer.listen(devServerOptions.port, error => {
      if (error) {
        console.error(error)
        process.exit(1)
      }
    })
    httpServer.on('error', (error: any) => {
      // console.error(error)
      if (error.code === 'EACCES') {
        console.log(yellowBright('✘ 设置该端口需要 sudo 权限，请尝试加 sudo 执行！'))
        process.exit(1)
      }
      // 端口已经被使用
      if (error.code === 'EADDRINUSE') {
        console.log(yellowBright(`ⓘ 端口 ${error.port} 被占用！`))
        console.log('可以执行以下命令查看端口占用情况：')
        console.log(grey('$ Apple '), greenBright(`lsof -i tcp:${error.port}`))
        console.log(grey('$ Window'), greenBright('netstat -nao'))
        process.exit(1)
      }
    })
    // 默认自动在浏览器中打开本地服务。值为 false 时禁用。
    if (appRC.__unstable_auto_open !== false) {
      const { HTTPS, PROXY_HOST }: any = process.env
      onetab(`${HTTPS ? 'https' : 'http'}://${PROXY_HOST || 'localhost'}:${devServerOptions.port}`)
    }
  })
}
startDevServerArray.ready = false
startDevServerArray()
