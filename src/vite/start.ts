import { existsSync } from 'fs'
import { join } from 'path'
import { blueBright, yellowBright, whiteBright, grey } from 'chalk'
import { createServer, UserConfig, InlineConfig } from 'vite'
import { prefixLength, getAppPath, getAppRC, onetab } from '../utils'
import { ENV_VAR_LABEL_LENGTH as EVLL, ENV_VAR_MAP } from '../shared/constants'

const vitePkg = require('vite/package.json')
const { PORT, HTTPS }: any = process.env

const appPath = getAppPath()
const appRC: any = getAppRC(appPath)
const appConfig: UserConfig = appRC?.vite || {}
const { server: appServerConfig = {}, ...appExtraConfig } = appConfig

function logEnv () {
  console.log(blueBright.bold(prefixLength('cwd', EVLL)), whiteBright.underline(process.cwd()))
  console.log(blueBright.bold(prefixLength('USER', EVLL)), whiteBright(process.env.USER), grey(`gid: ${process.getgid()}, uid: ${process.getuid()}`))
  console.log(blueBright.bold(prefixLength('vite', EVLL)), whiteBright(`${vitePkg.name}/${vitePkg.version} ${process.platform}-${process.arch} node-${process.version}`))
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

async function doit () {
  const userConfig: InlineConfig = {
    configFile: false,
    root: getAppPath(),
    server: {
      port: +PORT || 8080,
      https: HTTPS === 'true' || HTTPS === true
        ? (() => {
          const sslKey = join(process.env.HOME, '.self-signed-cert/ssl.key')
          const sslCrt = join(process.env.HOME, '.self-signed-cert/ssl.crt')
          if (!existsSync(sslKey) || !existsSync(sslCrt)) {
            console.log(yellowBright(`📢 检测到本地还未安装自签名 SSL 证书，请先执行插件命令 ${blueBright('mm cert --install')} 一键自动安装本地证书。`))
            return true
          }
          return { key: sslKey, cert: sslCrt }
        })()
        : false,
      open: appRC.__unstable_auto_open !== false,
      ...appServerConfig
    },
    ...appExtraConfig
  }

  const server = await createServer(userConfig)
  await server.listen()

  server.printUrls()

  // 默认自动在浏览器中打开本地服务。值为 false 时禁用。
  if (appRC.__unstable_auto_open !== false) {
    const { HTTPS, PROXY_HOST }: any = process.env
    onetab(`${HTTPS ? 'https' : 'http'}://${PROXY_HOST || 'localhost'}:${userConfig.server.port}`)
  }
}

logEnv()
doit()
