import http from 'common/http'

export const getCategories = async () => {
  return await http.get('/api/skijan/v1/faq/categories-large')
}

export const getFaqDetail = async (id: string) => {
  return await http.get(`/api/skijan/v1/faq/${id}`)
}
