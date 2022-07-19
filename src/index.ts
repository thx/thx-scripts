#!/usr/bin/env node
import { SpawnOptions } from 'child_process'
import { bold } from 'chalk'
import logger from './logger'
const pkg = require('../package.json')

process.on('unhandledRejection', err => {
  throw err
})

logger.info('process.env', process.env)
logger.info(bold(`${pkg.name} run v${pkg.version}`))
console.log(bold(`${pkg.name} run v${pkg.version}`))

const { VITE }: any = process.env

const spawn = require('cross-spawn')
const args = process.argv.slice(2)

const scriptIndex = args.findIndex(
  x => x === 'start' || x === 'build' || x === 'dev'
)
const script = scriptIndex === -1 ? args[0] : args[scriptIndex]
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : []

if (['start', 'build', 'dev'].includes(script)) {
  const options: SpawnOptions = {
    stdio: 'inherit'
  }
  switch (script) {
    case 'start':
    case 'dev':
      options.env = {
        ...process.env,
        BABEL_ENV: 'development',
        NODE_ENV: 'development'
      }
      break
    case 'build':
      options.env = {
        ...process.env,
        BABEL_ENV: 'production',
        NODE_ENV: 'production'
      }
      break
  }

  const result = spawn.sync(
    'node',
    nodeArgs
      .concat(require.resolve((VITE ? './vite/' : './') + script))
      .concat(args.slice(scriptIndex + 1)),
    options
  )
  if (result.signal) {
    if (result.signal === 'SIGKILL') {
      console.log(
        'The build failed because the process exited too early. ' +
          'This probably means the system ran out of memory or someone called ' +
          '`kill -9` on the process.'
      )
    }
    if (result.signal === 'SIGTERM') {
      console.log(
        'The build failed because the process exited too early. ' +
          'Someone might have called `kill` or `killall`, or the system could ' +
          'be shutting down.'
      )
    }
    process.exit(1)
  }
  process.exit(result.status)
} else {
  console.log(`Unknown script "${script}".`)
  console.log('Perhaps you need to update thx-scripts?')
  console.log(
    'See: https://github.com/thx/thx-scripts/releases'
  )
}
