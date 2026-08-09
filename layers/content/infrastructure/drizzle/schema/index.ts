import * as content from './content'
import * as identity from './identity'
import * as operations from './operations'

export * from './content'
export * from './identity'
export * from './operations'

export const schema = { ...content, ...identity, ...operations }
