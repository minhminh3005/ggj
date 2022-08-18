<template>
  <a :href="product.detailUrl" class="ranking-wrapp mt-5 mb-5 ml-15 mr-15">
    <div class="rank"
         v-if="rank"
         :style="{
           background: rankColor[rank] || '#474747',
           color: rankColor[rank] ? 'white' : '#FFFFFF'
         }"
    >
      {{ rank }}
    </div>
    <GoogleLineChart
      v-if="product.typeId === 1"
      class="img-chart shadow"
      :size="[56, 56]"
      :data="product.chart"
    />
    <Lzimg
      v-else
      class="product-img shadow"
      :data-src="'/img/products/' + product.id + '/small'"
      :alt="product.name + ' ' + (category || '')"
    />
    <div class="product-title pr-10">
      <div :title="product.name" class="fs-13" style="max-height: 38px;" :class="'co-rank-' + colorIndex"
           v-wrap-lines="1"
      >
        {{ product.name }}
      </div>
      <span v-if="displayPips && product.pips" class="product-pips">
        {{ formatNumber(product.pips) }} pips
      </span>
    </div>
  </a>
</template>

<script>
import Lzimg from '@@/../components/Lzimg.vue'
import GoogleLineChart from '@@/../components/charts/GoogleLineChart.vue'

export default {
  components: { Lzimg, GoogleLineChart },
  props: ['product', 'colorIndex', 'category', 'displayPips', 'rank'],
  data() {
    return {
      rankColor: {
        1: '#FFD100', // rank 1
        2: '#C0C0C0', // rank 2
        3: '#816D46' // rank 3
      },
    }
  },
  methods: {
    numberWithCommas(x) {
      const fixedNumber =  x.toFixed(1)
      return fixedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
  }
}
</script>

<style scoped lang="scss">
.ranking-wrapp {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 60px;
  border-bottom: 1px #b4b5b6 solid;
  &:hover {
    background: #f5f5f5;
    text-decoration: none;
    color: #337ab7;
  }
  &:last-child {
    border-bottom: 0;
  }
}
.product-title {
  flex: 1 1 auto;
  div:first-child {
    font-weight: bold;
    max-height: 38px;
    overflow-y: hidden;
    line-height: 19px;
  }
  .co-rank {
    &-all {
      color: #333;
    }
    &-ea {
      color: #6cb6fc;
    }
    &-etc {
      color: orange;
    }
    &-rt {
      color: #16a085;
    }
  }
  span {
    display: block;
    max-height: 34px;
    overflow-y: hidden;
    line-height: 17px;
  }
}
.product-pips {
  font-weight: bold;
  color: #f00;
}
.product-img, .img-chart {
  flex: 0 0 56px;
  margin: 0 10px;
}
.product-img {
  width: 56px;
  height: 56px;
}
.rank {
  background: purple;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  line-height: 20px;
  text-align: center;
}
</style>
