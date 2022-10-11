import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { getAppPath } from '.'

/** 是否已初始化 git */
export function hasGit (appPath = __dirname) {
  return existsSync(join(appPath, '.git'))
}

/** 获取当前分支名称 */
export function getGitBranch (appPath: string = __dirname) {
  if (!hasGit(appPath)) return undefined
  try {
    // ref: refs/heads/daily/0.0.1
    const head = readFileSync(join(appPath, '.git/HEAD'), 'utf-8').trim()
    if (head) {
      return head.split(':')[1].trim().replace('refs/heads/', '')
    }
  } catch (e) {
    return undefined
  }
  return undefined
}

/** 获取当前分支中的版本号 */
export function getGitBranchVersion (appPath: string = __dirname) {
  if (!hasGit(appPath)) return undefined
  try {
    const branch = getGitBranch(appPath)
    const branchVersion = branch.split('/')[1]
    return branchVersion
  } catch (e) {
    return undefined
  }
}

export function _test_ () {
  console.time('test')
  const appPath = getAppPath()
  console.log('hasGit()', hasGit(appPath))
  console.log('getGitBranch()', getGitBranch(appPath))
  console.log('getGitBranchVersion()', getGitBranchVersion(appPath))
  console.timeEnd('test')
}

// _test_()
