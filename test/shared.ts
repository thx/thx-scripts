import * as fse from 'fs-extra'
import { join } from 'path'
import { ChildProcess, SpawnOptions, SpawnSyncReturns } from 'child_process'
import { expect } from 'chai'

export const PLAYGROUND = join(__dirname, '../.playground')
if (!fse.pathExistsSync(PLAYGROUND)) fse.mkdirSync(PLAYGROUND)

export const EXAMPLE_REACT = join(__dirname, '../examples/react-app')

export const SPAWN_OPTIONS: SpawnOptions = {
  stdio: 'ignore', // 'pipe',
  cwd: PLAYGROUND,
  env: { ...process.env, FORCE_COLOR: '1' }
}

export const validSubProcess = (subprocess: ChildProcess, options: SpawnOptions, done) => {
  if (subprocess.stdout) {
    subprocess.stdout.on('data', chunk => console.log(chunk.toString().replace(/[\n\r]+$/g, '')))
    subprocess.stdout.on('error', (error) => {
      if (error) console.error(error)
      expect(error).to.be.eq(undefined)
    })
    subprocess.stdout.on('close', () => console.log('==> stdout close'))
    subprocess.stdout.on('end', () => console.log('==> stdout end'))
  }
  subprocess.on('message', (message) => console.log('==> message', message))
  subprocess.on('error', (error) => {
    if (error) console.error(error)
    expect(error).to.be.eq(undefined)
  })
  subprocess.on('exit', (code) => {
    expect(code).to.be.oneOf([null, 0])
  })
  subprocess.on('close', (code) => {
    expect(code).to.be.oneOf([null, 0])
    done()
  })
}

export const validSpawnSyncResult = (result: SpawnSyncReturns<Buffer>) => {
  // stdout
  expect(result.stdout.toString()).to.not.be.eq('')
  // stderr
  expect(result.stderr.toString()).to.be.eq('')
  // error
  expect(result.error).to.be.eq(undefined)
  // status
  expect(result.status).to.be.eq(0)
}

export async function delay (ms: number) {
  await new Promise((resolve) => {
    setTimeout(() => resolve(undefined), ms)
  })
}
