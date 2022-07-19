import { describe, it, after } from 'mocha'
import { MM_PORT } from '../src/utils'
import { spawn, SpawnOptions } from 'child_process'
import fetch from 'node-fetch'
import { expect } from 'chai'
import { EXAMPLE_REACT, SPAWN_OPTIONS, validSubProcess } from './shared'
const pkg = require('../package.json')

function getNextPort () {
  return MM_PORT + parseInt(`${Math.random() * 100}`)
}

const appPath = EXAMPLE_REACT
const options: SpawnOptions = {
  ...SPAWN_OPTIONS,
  // stdio: 'inherit',
  stdio: 'pipe',
  cwd: appPath
}

const DEV_ENV_MAP_LIST = [
  { PORT: `${getNextPort()}` },
  { PORT: `${getNextPort()}`, ANALYZE: 'true' },
  { PORT: `${getNextPort()}`, ANALYZE: 'true', HTTPS: 'true' },
  { PORT: `${getNextPort()}`, ANALYZE: 'true', PAGE: 'pages/foo/index' },
  { PORT: `${getNextPort()}`, ANALYZE: 'true', PAGE: 'pages/foo/index,pages/bar/index' }
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
      this.timeout(1 * 60 * 1000)
      const args = [].join(' ').split(' ')
      const nextEnv = { ...options.env, ...testEnv }
      const subprocess = spawn('thx-scripts', ['start', ...args], { ...options, env: nextEnv })

      validSubProcess(subprocess, options, () => {})

      subprocess.on('close', (code, signal) => {
        console.log(`      [it] Subprocess ${subprocess.pid} closed`, code, signal)
        if (code === 0 || code === null) done()
      })

      setTimeout(() => {
        const fetchOptions = { headers: { accept: 'html' } }
        const url = `http${testEnv.HTTPS ? 's' : ''}://127.0.0.1:${testEnv.PORT}`
        console.log(`      [it] Try to fetch ${url}`)
        fetch(url, fetchOptions)
          .then(() => {
            console.log(`      [it] Try to kill pid ${subprocess.pid} of port ${testEnv.PORT} ...`)
            expect(subprocess.kill(0)).to.be.equal(true)
            expect(subprocess.emit('exit', 0)).to.be.equal(true)
            expect(subprocess.emit('close', 0)).to.be.equal(true)
          })
      }, 5 * 1000)
    })
  })

  BUILD_ENV_MAP_LIST.forEach(testEnv => {
    it(`$ thx-scripts build ${JSON.stringify(testEnv)}`, function (done) {
      this.timeout(1 * 60 * 1000)
      const nextEnv = { ...options.env, ...testEnv }
      const subprocess = spawn('thx-scripts', ['build'], { ...options, env: nextEnv })

      validSubProcess(subprocess, options, () => {
        done()
      })
    })
  })
})
