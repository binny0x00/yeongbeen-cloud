import * as content from './content'
import * as engagement from './engagement'
import * as identity from './identity'
import * as operations from './operations'

export * from './content'
export * from './engagement'
export * from './identity'
export * from './operations'

export const schema = { ...content, ...engagement, ...identity, ...operations }
