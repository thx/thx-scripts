// const path = require('path')
// const fs = require('fs')
// import * as bodyParser from 'body-parser'
import { indexProxy, mockProxy, ipProxy } from '../shared/getProxy'
import stats from './stats'
import { Configuration } from 'webpack/types'
import { getAppPath, getAppRC } from '../utils'

import { existsSync } from 'fs'
import { join } from 'path'
import { blueBright, yellowBright } from 'chalk'

// PORT 环境变量，指定本地服务的端口号
// HTTPS 环境变量，制定本地服务是否开启 HTTPS
const { PORT, HTTPS }: any = process.env

const appPath = getAppPath()
const appRC = getAppRC(appPath)

const devServerConfig: Configuration = {
  devServer: {
    // contentBase: [path.join(__dirname), path.join(__dirname, 'build')],
    // contentBase: [path.join(__dirname, './')],
    contentBase: [`${process.cwd()}/public`],
    hot: true,
    compress: false, // true
    // https://webpack.js.org/configuration/dev-server/#devserverdisablehostcheck
    disableHostCheck: true,
    port: +PORT || 8080,
    // https://webpack.js.org/configuration/dev-server/#devserverhttps
    https: HTTPS === 'true' || HTTPS === true
      ? (() => {
        const sslKey = join(process.env.HOME, '.self-signed-cert/ssl.key')
        const sslCrt = join(process.env.HOME, '.self-signed-cert/ssl.crt')
        if (!existsSync(sslKey) || !existsSync(sslCrt)) {
          console.log(yellowBright(`📢 检测到本地还未安装自签名 SSL 证书，请先执行插件命令 ${blueBright('mm cert --install')} 一键自动安装本地证书。`))
          return true
        }
        // console.log(greenBright('📢 检测到本地自签名 SSL 证书：'))
        // console.log(`   ${gray('├──')} ${whiteBright(sslKey)}`)
        // console.log(`   ${gray('└──')} ${whiteBright(sslCrt)}`)
        return { key: sslKey, cert: sslCrt }
      })()
      : false,
    // publicPath: process.cwd(),
    // before => after https://github.com/chimurai/http-proxy-middleware/issues/171#issuecomment-356218599
    before (app, server) {
      // app.use(bodyParser.json())
      app.get('/some/path', (req, res) => {
        console.log(req)
        console.log(res)
        res.json({ custom: 'response' })
      })
      app.get('/.rmxrc', (req, res) => {
        const appRC = getAppRC(process.cwd())
        res.json(appRC)
      })
      // 内测 webpack devServer before hook
      const appRC = getAppRC(process.cwd())
      if (appRC.__unstable_dev_server_before) {
        appRC.__unstable_dev_server_before(app, server)
      }
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    // https://webpack.js.org/configuration/stats/
    stats,
    proxy: {
      '*': ipProxy || mockProxy || indexProxy,
      ...(appRC.__unstable_dev_server_proxy || {})
    }
  }

}

export default devServerConfig.devServer
