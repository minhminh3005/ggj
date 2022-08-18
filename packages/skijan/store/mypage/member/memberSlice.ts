import http, { appendGgjHeader } from 'common/http'
import { NextRequest } from 'next/server'
export const getAllMember = async (req: NextRequest) => {
  const {data} = await http.get('/api/skijan/v1/mypage/member', {
    headers: appendGgjHeader({req})
  })
  return data
} 
export const updateMember = async (status: boolean, type: string) => {
  const {data} = await http.put(`/api/skijan/v1/mypage/member/${type}/${status}`)
  return data
}  