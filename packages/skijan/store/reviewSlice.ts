import http from 'common/http'

type OrderType = 'ASC' | 'DESC'

export async function getSkillServiceReview({skillId, params}: {skillId: number, params: {
  stars: number
  order?: OrderType
  page?: number
  limit?: number
}}) {
  return await http.get(`/api/skijan/v1/skill/review/${skillId}/paging`, {
    params
  })
}

export async function getSkillServiceReviewDetail({skillId}: {skillId: number}) {
  return await http.get(`/api/skijan/v1/skill/review/${skillId}`)
}
