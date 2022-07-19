import { join } from 'path'
import * as os from 'os'
import * as moment from 'moment'
import * as chalk from 'chalk'

export function NOW () {
  return moment().format('HH:mm:ss.SSS') // YYYY-MM-DD
}

/**
 * Log 日志
 * 时间戳，详细日志 verbose，日志分级 [info|error|verbose]，
 * 日志颜色（链接、信息、label + value）
 * 日志颜色（链接、信息、label + value）
 */

// 日志样式 https://github.com/chalk/chalk
export const LOG_STYLE = {
  GROUP: 'inverse',
  LINK: 'underline',
  EXAMPLE: 'green',
  LABEL: 'grey',
  VALUE: 'white',
  DESC: 'grey',
  FAIL: 'red'
}

// 日志分级
export const LOG_LEVEL = {
  INFO: '[info]',
  ERROR: '[error]',
  VERBOSE: '[verbose]'
}

// 日志分组
export const LOG_GROUP = {
  SPAWN: chalk[LOG_STYLE.GROUP]('[spawn]'),
  EXEC: chalk[LOG_STYLE.GROUP]('[exec]'),
  SERVER: chalk[LOG_STYLE.GROUP]('[server]'),
  SOCKET: chalk[LOG_STYLE.GROUP]('[socket]'),
  CLIENT: '[client]',
  SYSTEM: '[system]',
  KIT: chalk[LOG_STYLE.GROUP]('[kit]'),
  PLUGIN: '[plugin]',
  GIT: '[git]'
}

/** 本地工作台 IP */
export const MM_HOST = '127.0.0.1'
/** 本地工作台 域名 */
export const MM_PORT = 6868

/** MM CLI 本地缓存目录（名称） */
export const MM_CACHE_FOLDER = '.mm' // MO TODO .rmx 排查
/** MM CLI 套件缓存目录（名称） */
export const MM_KIT_FOLDER = 'kit'
/** MM CLI 插件缓存目录（名称） */
export const MM_PLUGIN_FOLDER = 'plugin'
/** MM CLI 本地缓存配置文件（名称） */
export const MM_CONFIG_JSON = 'config.json'
/** MM CLI 本地缓存路径（完整路径） */
export const MM_HOME = join(os.homedir(), MM_CACHE_FOLDER)
/** MM CLI 运行时控制文件 .rmxrc（名称） */
export const MM_RC_FILE = '.rmxrc'
/** MM CLI 运行时控制文件名 .rmxrc.js（名称） */
export const MM_RC_JS = '.rmxrc.js'
/** MM CLI 运行时控制文件名 .rmxrc.json（名称） */
export const MM_RC_JSON = '.rmxrc.json'
/** MM CLI 远程数据缓存路径（完整路径） */
export const MM_REMOTE_CACHE_FOLDER = join(MM_HOME, 'cache')
