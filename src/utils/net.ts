import { resolve } from 'path'
import { execSync } from 'child_process'
import * as net from 'net'
import * as kill from 'kill-port'
import { blueBright, redBright, yellowBright } from 'chalk'
import * as open from 'open'
import * as portfinder from 'portfinder'

/**
 * 检测端口是否被占用
 */
export function portIsOccupied (port: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // 创建服务并监听该端口
    const server = net.createServer().listen(port)

    server.on('listening', function () { // 执行这块代码说明端口未被占用
      server.close() // 关闭服务
      resolve(false)
    })

    server.on('error', function (err: any) {
      if (err.code === 'EADDRINUSE' || err.code === 'EACCES') { // 端口已经被使用或没权限
        // reject(err)
        server.close() // 关闭服务
        resolve(true)
      }
    })
  })
}

export async function killPort (port: number) {
  return kill(port, 'tcp')
    // .then(console.log)
    .then(({ error, stdout, stderr, cmd, code }) => {
      console.log(redBright(`try to kill port ${yellowBright.bold(port)}`))
      console.log(`${blueBright(cmd)}`)
      if (error) console.error(error)
    })
    .catch(console.error)
}

export async function getAvailablePort () {
  // portfinder.basePort = 8888
  // portfinder.highestPort = 9999
  return portfinder.getPortPromise({ startPort: 8888, stopPort: 9999 })
}

/** 尝试在浏览器中打开目标地址。如果是重复打开，则自动刷新已开页签。 */
export function onetab (target: string, options: any = { app: 'google chrome' }) {
  try {
    execSync(`osascript openChrome.applescript ${target}`, { cwd: resolve(__dirname, '../../scripts'), stdio: 'ignore' })
  } catch (error) {
    open(target, options)
  }
}
