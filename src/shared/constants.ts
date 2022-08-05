import { join } from 'path'

export const APP_SRC = 'src'
export const APP_SRC_PAGES = join(APP_SRC, 'pages')
export const APP_SRC_VIEWS = join(APP_SRC, 'views')

export const ENV_VAR_LABEL_LENGTH = 12
export const ENV_VAR_MAP = {
  PAGE: 'PAGE',
  PORT: 'PORT',
  HTTPS: 'HTTPS',
  PROXY_IP: 'PROXY_IP',
  PROXY_HOST: 'PROXY_HOST',
  PROXY_HTTPS: 'PROXY_HTTPS',
  PROXY_PORT: 'PROXY_PORT',
  MOCK: 'MOCK',
  RAP_ID: 'RAP_ID',
  ANALYZE: 'ANALYZE',
  ANALYZE_PORT: 'ANALYZE_PORT'
}
