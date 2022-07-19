import { existsSync, statSync } from 'fs'
import { extname, resolve, join } from 'path'
import { IncomingMessage, ServerResponse } from 'http'
import { grey, yellowBright, blueBright } from 'chalk'
import { getAppPath, fixLength, getAppRC } from '../utils'

const { MOCK, RAP_ID, RAP_HOST, PROXY_IP, PROXY_HTTPS } = process.env

const RE_STATIC_SOURCE_EXTNAME = /^\.(js|css|bmp|gif|jpe?g|a?png|svg)$/
const appPath = getAppPath()

// 首页代理
const INDEX_HTML = '/index.html'
const indexProxy = {
  logLevel: 'info', // debug
  // https://webpack.js.org/configuration/dev-server/#devserverproxy
  // Sometimes you don't want to proxy everything. It is possible to bypass the proxy based on the return value of a function.
  // In the function you get access to the request, response, and proxy options.
  // Return null or undefined to continue processing the request with proxy.
  // Return false to produce a 404 error for the request.
  // Return a path to serve from, instead of continuing to proxy the request.
  bypass (req: IncomingMessage, res: ServerResponse, proxyOptions) {
    // 静态资源，不需要重定向到 INDEX_HTML，并且跳过后续处理
    if (RE_STATIC_SOURCE_EXTNAME.test(extname(req.url))) {
      return req.url
    }

    // 本地文件，不需要重定向到 INDEX_HTML，并且跳过后续处理
    const localPublicAssetPath = resolve(appPath, 'public', `.${req.url}`)
    if (existsSync(localPublicAssetPath) && statSync(localPublicAssetPath).isFile()) {
      return req.url
    }

    // 特例：伪装成 HTML 的接口，例如 /logout.do、/sendBucSSOToken.do，不需要重定向到 INDEX_HTML，继续执行代理。
    if (/^\.do$/.test(extname(req.url))) {
      return
    }

    // 对于其他 HTML 资源，总是重定向到 INDEX_HTML
    if (req.headers.accept.includes('html')) {
      console.log(grey('🧲 [page proxy]'), `${fixLength(req.method, 4)} ${yellowBright(req.url)} ${grey('=>')} ${blueBright(INDEX_HTML)}`)
      return INDEX_HTML
    }

    // 非 HTML 资源，不需要重定向到 INDEX_HTML，继续执行后续处理
  }
}

let mockProxy
if (MOCK && RAP_ID) {
  mockProxy = { // ProxyConfigMap
    ...indexProxy,
    target: RAP_HOST,
    context: () => true,
    changeOrigin: true,
    secure: false, // 解决后端日常服务的证书是集团内自签名证书，代理失败
    // https://github.com/chimurai/http-proxy-middleware#http-proxy-middleware-options
    // option.pathRewrite: object/function, rewrite target's url path. Object-keys will be used as RegExp to match paths.
    pathRewrite: function (path: string, req: IncomingMessage) {
      // if (/^\.(js|css|bmp|gif|jpe?g|png)$/.test(extname(req.url))) return
      // if (req.headers.accept?.indexOf('image') !== -1) return url

      const nextTarget = mockProxy.target.replace(/\/$/, '')

      // 是否命中 RAP2 场景代理配置
      const appRC = getAppRC(appPath) // 每次执行代理时重新读取，避免重启应用。
      if (appRC.__unstable_rap2_scene_proxy && appRC.__unstable_rap2_scene_proxy[path]) {
        const nextPath = appRC.__unstable_rap2_scene_proxy[path]
        console.log(grey('🎯 [rap2 scene]'), `${fixLength(req.method, 4)} ${yellowBright(path)} ${grey('=>')} ${blueBright(nextPath)}`)

        /**
         * 基于接口路径的代理场景配置：
         * "__unstable_rap2_scene_proxy": {
         *    "/common/login_user.htm": "/common/login_user.htm?_tag=alimama"
         * }
         */
        // const nextUrl = `${mockProxy.target}${join('app', 'mock-scene', nextPath)}`
        const nextUrl = `${nextTarget}${join('app', 'mock-scene', RAP_ID)}/${nextPath}`
        console.log(grey('🐡 [mock proxy]'), `${fixLength(req.method, 4)} ${yellowBright(path)} ${grey('=>')} ${blueBright(nextUrl)}`)
        return nextUrl
      }

      const nextUrl = `${nextTarget}${join('app', 'mock', RAP_ID)}/${path}`
      console.log(grey('🐡 [mock proxy]'), `${fixLength(req.method, 4)} ${yellowBright(path)} ${grey('=>')} ${blueBright(nextUrl)}`)
      return nextUrl
    }
  }
}

let ipProxy
if (PROXY_IP) {
  ipProxy = {
    ...indexProxy,
    target: `${PROXY_HTTPS ? 'https' : 'http'}://${PROXY_IP}`,
    context: () => true,
    changeOrigin: false,
    secure: false,
    pathRewrite: function (url: string, req: IncomingMessage) {
      // if (/^\.(js|css|bmp|gif|jpe?g|png)$/.test(extname(req.url))) return
      // if (req.headers.accept?.indexOf('image') !== -1) return url

      const nextUrl = `${ipProxy.target}${url[0] === '/' ? '' : '/'}${url}`
      console.log(grey('🚐 [host proxy]'), `${fixLength(req.method, 4)} ${yellowBright(url)} ${grey('=>')} ${blueBright(nextUrl)}`)
      return nextUrl
    }
  }
}

export { indexProxy, mockProxy, ipProxy }
