import http from 'common/http'
interface EmailSettingPayload {
    isDelivery: boolean;
    categoryId: number;
    settingType: string;
}
export const settingNotify = async (payload: EmailSettingPayload) => {
  const {data} = await http.put('/api/skijan/v1/email/setting/notification', payload)
  return data
} 
export const getAllEmail = async () => {
  const {data} = await http.get('/api/skijan/v1/email/setting/notification')
  return data
} 