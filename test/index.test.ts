import { describe, it } from 'mocha'
import { MM_PORT } from '../src/utils'
import { spawn, SpawnOptions } from 'child_process'
import { expect } from 'chai'
import { delay, EXAMPLE_REACT, SPAWN_OPTIONS, validSubProcess } from './shared'
import { gray, bgBlueBright, blueBright } from 'chalk'
import { killDevServer, validDevServer } from './valid'
import { IDevEnv } from './index.d'
const pkg = require('../package.json')

function getNextPort () {
  return MM_PORT + parseInt(`${Math.random() * 1000}`)
}

const appPath = EXAMPLE_REACT
const options: SpawnOptions = {
  ...SPAWN_OPTIONS,
  // stdio: 'inherit',
  // stdio: 'pipe', // 输出格式可控
  cwd: appPath
}

const DEV_ENV_MATRIX_SERVER: IDevEnv[] = [
  { PORT: `${getNextPort()}` },
  { PORT: `${getNextPort()}`, HTTPS: 'true' }
]
const DEV_ENV_MATRIX_ANALYZE: IDevEnv[] = [
  { ANALYZE: 'true' },
  { ANALYZE: 'true', ANALYZE_PORT: `${getNextPort()}` }
]
const DEV_ENV_MATRIX_MOCK: IDevEnv[] = [
  { MOCK: 'true', RAP_ID: '5496', RAP_HOST: 'http://rap2api.alibaba-inc.com/' }, // https://rap2.alibaba-inc.com/repository/editor?id=5496&mod=19273&itf=152781
  { MOCK: 'true', RAP_ID: '304935', RAP_HOST: 'http://rap2api.taobao.org/' } // http://rap2.taobao.org/repository/editor?id=304935&mod=518008&itf=2305341
]
const DEV_ENV_MATRIX_PROXY: IDevEnv[] = [
  { PROXY_IP: '127.0.0.1', PROXY_HOST: 'local.proxy.com', PROXY_PORT: `${getNextPort()}` },
  { PROXY_IP: '127.0.0.1', PROXY_HOST: 'local.proxy.com', PROXY_PORT: `${getNextPort()}`, PROXY_HTTPS: 'true' }
]
const DEV_ENV_MATRIX_PAGE: IDevEnv[] = [
  { PAGE: 'index,portal,pages/foo/index' },
  { PAGE: 'index,portal,pages/foo/index,pages/bar/index' },
  { PAGE: 'index,portal,pages/foo/index,pages/bar/index,pages/faz/index' }
]

const DEV_ENV_MAP_LIST: IDevEnv[] = DEV_ENV_MATRIX_SERVER.reduce<IDevEnv[]>((acc, port) => {
  /** PORT */
  acc.push({ ...port })

  /** PORT + ANALYZE */
  DEV_ENV_MATRIX_ANALYZE.forEach(analyze => acc.push({ ...port, ...analyze }))
  /** PORT + MOCK */
  DEV_ENV_MATRIX_MOCK.forEach(mock => acc.push({ ...port, ...mock }))
  /** PORT + PROXY */
  DEV_ENV_MATRIX_PROXY.forEach(proxy => acc.push({ ...port, ...proxy }))
  /** PORT + PAGE */
  DEV_ENV_MATRIX_PAGE.forEach(page => acc.push({ ...port, ...page }))

  /** PORT + MOCK + PAGE */
  DEV_ENV_MATRIX_MOCK.forEach(mock => {
    DEV_ENV_MATRIX_PAGE.forEach(page => {
      acc.push({ ...port, ...mock, ...page })
    })
  })

  /** PORT + PROXY + PAGE */
  DEV_ENV_MATRIX_PROXY.forEach(proxy => {
    DEV_ENV_MATRIX_PAGE.forEach(page => {
      acc.push({ ...port, ...proxy, ...page })
    })
  })

  return acc
}, [])

const BUILD_ENV_MAP_LIST = DEV_ENV_MAP_LIST.map(
  ({ ANALYZE, PAGE }) => {
    const testEvn: IDevEnv = {}
    if (ANALYZE) testEvn.ANALYZE = ANALYZE
    if (PAGE) testEvn.PAGE = PAGE
    return testEvn
  }
)

describe(`${pkg.name} ${pkg.version} thx-scripts start ${appPath}`, function () {
  this.timeout(1 * 30 * 1000)

  DEV_ENV_MAP_LIST.forEach((testEnv, index) => {
    const counter = `${index + 1}/${DEV_ENV_MAP_LIST.length}`
    const cmd = Object.entries(testEnv).map(([name, value]) => `${name}=${value}`).join(' ') + ' thx-scripts start'
    it(`${counter} ${cmd}`, async function () {
      await killDevServer(testEnv)
      await delay(1 * 1000)

      const args = [].join(' ').split(' ')
      const subprocess = spawn('thx-scripts', ['start', ...args], { ...options, env: { ...options.env, ...testEnv } })
      const LOG_PREFIX = `      ${gray('[it]')} ${bgBlueBright.whiteBright`[PID ${subprocess.pid}]`}`
      console.log(LOG_PREFIX, '$', blueBright(cmd))

      await delay(3 * 1000)
      await validDevServer(testEnv, () => {}, LOG_PREFIX)

      expect(subprocess.kill(0)).to.be.equal(true)
      await delay(1 * 1000)
    })
  })
})

describe(`${pkg.name} ${pkg.version} thx-scripts build ${appPath}`, function () {
  this.timeout(1 * 30 * 1000)

  BUILD_ENV_MAP_LIST.forEach((testEnv, index) => {
    const counter = `${index + 1}/${DEV_ENV_MAP_LIST.length}`
    const cmd = Object.entries(testEnv).map(([name, value]) => `${name}=${value}`).join(' ') + ' thx-scripts build'
    it(`${counter} ${cmd}`, async function () {
      const args = [].join(' ').split(' ')
      const subprocess = spawn('thx-scripts', ['build', ...args], { ...options, env: { ...options.env, ...testEnv } })
      const LOG_PREFIX = `      ${gray('[it]')} ${bgBlueBright.whiteBright`[PID ${subprocess.pid}]`}`
      console.log(LOG_PREFIX, '$', blueBright(cmd))

      return new Promise((resolve) => {
        validSubProcess(subprocess, options, () => {
          resolve()
        })
      })
    })
  })
})
