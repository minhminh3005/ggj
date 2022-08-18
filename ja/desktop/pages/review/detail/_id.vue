<template>
  <div class="review-detail">
    <h2>{{ productInfo.name }}</h2>
    <!-- 1. product info + cart area -->
    <LazyComp01 :timeout="1e3" min-height="250px">
      <ReviewProductInfo />
    </LazyComp01>

    <!-- 2. review form + review button -->
    <LazyComp01 :timeout="2e3" min-height="55px">
      <ReviewForm class="mt-30" />
    </LazyComp01>

    <!-- 3. search bar, sort bar + list of reviews -->
    <LazyComp01 :timeout="3e3" min-height="250px">
      <ReviewList class="mt-20" />
    </LazyComp01>

    <!-- 4. sliders -->
    <div class="mt-20">
      <ReviewSliders />
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/review-index-new.json'
import ReviewProductInfo from '@/components/review2/ReviewProductInfo.vue'
import ReviewForm from '@/components/review2/ReviewForm.vue'
import ReviewList from '@/components/review2/ReviewList.vue'
import ReviewSliders from '@/components/review2/ReviewSliders'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import { filterInt } from '@/utils/client/common'
import title from '@@/../common/pages'
const obj = Object.assign({
  validate({ params }) {
    return !isNaN(filterInt(params.id))
  },
  i18n: {
    messages: i18n,
  },
  components: {
    ReviewProductInfo,
    ReviewForm,
    ReviewList,
    ReviewSliders,
    LazyComp01,
  },
  computed: {
    titleChunk() {
      return this.$t('10',{productName: this.productInfo.name})
    },
  },
  async asyncData({ app, params, error, store }) {
    let productInfo = await app.GoGoHTTP.get(`/api/v3/surface/review/product/${params.id}/info`)
    if (!productInfo || !Object.keys(productInfo).length) {
      return error({ statusCode: 404 })
    }

    // init stores
    store.commit('review-detail/productInfo', productInfo)
    store.commit('cart/setInfo', {
      info: productInfo.cartInfo,
      productStatus: productInfo.passwordStatus || null,
      isPassword: productInfo.isPassword,
    })
    store.commit('pushBC', {
      name: (i18n[app.i18n.locale]['46'] || '').replace('{productName}', productInfo.name),
      path: `/review/detail/${params.id}`
    })

    // 
    return {
      productInfo,
      params,
      linkMeta: [
        {
          rel: 'canonical',
          href: `https://www.gogojungle.co.jp/review/detail/${params.id}`,
        },
      ],
    }
  },
  methods: {
    descriptionTemplate() {
      return (this.productInfo.description || '').slice(0, 300)
    },
  },
}, title)
export default obj
</script>

<style lang="less" scoped>
.review-detail {
  min-height: 900px;
  width: 100%;
  max-width: 1000px;
  margin: auto;
  padding: 10px;
  @media only screen and (min-width: @screen-md) {
    padding: 0;
  }
}
</style>