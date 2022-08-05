import { resolveModule, resolveApp, resolvePage, resolvePageName } from './resolveModule'
import getAppConfig from './getAppConfig'
import { Entry } from 'webpack'
import { Configuration } from 'webpack/types'
import { blueBright, cyanBright, yellowBright } from 'chalk'

const DEFAULT_ENTRY = {
  index: resolveModule(resolveApp, 'src/index')
}
const appConfig = getAppConfig()

export function getEntry (page: undefined | string | Array<string>, appConfigItem?: Configuration): Entry {
  if (!page) {
    // 2022.3.17 支持多个 webpack 配置实例
    if (appConfigItem) {
      if (appConfigItem.entry) return appConfigItem.entry
      return DEFAULT_ENTRY
    }
    if (appConfig.entry) return appConfig.entry
    return DEFAULT_ENTRY
  }

  let parts: Array<string> = []
  // [page1, page2]
  if (Array.isArray(page)) parts = page
  // page1,page2 => [page1, page2]
  if (typeof page === 'string') parts = page.split(',').map(part => part.trim())

  const result: Entry = {}
  parts.forEach(part => {
    const path = resolvePage(resolveApp, part)
    if (path === undefined) {
      console.warn(yellowBright(`💡 找不到 ${cyanBright(part)} 对应的页面，请检查后再试！`))
      console.log(`ⓘ  你可以执行 ${blueBright('mm pages')} 查看所有有效页面。`)
      process.exit(1)
    }
    result[resolvePageName(part)] = path
  })
  return result
}
