<template>
  <section class="w-1000 flex space-between">
    <div class="left-content">
      <div class="flex mid mb-20">
        <span class="title">
          <b>
            {{ title }}
          </b>
        </span>
      </div>
      <div class="flex flex-wrap">
        <ProductVertical v-for="product in dataShow.data" :key="'new-product-' + product.id" :product="product" class="bg-prd-new mr-10 mb-10" />
      </div>
      <div class="text-center mb-40">
        <paging :cur-page="dataShow.currentPage"
                :total="dataShow.lastPage"
                :from="dataShow.pagingFrom"
                :to="dataShow.pagingTo"
                :has-scroll="true"
                :is-add-url-param="true"
                :origin-url="originUrl"
                theme-class="theme4"
                @pagingclick="onGetDataPage"
        />
      </div>
    </div>
    <slot class="right-content p-15" name="right-content"></slot>
  </section>
</template>
<script>
import ProductVertical from '@/components/product/ProductVertical.vue'
import Paging from '@@/../components/paging/Paging.vue'

export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
    originUrl: String,
    curPage: [String, Number],
    tieup: {
      type: String,
      default: '',
    },
    title: String,
  },
  components: {
    ProductVertical,
    Paging,
  },
  data() {
    return {
      dataShow: {},
    }
  },
  created() {
    this.dataShow = this.data
  },
  mounted() {
    $('.img1').css('width', '270px')
  },
  methods: {
    onGetDataPage(_page) {
      location.href = `${this.originUrl}/p/${_page}`
    },
  },
}
</script>
<style lang="scss" scoped>
.left-content {
  width: 670px;
  .icon-other {
    width: 30px;
    height: 30px;
    background: #7d7d7d;
    border-radius: 50%;
    color: white;
    font-size: 16px;
  }
  .title {
    color: #7d7d7d;
    font-size: 20px;
  }
  .bg-prd-new:nth-child(4n) {
    margin-right: 0;
  }
  .btc-icon {
    color: #7d7d7d;
  }
}
</style>
