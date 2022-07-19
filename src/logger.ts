import { existsSync } from 'fs'
import { join } from 'path'
import { blueBright, greenBright, grey, whiteBright, yellowBright } from 'chalk'
import { getLogger, prefixLength, fixLength } from './utils'
import * as webpack from 'webpack'
import { ENV_VAR_LABEL_LENGTH as EVLL, ENV_VAR_MAP } from './shared/constants'
import { Configuration } from 'webpack/types'
import { Logger } from 'log4js'
const pkg = require('../package.json')

const logger: Logger = getLogger(pkg.name)
export default logger

export function logEnv () {
  console.log(blueBright.bold(prefixLength('cwd', EVLL)), whiteBright.underline(process.cwd()))
  console.log(blueBright.bold(prefixLength('USER', EVLL)), whiteBright(process.env.USER), grey(`gid: ${process.getgid()}, uid: ${process.getuid()}`))
  console.log(blueBright.bold(prefixLength('webpack', EVLL)), whiteBright(`${webpack.version}`), grey(`${process.platform}-${process.arch} node-${process.version}`))
  console.log(blueBright.bold(prefixLength('NODE_ENV', EVLL)), whiteBright(process.env.NODE_ENV))
  for (let key in ENV_VAR_MAP) {
    if (!process.env[key]) continue
    console.log(blueBright.bold(prefixLength(key, EVLL)), whiteBright(process.env[key]))

    // 单独处理环境变量 HTTPS，输出 SSL 密钥和自签名证书
    if (key === 'HTTPS') {
      const sslKey = join(process.env.HOME, '.self-signed-cert/ssl.key')
      const sslCrt = join(process.env.HOME, '.self-signed-cert/ssl.crt')
      console.log(blueBright.bold(prefixLength('HTTPS_KEY', EVLL)), existsSync(sslKey) ? whiteBright(sslKey) : yellowBright('未知密钥'))
      console.log(blueBright.bold(prefixLength('HTTPS_CERT', EVLL)), existsSync(sslCrt) ? whiteBright(sslCrt) : yellowBright('未知证书'))
    }
  }
  // console.log(blueBright.bold('  scripts'), pkg.name, 'dev')
}

export function logConfig (optionsArray: Array<Configuration>) {
  // console.log(optionsArray)
  optionsArray.forEach(options => {
    // ModuleFederationPlugin Options
    options.plugins.forEach(plugin => {
      if (plugin instanceof webpack.container.ModuleFederationPlugin) {
        // @ts-ignore
        const pluginOptions = plugin._options
        if (!pluginOptions) return
        console.log(blueBright.bold(prefixLength('MF', EVLL)), whiteBright(pluginOptions.filename), greenBright(pluginOptions.library.name))
      }
    })

    // output
    console.log(blueBright.bold(prefixLength('output', EVLL)), whiteBright.underline(options.output.path))

    // entry
    if (typeof options.entry === 'string') {
      console.log(blueBright.bold(prefixLength('entry', EVLL), options.entry))
    } else {
      const pages = Object.entries(options.entry).map(([name, path]) => ({ name, path }))
      const names = pages.map(page => page.name)
      console.log(blueBright.bold(prefixLength('entry', EVLL)), names, '\n')

      // entry detail
      const maxNameLength = Math.max(...pages.map(named => named.name.length), EVLL)
      console.log(`${blueBright.bold.underline(prefixLength('Entry Name', maxNameLength))} ${blueBright.bold.underline(fixLength('Source Path', maxNameLength))}`)
      pages.forEach(named => {
        console.log(`${whiteBright.bold(prefixLength(named.name, maxNameLength))} ${grey(named.path)}`)
      })
    }

    console.log()
  })
}
