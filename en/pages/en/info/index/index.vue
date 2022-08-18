<template>
  <div class="w-1000 info-8XNKw pt-30 pb-30">
    <div v-if="!(productList.data || []).length" class="text-center mt-20">
      <b>{{ $t('4') }}</b>
    </div>
    <Info
      v-for="(product, index) in productList.data"
      :year="year"
      :product="product"
      :key="index + 't1SpX'"
    />
    <div class="text-center mt-40">
      <paging
        :has-scroll="true"
        :is-add-url-param01="true"
        :cur-page="productList.currentPage"
        :total="productList.lastPage"
        :from="productList.pagingFrom"
        :to="productList.pagingTo"
        :url-param="'/info'"
        @pagingclick="getDataPaging"
      />
    </div>
  </div>
</template>

<script>
import title from '@@/../common/pages'
import inforMixin from '@@/../utils/mixins/info/index/index'

const obj = Object.assign(
  {
    mixins: [inforMixin],
  },
  title
)
export default obj
</script>


<style lang="scss" scoped>
@import '@@/../common/assets/info/info.scss';
.col1,
.col2 {
  padding: 3px 0 2px;
  border-radius: 5px;
}
</style>
