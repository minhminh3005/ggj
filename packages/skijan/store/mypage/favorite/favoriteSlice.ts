import http, { appendGgjHeader } from 'common/http'
import { NextRequest } from 'next/server'
export const getAllFavorite = async (page: number, limit: number, req?: NextRequest) => {
  const {data} = await http.get('/api/skijan/v1/mypage/favorite', {
    headers: req && appendGgjHeader({req}),
    params: {
      order: 'ASC',
      page: page,
      limit: limit,
    }
  })
  return data
} 
export const deleteProductBySkillId = async (skillId: number) => {
  const {data} = await http.delete(`/api/skijan/v1/mypage/favorite/skill/${skillId}`)
  return data
} 