import http, { appendGgjHeader } from 'common/http'
import { NextRequest } from 'next/server'

export interface InformationParams {
  oldPublishedAt: number | null
  newPublishedAt: number | null
  publishedStartAt?: number | null
  publishedEndAt?: number | null
}

export const getInformationById = async (id: string, req: NextRequest) => {
  const { data } = await http.get(`/api/skijan/v1/information/${id}`, {
    headers: req && appendGgjHeader({ req }),
  })
  return data
}

export const getInformation = async (params?: InformationParams) => {
  const { data } = await http.get('/api/skijan/v1/information', { params })
  return data
}
