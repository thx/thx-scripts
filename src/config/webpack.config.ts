import { Configuration } from 'webpack/types'

import module from './module'
import plugins from './plugins'
import stats from './stats'
import externals from './externals'
import resolve from './resolve'
import watch from './watch'
import extra from './extra'
import cache from './cache'

import entry from './entry'
import output from './output'

const config: Configuration = {
  entry,
  ...output,
  ...module,
  plugins,
  externals,
  resolve,
  stats,
  ...watch,
  ...extra,
  ...cache
}

export default config
