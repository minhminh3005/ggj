<template>
  <section class="main">
    <!-- recent review products-->
    <div class="min-height-recent" v-if="!forwardDataLoaded || rPLength()">
      <div class="title-1 pl-sm-15">{{ $t(43) }}</div>
      <LazyComp01 min-height="100px" classes="list-1 recent-list" v-if="rPLength()">
        <ProductHorizontal class="pr-product" v-for="(item, index) in showItems((topData || {}).recentProducts, 9)" :key="'pr-product-' + index"
                           :product="item" :disable-rate="false" :show-description="false"
                           :is-vertical-price="true"
                           :show-percent="true"
                           :show-rate="true"
        />
      </LazyComp01>
    </div>
    <!-- new systemtrade -->
    <div class="content-2" :class="{'no-border-top': rPLength() === 0}">
      <div class="small-title">{{ $t(44) }}</div>
      <div class="title-1">{{ $t(45) }}</div>
      <LazyComp01 min-height="250px" :classes="'min-height-grid'" class="list-2">
        <ProductVertical :product="i" v-for="(i, key) in (topData.newProduct || {}).systemTrade || []"
                         :key="'slider2' + key"
                         :is-vertical-price="true"
                         :theme="'theme-01'"
                         :show-percent="true"
                         :small-img="false"
        />
      </LazyComp01>
      <ShowMore
        class="fs-12 mt-5"
        :text="$t('30')"
        target="/systemtrade/newproduct"
      />
    </div>
    <!-- new indicator -->
    <div class="content-2">
      <div class="small-title">{{ $t(46) }}</div>
      <div class="title-1">{{ $t(47) }}</div>
      <LazyComp01 min-height="250px" :classes="'min-height-grid'" class="list-2">
        <ProductVertical :product="i" v-for="(i, key) in (topData.newProduct || {}).indicator || []"
                         :key="'slider2' + key"
                         :is-vertical-price="true"
                         :theme="'theme-01'"
                         :show-percent="true"
                         :small-img="false"
        />
      </LazyComp01>
      <ShowMore
        class="fs-12 mt-5"
        :text="$t('30')"
        target="/tools/new"
      />
    </div>
    <!-- new navi -->
    <div class="content-2">
      <div class="small-title">{{ $t(48) }}</div>
      <div class="title-1">{{ $t(49) }}</div>
      <LazyComp01 min-height="515px" :classes="'min-height-navi'" class="list-3">
        <ProductNaviItem v-for="(item, index) in (topData.newProduct || {}).navi || []"
                         :item="item"
                         :rank="index + 1"
                         :key="'newpd' + index" :img-index="index + 1"
                         :theme="'theme-01'"
        />
      </LazyComp01>
      <ShowMore
        class="fs-12 mt-5"
        :text="$t('30')"
        target="/finance/navi"
      />
    </div>
    <!-- real Fx Ranking  -->
    <div class="content-2">
      <div class="small-title">{{ $t(58) }}</div>
      <div class="title-1">{{ $t(50) }}</div>
      <LazyComp01 min-height="270px" class="list-4 list-ranking">
        <ProductRankHorizontalTop v-for="(item,index) in (topData || {}).realFxRanking || []"
                                  :key="'realFx'+index" :img-index="index + 1"
                                  :product="item"
                                  :display-pips="true"
                                  :theme="'theme-01'"
                                  :rank="index + 1"
                                  :color-index="selectedRank"
        />
      </LazyComp01>
      <ShowMore
        class="fs-12 mt-5"
        :text="$t('30')"
        target="/systemtrade/realasset"
      />
    </div>
    <!-- products ranking -->
    <div class="content-2">
      <div class="title-1 mt-20">{{ $t(51) }}</div>
      <LazyComp01 min-height="310px" class="list-1 list-ranking recent-list">
        <ProductHorizontal class="pr-product" v-for="(item,index) in showItems((topData || {}).allProductsRanking, 9)" :key="'pr-product-' + index"
                           :product="item" :disable-rate="false" :show-description="false"
                           :is-vertical-price="true"
                           :show-percent="true"
                           :rank="index+1"
                           :show-top-rank="true"
        />
      </LazyComp01>
    </div>
    <!-- sold -->
    <div v-if="((topData || {}).sold || []).length" class="content-2">
      <div class="title-1 mt-20">{{ $t(52) }}</div>
      <LazyComp01 min-height="192px" class="list-5">
        <div class="list-5-item" v-for="(item, index) in (topData || {}).sold || []" :key="'pr-product-' + index">
          <div class="time-ago">
            <small>{{ item.typeName }}</small>
            <small>{{ item.minutesAgo }}{{ $t(53) }}</small>
          </div>
          <ProductHorizontal class="pr-product"
                             :product="item" :disable-rate="false" :show-description="false"
                             :is-vertical-price="true"
                             :show-percent="true"
                             :show-time="true"
          />
        </div>
      </LazyComp01>
    </div>
    <!-- pr -->
    <div class="content-3 pr-wrapper">
      <div class="title-1 mt-20">{{ $t(54) }}</div>
      <LazyComp01 min-height="192px" class="list-4 pr-list">
        <ProductHorizontal class="pr-product" v-for="(item, index) in (topData || {}).pr || []" :key="'pr-product-' + index"
                           :product="item" :disable-rate="false" :show-description="false"
                           :is-vertical-price="true"
                           :show-percent="true"
                           :show-rate="true"
        />
      </LazyComp01>
    </div>
    <!-- menu grid -->
    <div class="content-4 mb-30">
      <div class="title-1">{{ $t(55) }}</div>
      <LazyComp01 min-height="405px">
        <MenuGrid />
      </LazyComp01>
    </div>
    <!-- skill Share RP -->
    <LazyComp01 min-height="686px" :classes="'min-height-cate'" v-if="showCategories()">
      <div class="title-1 title-border-top pt-20 mb-20 mx-sm-15">{{ $t(56) }}</div>
      <div v-for="(item, index) in (topData || {}).skillShareRP || []" :key="'pr-product-' + index">
        <div class="content-2" :class="{'no-border-top': index == 0 || !showCate((item || {}).data || []) }" v-if="showCate((item || {}).data || [])">
          <div class="title-1 mt-20">{{ item.id === 3 ? $t(59) : item.name }}</div>
          <div class="list-6">
            <ProductVertical :product="i" v-for="(i, key) in showItems((item || {}).data, 6)"
                             :key="'slider2' + key"
                             :is-vertical-price="true"
                             :theme="'theme-01'"
                             :show-percent="true"
                             :small-img="false"
            />
          </div>
          <ShowMore
            class="fs-12 mt-5"
            :text="$t('30')"
            :target="`/tools/search?large=${item.id}`"
          />
        </div>
      </div>
    </LazyComp01>
    <!-- categories -->
    <div class="content-2 categories-list">
      <div class="title-1 mt-20">{{ $t(57) }}</div>
      <LazyComp01 min-height="660px">
        <CategoryList :skill-share="(topData || {}).skillShareRPCount || []" />
      </LazyComp01>
    </div>
  </section>
