import * as fs from 'fs'

/**
 * 读取 JSON 文件
 * @param  {String} file
 * @return {Mixed}
 *  - null: read json failed
 */
export function readJSON (file: string) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (err) {
    console.error(`读取失败 ${file}`)
    console.error(err)
    return null
  }
}
