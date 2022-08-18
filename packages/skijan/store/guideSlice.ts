import { TGgjRes } from 'app'
import http from 'common/http'

export const getAllGuideByID = async (id: string) => {
  const {data} = await http.get<TGgjRes<unknown>>(`/api/skijan/v1/guide/${id}`)
  return data
} 