<template>
  <div>
    <ProductPanel v-if="onSalesSlice.length" :show-more="onSalesShowMore" :profit-title="$t(34)"
                  :products="onSalesSlice" :id="id"
                  :title="$t(25)" :on-load-more="onSalesShowMore ? () => onLoadMore('onSales') : undefined"
    />
    <ProductPanel v-if="postSalesSlice.length" :show-more="postSalesShowMore" :profit-title="$t(34)"
                  :products="postSalesSlice" :id="id"
                  :title="$t(27)" :on-load-more="() => onLoadMore('postSales')"
    />
    <ProductPanel v-if="preSalesSlice.length" :show-more="preSalesShowMore" :profit-title="$t(34)"
                  :products="preSalesSlice" :id="id"
                  :title="$t(38)" :on-load-more="() => onLoadMore('preSales')"
    />
    <ProductPanel v-if="prProductsSlice.length" :show-more="prProductsShowMore" :profit-title="$t(34)"
                  :products="prProductsSlice" :id="id"
                  :title="$t(28)" :on-load-more="() => onLoadMore('prProducts')"
    />
  </div>
</template>

<script>
import { getPrProduct } from '@/js/users'
import ProductPanel from '@/components/user/ProductPanel.vue'
import i18n from '@@/lang/desktop/users-id.json'

const FIRST_PAGE_LIMIT = 6
const PAGE_LIMIT = 24

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    ProductPanel,
  },
  created() {
    if (process.browser) {
      history.replaceState({}, '', location.pathname)
    }
  },
  async asyncData({ app, params, route }) {
    let id = params.id,
      products = await app.GoGoHTTP.get(
        `/api/v3/surface/profile/${params.id}/product`
      ),
      obj = {
        id,
        prProducts: [],
        prProductsSlice: [],
        prProductsShowMore: false,
        onSales: [],
        onSalesSlice: [],
        onSalesShowMore: false,
        postSales: [],
        preSales: [],
        postSalesSlice: [],
        preSalesSlice: [],
        postSalesShowMore: false,
        pagingInfo: {
          onSales: 1,
          postSales: 1,
          preSales: 1
        }
      }
      
    if (
      !(products.onSales || []).length &&
      !(products.postSales || []).length &&
      !(products.preSales || []).length
    ) {
      obj.prProducts = await getPrProduct(app)
      obj.prProductsSlice = obj.prProducts.slice(0, FIRST_PAGE_LIMIT)
      obj.prProductsShowMore = obj.prProductsSlice.length > 5
    } else {
      obj.onSales = products.onSales || []
      obj.onSalesShowMore = obj.onSales.length > 5
      if (obj.onSalesShowMore) {
        // slice the redundant sale products for sale
        obj.onSalesSlice = obj.onSales.slice(0, FIRST_PAGE_LIMIT)
      } else {
        obj.onSalesSlice = obj.onSales.slice(0)
      }

      obj.postSales = products.postSales || []
      obj.postSalesSlice = obj.postSales.slice(0, FIRST_PAGE_LIMIT)
      obj.postSalesShowMore = obj.postSalesSlice.length > 5

      obj.preSales = products.preSales || []
      obj.preSalesSlice = obj.preSales.slice(0, FIRST_PAGE_LIMIT)
      obj.preSalesShowMore = obj.preSalesSlice.length > 5
    }
    if(route.query.hasOwnProperty('notShowMore')){
      obj.onSalesSlice = [...obj.onSales]
      obj.onSalesShowMore = false
    }
    return obj
  },
  methods: {
    onLoadMore(prop) {
      this.pagingInfo[prop] += 1
      const to = FIRST_PAGE_LIMIT + (this.pagingInfo[prop] - 1) * PAGE_LIMIT
      this[`${prop}Slice`] = this[prop].slice(0, to)
      this[`${prop}ShowMore`] = this[`${prop}Slice`].length < this[prop].length
    },
  },
}
</script>
