import http from 'common/http'
import { ParsedUrlQuery } from 'querystring'
import {searchLimit, SL} from '../components/pages/search/consts'

export const getSearchResults = async (params: ParsedUrlQuery) => {
  const {data} = await http.get('/api/skijan/v1/search', {
    params: {
      [SL]: searchLimit,
      ...params
    },
  })
  return data
}
