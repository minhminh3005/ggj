import http, {appendGgjHeader} from 'common/http'
import {NextRequest} from 'next/server'
export const getAllDataTop = async (req: NextRequest) => {
  return await http.get('/api/skijan/v1/index', {headers: appendGgjHeader({req})})
}
