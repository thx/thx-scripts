// import { readFileSync } from 'fs'
// import { join } from 'path'
// import * as JSON5 from 'json5'
import { Configuration } from 'webpack/types'
import { getAppPath, getAppRC } from '../utils'

export default function getAppConfig (): Configuration {
  const appPath = getAppPath()
  const appRC = getAppRC(appPath)
  if (appRC) {
    return appRC['thx-scripts'] || appRC['mm-scripts'] || appRC.webpack || {}
  }

  return {}
}
