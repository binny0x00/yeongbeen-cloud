import { getAuth } from '../../../infrastructure/auth'

export default defineEventHandler(event => getAuth().handler(toWebRequest(event)))
