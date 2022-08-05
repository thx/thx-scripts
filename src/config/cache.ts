import { Configuration } from 'webpack/types'

const { NODE_ENV } = process.env

const config: Configuration = {
  // 在生产环境中，关闭缓存
  cache: NODE_ENV === 'development' ? {
    type: 'filesystem'
  } : false
}

export default config
