import * as fse from 'fs-extra'
import { join } from 'path'
import { MM_RC_FILE, MM_RC_JS, MM_RC_JSON } from './constant'
import { readJSON } from './file'
import * as JSON5 from 'json5'

/** 获取应用路径 */
export function getAppPath (cwd: string = process.cwd()): string | undefined {
  const parts = cwd.split('/')
  while (parts.length) {
    const path = [...parts, 'package.json'].join('/')
    if (fse.pathExistsSync(path)) {
      return parts.join('/')
    }
    parts.pop()
  }
}

export interface IPackage {
  name: string;
  version: string;
  description: string;
  scripts?: any;
  dependencies?: any;
  devDependencies?: any;
  standard?: any;
  standardx?: any;
  contributors?: Array<any>;
}

/** 获取应用的 package.json */
export function getAppPkg (appPath: string = process.cwd()): IPackage {
  let appPkg: any = {}
  const appPkgPath = join(appPath, 'package.json')
  if (fse.pathExistsSync(appPkgPath)) {
    appPkg = readJSON(appPkgPath)
  }
  return appPkg
}

/** App Runtime Configuration */
export interface IAppRC {
  /** Webpack 配置 */
  webpack?: any;
  /** 指定依赖的远程应用 */
  __unstable_module_federation_remotes: any;
  /** 默认开启 Webpack 5 ModuleFederationPlugin。值为 false 时禁用。 */
  __unstable_module_federation?: false;
  /** 应用自定义代理服务 */
  __unstable_dev_server_before?: Function;
  __unstable_dev_server_proxy?: any;
  /** 环境变量 */
  __unstable_env?: {
    [key: string]: string;
  };
  /** 默认关闭 Webpack HtmlWebpackPlugin。值为 true 时启用。 */
  __unstable_html_webpack_plugin?: true | undefined;
  /** 默认自动在浏览器中打开本地服务。值为 false 时禁用。 */
  __unstable_auto_open?: false | undefined;
  /** @deprecated 支持 RAP2 场景代理，临时过渡方案。 */
  __unstable_rap2_scene_proxy?: {
    [key: string]: string
  };
}

export function getAppRC (appPath = process.cwd()): IAppRC | undefined {
  // 读取 RC 配置时，优先读取 .rmxrc.js，因为可能同时存在 .rmxrc 和 .rmxrc.js
  // .rmxrc.js JS Module
  try {
    if (fse.existsSync(join(appPath, MM_RC_JS))) {
      const rc = require(join(appPath, MM_RC_JS))
      return rc.__esModule ? rc.default : rc
    }
  } catch (error) {
    // 输出错误日志，用于辅助判断 MM_RC_JS 是否正常。
    console.error(error)
  }

  // .rmxrc JSON
  try {
    return fse.readJSONSync(join(appPath, MM_RC_FILE))
  } catch (error) { }

  // .rmxrc JSON for Humans
  try {
    return JSON5.parse(fse.readFileSync(join(appPath, MM_RC_FILE), 'utf8'))
  } catch (error) { }

  // .rmxrc JS Module
  try {
    const rc = require(join(appPath, MM_RC_FILE))
    return rc.__esModule ? rc.default : rc
  } catch (error) { }

  // .rmxrc.json JSON
  try {
    return fse.readJSONSync(join(appPath, MM_RC_JSON))
  } catch (error) { }

  // .rmxrc.json JSON for Humans
  try {
    return JSON5.parse(fse.readFileSync(join(appPath, MM_RC_JSON), 'utf8'))
  } catch (error) { }
}
