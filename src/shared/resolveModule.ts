import { resolve } from 'path'
import { realpathSync, existsSync, statSync } from 'fs'
import { APP_SRC, APP_SRC_PAGES, APP_SRC_VIEWS } from './constants'

const appPath = realpathSync(process.cwd())
export function resolveApp (relativePath: string) {
  return resolve(appPath, relativePath)
}

const MODULE_EXTENSION_LIST = [ 'js', 'jsx', 'ts', 'tsx' ]

// Resolve file paths in the same order as webpack
export function resolveModule (resolveFn, filePath: string) {
  const fullPath = resolveFn(filePath)
  if (existsSync(fullPath) && statSync(fullPath).isFile()) {
    return fullPath
  }

  const extension = MODULE_EXTENSION_LIST.find(extension =>
    existsSync(resolveFn(`${filePath}.${extension}`))
  )

  if (extension) {
    return resolveFn(`${filePath}.${extension}`)
  }

  // return resolveFn(`${filePath}.js`)
}

// pagePath:
// src/pages/home/index.[js|jsx|ts|tsx]
// src/pages/home.[js|jsx|ts|tsx]
// home
export function resolvePage (resolveFn, pagePath: string) {
  const modules = [
    // 完整的相对路径，例如 src/pages/home/index.ts、src/pages/home.ts
    pagePath,
    // 后面补充 index，
    `${pagePath}/index`,
    // 前面补充 src/pages
    `${APP_SRC_PAGES}/${pagePath}`,
    // 前面补充 src/pages，后面补充 index
    `${APP_SRC_PAGES}/${pagePath}/index`,
    // 前面补充 src/views
    `${APP_SRC_VIEWS}/${pagePath}`,
    // 前面补充 src/views，后面补充 index
    `${APP_SRC_VIEWS}/${pagePath}/index`,
    // 前面补充 src
    `${APP_SRC}/${pagePath}`,
    // 前面补充 src，后面补充 index
    `${APP_SRC}/${pagePath}/index`
  ]
  for (const relativePath of modules) {
    const fullPath = resolveModule(resolveFn, relativePath)
    if (fullPath) return fullPath
  }
  // @deprecated 下面的查找逻辑，将在下次发布时移除。
  console.trace(`@deprecated 可能传入了不合法的模块路径 ${pagePath}，请检查修改后再次执行构建。如果误报请忽略。`)
  return resolveModule(resolveFn, pagePath) ||
    resolveModule(resolveFn, `${pagePath}/index`) ||
    resolveModule(resolveFn, `${APP_SRC_PAGES}/${pagePath}/index`) ||
    resolveModule(resolveFn, `${APP_SRC_PAGES}/${pagePath}`)
}

// 移除 src、src/pages，避免干扰构建结果的模块名（和路径）
// 2012.2.4 只移除 src，保留 pages，避免增加理解成本
export function resolvePageName (pageName: string) {
  // /^src\/(pages\/)?/mg => /^src\//mg
  return pageName.replace(/^src\//mg, '')
}
