import { TGgjRes } from 'app'
import http, {appendGgjHeader} from 'common/http'
import {NextRequest} from 'next/server'
export const getAllSkillServiceList = async (req: NextRequest, id: number, page: number, limit: number) => {
  const {data} = await http.get<TGgjRes<unknown>>(`/api/skijan/v1/mypage/display/skill/${id}`, {
    params: {
      order: 'DESC',
      page: page,
      limit: limit,
    },
    headers: typeof window === 'undefined' ? appendGgjHeader({req}) : {}
  })
  return data
}
export const putSkillServiceList = async (id: number, payload: {statusType: number}) => {
  const {data} = await http.put(`/api/skijan/v1/mypage/display/skill/${id}`,payload)
  return data
}
