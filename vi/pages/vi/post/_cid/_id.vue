<template>
  <IdComp :data="data" :cid="cid" />
</template>
<script>
import title from '@@/../common/pages'
import { editCss, filterInt } from '@/utils/client/common'
import IdComp from '@@/../components/post/_cid/IdComp.vue'

const obj = Object.assign(
  {
    validate({ params }) {
      return !isNaN(filterInt(params.cid)) && !isNaN(filterInt(params.id))
    },
    components: {
      IdComp
    },
    async asyncData({ app, params, error, store }) {
      let data = await app.GoGoHTTP.get(
        `/api/v3/surface/lecture/${params.cid}/${params.id}`
      )
      if (!data || !Object.keys(data).length) {
        return error({ statusCode: 404 })
      }
      if (data.code) {
        return error({ statusCode: 404, exists: data.exists })
      }
      if (params.id != 15356 && (data.Content || '').indexOf('<style type="text/css">') !== -1) {
        data.Content = editCss(data.Content, '.post-IbBKtrbLMt')
      }
      store.commit('pushBC', {
        name: 'Top',
        path: '/vi',
      })
      store.commit('pushBC', {
        name: data.Title,
        // target: { name: 'post-cid-id', params: params },
        path: `/vi/post/${params.cid}/${params.id}`
      })
      return {
        data,
        titleChunk: data.Title,
        cid: params.cid,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/vi/post/${params.cid}/${
              params.id
            }`,
          },
        ],
      }
    },
  },
  title
)
export default obj
</script>
