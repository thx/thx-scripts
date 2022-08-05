import { getEntry } from '../shared/getEntry'

const { PAGE } = process.env

const pages: any = getEntry(PAGE)
// logger.debug(PAGE, '=>', pages)

export default pages
