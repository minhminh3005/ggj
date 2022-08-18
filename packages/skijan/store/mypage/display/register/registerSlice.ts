import http, {appendGgjHeader} from 'common/http'
import {NextRequest} from 'next/server'

export const getTerms = async (req: NextRequest) => {
  const { data } = await http.get(
    '/api/skijan/v1/mypage/display/register/seller',{
      headers: appendGgjHeader({req})
    }
  )
  return data
}

export const registerSeller = async () => {
  return await http.put('/api/skijan/v1/mypage/display/register/seller')
}