</template>

<script>
import Home from '@/js/index.js'
export default Home
</script>

<style lang="scss" scoped>
@import "@@/../common/assets/variables.scss";
$margin-sm: 10px;
.main {
  width: 100%;
  margin: 0 auto;
}
.min-height-grid {
  min-height: 850px !important;
}
.min-height-navi {
  min-height: 530px !important;
}
.min-height-recent {
  min-height: 100px !important;
}
.min-height-cate {
  min-height: 384px !important;
}
@media only screen and (min-width: $screen-lg) {
  .main {
    width: 1000px;
  }
}
@media only screen and (min-width: $screen-md) {
  .list-6 /deep/ {
    .theme-01.product-vertical {
      &:nth-child(5n) {
        display: none !important;
      }
    }
  }
}
@media only screen and (min-width: $screen-sm) {
  .title-1 {
    font-size: 21px !important;
  }
}
@media only screen and (max-width: $screen-md) {
  .list-1 {
    display: grid !important;
    grid-template-columns: repeat(3, minmax(44%, 1fr));
    row-gap: 0 !important;
    column-gap: 5% !important;
    overflow-x: auto !important;
    .pr-product /deep/ {
      width: auto !important;
    }
  }
}
@media only screen and (max-width: $screen-sm) {
  .min-height-grid {
    min-height: 550px !important;
  }
  .min-height-navi {
    min-height: 515px !important;
  }
  .min-height-cate {
    min-height: 686px !important;
  }
  .pl-sm-15 {
    padding-left: $margin-sm;
  }
  .mx-sm-15 {
    margin-left: $margin-sm;
    margin-right: $margin-sm;
  }
  .content-2 {
    margin-left: $margin-sm;
    margin-right: $margin-sm;
    .list-ranking {
      padding-left: 0 !important;
    }
    &.categories-list {
      margin-bottom: 40px;
    }
  }
  .content-4 {
    margin-left: $margin-sm;
    margin-right: $margin-sm;
  }
  .list-1 {
    .pr-product {
      margin-left: $margin-sm !important;
    }
    &.list-ranking {
      column-gap: 4% !important;
      row-gap: 0 !important;
      display: flex !important;
      .pr-product {
        width: 40% !important;
      }
    }
  }
  .list-2 /deep/ {
    grid-template-columns: repeat(auto-fill, minmax(25%, 1fr)) !important;
    grid-gap: 20px !important;
    .theme-01.product-vertical {
      &:nth-child(n+7) {
        display: none;
      }
      .product-img {
        height: 210px !important;
        width: 210px !important;
        overflow: hidden;
      }
    }
  }
  .list-6 /deep/ {
    grid-template-columns: repeat(auto-fill, minmax(25%, 1fr)) !important;
    .theme-01.product-vertical {
      &:nth-child(n+7) {
        display: none;
      }
      .product-img {
        height: 210px !important;
        width: 210px !important;
        overflow: hidden;
      }
    }
  }
  .list-3 /deep/ {
    flex-direction: column;
    .item {
      width: 100% !important;
      &:nth-child(n+6) {
        display: none;
      }
    }
  }
  .list-4 {
    .ranking-wrapp {
      width: 45% !important;
      &:nth-child(n+7) {
        display: none;
      }
    }
    .pr-product {
      width: 49% !important;
    }
    &.list-ranking {
      gap: 0;
    }
    &.pr-list {
      gap: 0;
      justify-content: space-between;
    }
  }
  .list-5 {
    gap: 0 !important;
    justify-content: space-between;
    .list-5-item {
      width: 49% !important;
      &:nth-child(n+7) {
        display: none;
      }
    }
  }
  .pr-wrapper {
    margin-left: $margin-sm;
    margin-right: $margin-sm;
  }
}
@media only screen and (max-width: $screen-xs) {
  .recent-list {
    &.list-1 {
      .pr-product {
        &:nth-child(9) {
          margin-right: -60px !important;
        }
      }
      &.list-ranking {
        .pr-product {
          &:nth-child(9) {
            width: 95% !important;
          }
        }
      }
    }
  }
  .min-height-grid {
    min-height: 250px !important;
  }
  .min-height-cate {
    min-height: 466px !important;
  }
  .list-1 {
    grid-template-columns: repeat(3, minmax(80%, 1fr)) !important;
    &.recent-list {
      .pr-product {
        &:nth-child(9) {
          margin-right: -60px !important;
        }
      }
    }
    &.list-ranking {
      .pr-product {
        width: 80% !important;
      }
    }
  }
  .list-2 /deep/ {
    .theme-01.product-vertical {
      .product-img {
        height: 100px !important;
        width: 100px !important;
        overflow: hidden;
      }
    }
  }
  .list-4 {
    flex-direction: column;
    &.list-ranking {
      height: auto !important;
    }
    .ranking-wrapp {
      width: 100% !important;
      &:nth-child(n+7) {
        display: flex !important;
      }
    }
    .pr-product {
      width: 100% !important;
    }
  }
  .list-5 {
    .list-5-item {
      width: 100% !important;
    }
  }
  .list-6 /deep/ {
    .theme-01.product-vertical {
      .product-img {
        height: 100px !important;
        width: 100px !important;
        overflow: hidden;
      }
    }
  }
}
.pr-product /deep/ {
  .product-details {
    .product-title {
      color: #000 !important;
      text-decoration: none;
    }
  }
}
/deep/ div.product-horizontal:hover {
  background: none;
  .product-title {
    text-decoration: none;
  }
  .gogo-link {
    text-decoration: none;
  }
}
.title-1 {
  font-size: 19px;
  font-weight: bold;
  margin-bottom: 20px;
}
.list-1 {
  display: flex;
  flex-wrap: wrap;
  gap: 5%;
  overflow: hidden;
  .pr-product /deep/ {
    width: 30%;
    min-height: 80px;
    padding: 0;
    margin: 10px 0 -1px 0;
    .product-details {
      border-bottom: solid 1px #c9c9c9;
    }
  }
  .product-horizontal /deep/ {
    .box-hover {
      width: 50px;
      height: 50px;
      flex: 0 0 50px;
    }
  }
  &.list-ranking {
    padding-left: 15px;
    margin-left: -8px;
  }
}
.list-2 {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18%, 1fr));
  grid-gap: 40px;
}
.list-6 /deep/ {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18%, 1fr));
  grid-gap: 20px;
  .theme-01.product-vertical {
    .product-img {
      height: 184px;
      width: 184px;
      overflow: hidden;
    }
  }
}
.list-3 {
  display: flex;
  flex-wrap: wrap;
  gap: 10%;
  /deep/ .item {
    width: 45%;
    margin-bottom: 40px;
    overflow: hidden;
    .img-wrapper {
      justify-content: center;
      min-width: 100px;
      img {
        max-width: 100px;
        max-height: 50px;
      }
    }
  }
}
.list-4 {
  display: flex;
  flex-wrap: wrap;
  gap: 5%;
  /deep/ .ranking-wrapp {
    width: 30%;
    border-bottom: none;
    margin: 10px 0;
  }
  /deep/ .product-horizontal {
    width: 30%;
    min-height: 90px;
  }
}
.list-5 {
  display: flex;
  flex-wrap: wrap;
  gap: 5%;
  .list-5-item {
    width: 30%;
    margin-bottom: 20px;
  }
  /deep/ .product-horizontal {
    margin: 10px 0;
    padding: 0;
  }
}
.list-ranking {
  flex-flow: column wrap;
  height: 270px;
  &.list-1 {
    height: 310px;
    .pr-product {
      &:nth-child(3n) {
        /deep/ .product-details {
          border-bottom: none;
        }
      }
    }
  }
}
.small-title {
  margin-top: 15px;
}
.content-2 {
  border-top: solid 1px #c9c9c9;
}
.content-3 {
  background: #eee;
  padding: 0 20px 20px 20px;
  border-radius: 20px;
  box-shadow: 0 20px 40px #00000026;
  margin-top: 30px;
  margin-bottom: 80px;
  .title-1 {
    padding-top: 20px;
  }
}
.title-border-top {
  border-top: solid 1px #c9c9c9;
}
.no-border-top {
  border-top: none;
}
/deep/ .btn-loadmore {
  color: #707070;
  span {
    background: #707070 !important;
    i.icon-cls {
      margin-left: 0 !important;
    }
  }
  margin: 20px 0 30px;
}
.time-ago {
  display: flex;
  justify-content: space-between;
  background: #eee;
  font-weight: bold;
  padding: 5px 10px;
}
.content-wrapper {
  width: 100%;
}
</style>

<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>
