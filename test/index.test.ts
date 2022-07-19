import { describe, it, after } from 'mocha'
import { MM_PORT } from '../src/utils'
import { spawn, SpawnOptions } from 'child_process'
import fetch from 'node-fetch'
import { expect } from 'chai'
import { EXAMPLE_REACT, SPAWN_OPTIONS, validSubProcess } from './shared'
import { gray, blueBright } from 'chalk'
import { killPort, portIsOccupied } from '../src/utils/net'
import { resolve } from 'path'
const pkg = require('../package.json')

function getNextPort () {
  return MM_PORT + parseInt(`${Math.random() * 1000}`)
}

const appPath = EXAMPLE_REACT
const options: SpawnOptions = {
  ...SPAWN_OPTIONS,
  // stdio: 'inherit',
  stdio: 'pipe',
  cwd: appPath
}

const DEV_ENV_MAP_LIST: {
  PORT: string;
  HTTPS? : 'true';
  ANALYZE? : 'true';
  ANALYZE_PORT? : string;
  MOCK? : 'true';
  RAP_ID? : string;
  RAP_HOST? : string;
  PROXY_IP? : string;
  PROXY_HOST? : string;
  PROXY_HTTPS?: 'true';
  PAGE? : string;
}[] = [
  { PORT: `${getNextPort()}` },
  { PORT: `${getNextPort()}`, HTTPS: 'true' },
  { PORT: `${getNextPort()}`, ANALYZE: 'true' },
  { PORT: `${getNextPort()}`, ANALYZE: 'true', ANALYZE_PORT: `${getNextPort()}` },
  { PORT: `${getNextPort()}`, HTTPS: 'true', ANALYZE: 'true', ANALYZE_PORT: `${getNextPort()}` },
  { PORT: `${getNextPort()}`, MOCK: 'true', RAP_ID: '5496', RAP_HOST: 'http://rap2api.alibaba-inc.com/' }, // https://rap2.alibaba-inc.com/repository/editor?id=5496&itf=152781
  { PORT: `${getNextPort()}`, PROXY_IP: '127.0.0.1', PROXY_HOST: 'test.proxy.com' },
  { PORT: `${getNextPort()}`, PROXY_IP: '127.0.0.1', PROXY_HOST: 'test.proxy.com', PROXY_HTTPS: 'true' },
  { PORT: `${getNextPort()}`, PAGE: 'pages/foo/index' },
  { PORT: `${getNextPort()}`, PAGE: 'pages/foo/index,pages/bar/index' },
  { PORT: `${getNextPort()}`, PAGE: 'pages/foo/index,pages/bar/index,pages/faz/index' }
]
const BUILD_ENV_MAP_LIST = DEV_ENV_MAP_LIST.map(
  ({ ANALYZE, PAGE }) => ({
    ANALYZE, PAGE
  })
)

describe(`${pkg.name} ${appPath}`, () => {
  after((done) => {
    done()
    process.exit(0)
  })

  DEV_ENV_MAP_LIST.forEach(testEnv => {
    it(`$ thx-scripts start ${JSON.stringify(testEnv)}`, function (done) {
      this.timeout(1 * 50 * 1000)
      const args = [].join(' ').split(' ')
      const nextEnv = { ...options.env, ...testEnv }
      // const subprocess = spawn('thx-scripts', ['start', ...args], { ...options, env: nextEnv })

      setTimeout(async () => {
        const occupied = await portIsOccupied(+testEnv.PORT)
        if (occupied) await killPort(+testEnv.PORT)

        const subprocess = spawn('thx-scripts', ['start', ...args], { ...options, env: nextEnv })

        const LOG_PREFIX = `      ${gray('[it]')} [${subprocess.pid}]`
        console.log()
        console.log()
        console.log(
          LOG_PREFIX,
          blueBright.bold(
            '$',
            Object.entries(testEnv).map(([name, value]) => `${name}=${value}`).join(' '),
            'thx-scripts start'
          )
        )

        validSubProcess(subprocess, options, () => {})

        subprocess.on('close', (code, signal) => {
          console.log(LOG_PREFIX, `Subprocess ${subprocess.pid} closed`, code, signal)
          if (code === 0 || code === null) done()
        })

        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(undefined)
          }, 5 * 1000)
        })

        if (testEnv.PORT) {
          const fetchOptions = { headers: { accept: 'html' } }
          const url = `http${testEnv.HTTPS ? 's' : ''}://127.0.0.1:${testEnv.PORT}`
          console.log(LOG_PREFIX, `[PORT] Try to fetch ${url}`)
          if (testEnv.HTTPS) process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
          await fetch(url, fetchOptions)
            .then(
              (resp) => resp.text(),
              (error) => {
                console.error(error)
                done(error)
              }
            )
            .then(
              (text) => {
                if (text) console.log(LOG_PREFIX, '[PORT]', text.length)
              }
            )
        }
        if (testEnv.ANALYZE_PORT) {
          const { ANALYZE_PORT } = testEnv
          const fetchOptions = { headers: { accept: 'html' } }
          const url = `http://127.0.0.1:${ANALYZE_PORT}`
          console.log(LOG_PREFIX, `[ANALYZE] Try to fetch ${url}`)
          await fetch(url, fetchOptions)
            .then(
              (resp) => resp.text(),
              (error) => {
                console.error(error)
                done(error)
              }
            )
            .then(
              (text) => {
                if (text) console.log(LOG_PREFIX, '[ANALYZE]', text.length)
              }
            )
        }

        console.log(LOG_PREFIX, `Try to kill pid ${subprocess.pid} of port ${testEnv.PORT} ...`)
        expect(subprocess.kill(0)).to.be.equal(true)
        // console.log(`    Try to exit`)
        // expect(subprocess.emit('exit', 0)).to.be.equal(true)
        // console.log(`    Try to close`)
        // expect(subprocess.emit('close', 0)).to.be.equal(true)
        done()

        // console.log(LOG_PREFIX, `Try to kill pid ${subprocess.pid} of port ${testEnv.PORT} ...`)
        // expect(subprocess.emit('exit', 0)).to.be.equal(true)
        // console.log('exit done')
        // expect(subprocess.emit('close', 0)).to.be.equal(true)
        // console.log('close done')
        // expect(subprocess.kill(0)).to.be.equal(true)
        // console.log('kill done')
        // done()
      }, 0)
    })
  })

  BUILD_ENV_MAP_LIST.forEach(testEnv => {
    it(`$ thx-scripts build ${JSON.stringify(testEnv)}`, function (done) {
      this.timeout(1 * 60 * 1000)
      const nextEnv = { ...options.env, ...testEnv }
      const subprocess = spawn('thx-scripts', ['build'], { ...options, env: nextEnv })
      console.log(
        '     ',
        blueBright.bold(
          '$',
          Object.entries(testEnv).map(([name, value]) => `${name}=${value}`).join(' '),
          'thx-scripts build'
        )
      )

      validSubProcess(subprocess, options, () => {
        done()
      })
    })
  })
})
