import { getAppPath, getAppPkg, getGitBranchVersion } from '../utils'

const formatModuleFederationName = (str: string) => str.replace(/[^a-zA-Z\d]/g, '_').replace(/^(\d)/, '_$1')

export default function getModuleFederationLibrary (appPath?: string) {
  if (!appPath) appPath = getAppPath()

  const appPkg = getAppPkg(appPath)
  const appName = appPkg.name // appPkg.name.replace(/[@/-]/g, '_')
  const appVersion = appPkg.version
  const branchVersion = getGitBranchVersion(appPath)
  return formatModuleFederationName(`${appName}/${branchVersion || appVersion}`)
}
