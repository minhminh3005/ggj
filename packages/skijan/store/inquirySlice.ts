import { NextRequest } from 'next/server'
import http, { appendGgjHeader } from 'common/http'

interface InquiryPayload {
  name?: string
  email?: string
  categoryLargeId: number
  content?: string
}

export async function sendInquiryForm(payload: InquiryPayload) {
  return await http.post('/api/skijan/v1/inquiry', payload)
}

export async function getInquirycategories() {
  return await http.get('/api/skijan/v1/inquiry/categories-large')
}

export async function getUserInfo(req: NextRequest) {
  return await http.get('/api/skijan/v1/inquiry/user-info', {
    headers: appendGgjHeader({ req }),
  })
}
