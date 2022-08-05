export function getLength (target: any) {
  if (target === undefined) target = 'undefined'
  if (typeof target !== 'string') target = target.toString()
  const rcjk =
    /[\u2E80-\u2EFF\u2F00-\u2FDF\u3000-\u303F\u31C0-\u31EF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FBF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF]+/g
  let re = 0
  for (let i = 0; i < target.length; i++) {
    if (target[i].match(rcjk)) re += 2
    else re += 1
  }
  return re
}

/** 在尾部填充空格，直到指定长度 */
export function fixLength (target: any, max: number) {
  if (target === undefined) target = 'undefined'
  if (typeof target !== 'string') target = target.toString()
  return target + new Array(max - getLength(target)).fill(' ').join('')
}

/** 在头部填充空格，直到指定长度 */
export function prefixLength (target: any, max: number) {
  if (target === undefined) target = 'undefined'
  if (typeof target !== 'string') target = target.toString()
  return new Array(max - getLength(target)).fill(' ').join('') + target
}
