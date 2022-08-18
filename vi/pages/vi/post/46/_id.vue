<template>
  <IdComp :data="data" />
</template>
<script>
import title from '@@/../common/pages'
import { filterInt } from '@/utils/client/common'
import IdComp from '@@/../components/post/46/IdComp.vue'
import i18n from '@@/lang/desktop/lecture.json'

export default Object.assign(
  {
    validate({ params }) {
      return !isNaN(filterInt(params.id))
    },
    components: {
      IdComp,
    },
    i18n: {
      messages: i18n,
    },
    async asyncData({ app, params, error }) {
      let data = await app.GoGoHTTP.get(
        `/api/v3/surface/lecture/46/${params.id}`
      )
      if (!data || !Object.keys(data).length) {
        return error({ statusCode: 404 })
      }
      if (data.code) {
        return error({ statusCode: 404, exists: data.exists })
      }
      return {
        data,
        titleChunk: data.Title,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/vi/post/46/${params.id}`,
          },
        ],
      }
    },
  },
  title
)
</script>