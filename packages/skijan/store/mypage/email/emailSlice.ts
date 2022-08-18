import http, { appendGgjHeader } from 'common/http'
import { NextRequest } from 'next/server'
interface EmailSettingPayload {
    isDelivery: boolean;
    categoryId: number;
    settingType: string;
}
export const settingNotify = async (payload: EmailSettingPayload) => {
  const {data} = await http.put('/api/skijan/v1/mypage/email/setting/notification', payload)
  return data
} 
export const getAllEmail = async (req: NextRequest) => {
  const {data} = await http.get('/api/skijan/v1/mypage/email/setting/notification', {
    headers: appendGgjHeader({req})
  })
  return data
} 