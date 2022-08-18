<template>
  <div class="w-1000">
    <div class="slider-container">
      <div ref="slider" class="owl-carousel owl-theme">
        <a
          class="item"
          v-for="(context, i) in slider"
          :key="'context-' + i"
          :href="context.linkUrl"
        >
          <img
            :src="context.imageUrl"
            width="1000"
            height="280"
            :alt="$t('29') + ' ' + (i + 1)"
            class="shadow"
          />
        </a>
      </div>
    </div>
    <div class="list-product p-20 mt-20">
      <div class="flex mid">
        <div class="icon-other flex mid center mr-5">
          FX
        </div>
        <h2 class="title-icon m-0">
          <b>{{ $t('1') }}</b>
        </h2>
      </div>
      <div class="flex flex-wrap space-between c-bestsell ml-20 mr-20">
        <SystemProductVert
          v-for="(product, i) in bestsell || []"
          :key="product.id + i"
          :one-line="1"
          :size="[128, 128]"
          class="price-hor"
          :product="product"
          :rank="i + 1"
        />
      </div>
      <div class="flex center mt-20">
        <a class="flex mid center best-more" href="/en/systemtrade/sell/fx">
          {{ $t('3') }}
        </a>
      </div>
      <template v-if="rtRanking.length">
        <div class="flex mid mt-20">
          <div class="icon-other flex mid center mr-5">
            R
          </div>
          <h2 class="title-icon m-0">
            <b>{{ $t('32') }}</b>
          </h2>
        </div>
        <div class="flex flex-wrap space-between c-bestsell ml-20 mr-20">
          <SystemProductVert
            v-for="(product, i) in rtRanking || []"
            :key="product.id + i"
            :one-line="1"
            :size="[128, 128]"
            class="price-hor"
            :product="product"
            :rank="i + 1"
            :show-criterial="true"
          />
        </div>
        <div class="flex center mt-20">
          <a class="flex mid center best-more" href="/en/systemtrade/realasset">
            {{ $t('10') }}
          </a>
        </div>
      </template>
    </div>
    <div class="flex space-between mt-20 mb-50">
      <div class="left-content">
        <SearchArea />
        <LazyComp01 class="mt-25 pb-20" min-height="250px" @comp-ready="onSliderReady()" v-if="(sliders || []).length">
          <div class="list-product">
            <div class="flex mid p-20">
              <div class="icon-other flex mid center mr-5">
                FX
              </div>
              <h2 class="title-icon m-0">
                <b>{{ $t('Indicators') }}</b>
              </h2>
            </div>
            <div class="owl-carousel slider2 mt-20 mb-20">
              <ProductVertical :product="product" v-for="product in sliders"
                               :key="'slider-' + product.id"
                               :category="'indicators'"
              />
            </div>
            <ShowMore
              class="bg-dot"
              :text="$t('10')"
              :target="'/en/tools/indicators'"
            />
          </div>
        </LazyComp01>
        <LazyComp01 class="flex space-between" min-height="450px">
          <div style="min-height: 450px; border: 1px solid #b1b1b1; padding-top: 20px; width: 100%;">
            <BubbleChart02 :chart="rankingActive" />
          </div>
        </LazyComp01>
        <LazyComp01 class="flex space-between mt-20" min-height="450px">
          <div class="w50p list-product flex layout-col pt-20">
            <div class="flex mid ml-20 mb-10">
              <div class="icon-other flex mid center mr-5">
                %
              </div>
              <h2 class="title-icon m-0">
                <b>{{ $t('11') }}</b>
              </h2>
            </div>
            <div class="flex layout-col criterial-wrapp">
              <div
                v-for="(product, idx) in criterial.rateOf3M.data"
                :key="'rateOf3M-' + idx"
              >
                <SystemProductHor
                  :product="product"
                  class="c-rateof3m p-10"
                  :show-criterial="true"
                />
              </div>
            </div>
            <ShowMore
              class="bg-dot"
              :text="$t('10')"
              :target="'/en/systemtrade/profitrate/fx'"
            />
          </div>
          <div class="w50p list-product flex layout-col pt-20">
            <div class="flex mid ml-20 mb-10">
              <div class="icon-other icon-yen flex mid center mr-5">
                ¥
              </div>
              <h2 class="title-icon m-0">
                <b>{{ $t('12') }}</b>
              </h2>
            </div>
            <div class="flex layout-col criterial-wrapp">
              <div
                v-for="(product, idx) in criterial.amountOf3M.data"
                :key="'profitOf3M-' + idx"
              >
                <SystemProductHor
                  :product="product"
                  class="c-profitof3m p-10"
                  :show-criterial="true"
                />
              </div>
            </div>
            <ShowMore
              class="bg-dot"
              :text="$t('10')"
              :target="'/en/systemtrade/profit/fx'"
            />
          </div>
        </LazyComp01>
        <LazyComp01 class="flex space-between mt-20" min-height="450px">
          <div class="w50p list-product flex layout-col pt-20">
            <div class="flex ml-20 mb-10">
              <BalanceScale class="icon-other no-circle mr-5" />
              <div>
                <h2 class="title-icon m-0">
                  <b>{{ $t('13') }}</b>
                </h2>
                <div class="sub-title">
                  <b>{{ $t('14') }}</b>
                </div>
              </div>
            </div>
            <div class="flex layout-col criterial-wrapp">
              <div
                v-for="(product, idx) in criterial.profitOf3M.data"
                :key="'profitOf3M-' + idx"
              >
                <SystemProductHor
                  class="p-10"
                  :product="product"
                  :show-criterial="true"
                />
              </div>
            </div>
            <ShowMore
              class="bg-dot"
              :text="$t('10')"
              :target="'/en/systemtrade/profitfactor/fx'"
            />
          </div>
          <div class="w50p list-product flex layout-col pt-20">
            <div class="flex ml-20 mb-10">
              <Sync class="icon-other no-circle mr-5" />
              <div>
                <h2 class="title-icon m-0">
                  <b>{{ $t('15') }}</b>
                </h2>
                <div class="sub-title">
                  <b>{{ $t('14') }}</b>
                </div>
              </div>
            </div>
            <div class="flex layout-col criterial-wrapp">
              <div
                v-for="(product, idx) in criterial.riskOf3M.data"
                :key="'riskOf3M-' + idx"
              >
                <SystemProductHor
                  class="p-10"
                  :product="product"
                  :show-criterial="true"
                />
              </div>
            </div>
            <ShowMore
              class="bg-dot"
              :text="$t('10')"
              :target="'/en/systemtrade/riskreturn/fx'"
            />
          </div>
        </LazyComp01>
        <LazyComp01 class="flex space-between mt-20" min-height="450px">
          <div class="w50p list-product">
            <h2 class="title-icon ml-20 mt-25 mb-20">
              <b v-html="$t('16')"></b>
            </h2>
            <ColumnChart
              class="flex center"
              :chart="[
                {
                  name: $t('26'),
                  data: chartColumnScatterLine.column,
                },
              ]"
              :option="colChartOp"
            />
          </div>
          <div class="w50p list-product">
            <h2 class="title-icon ml-20 mt-25 mb-20">
              <b v-html="$t('17')"></b>
            </h2>
            <BubbleChart
              :option="bubblesOp"
              :chart="chartColumnScatterLine.scatterLine"
            />
          </div>
        </LazyComp01>
      </div>
      <div class="right-content">
        <h2 class="title-right flex mid pl-10 mt-mb-0">
          <b>{{ $t('4') }}</b>
        </h2>
        <LazyComp01 class="flex layout-col" min-height="600px">
          <div v-for="(product, idx) in newProduct" :key="'new-product-' + idx">
            <SystemProductHor :product="product" />
          </div>
        </LazyComp01>
        <ShowMore
          class="fs-12 mt-5"
          :text="$t('5')"
          :target="'/en/systemtrade/newproduct/fx'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import title from '@@/../common/pages'
import SystemProductVert from '@/components/product/SystemProductVert.vue'
import SearchArea from '@@/../components/systemtrade/SearchArea.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import SystemProductHor from '@/components/product/SystemProductHor.vue'
import ShowMore from '@/components/common/ShowMore.vue'
import BalanceScale from '@@/../components/icons/BalanceScale.vue'
import Sync from '@@/../components/icons/Sync.vue'
import BubbleChart from '@@/../components/charts/BubbleChart.vue'
import ColumnChart from '@@/../components/charts/ColumnChart.vue'
import ProductVertical from '@@/../components/product/ProductVertical.vue'
import i18n from '@@/lang/desktop/systemtrade-fx.json'
import BubbleChart02 from '@/components/charts/BubbleChart02.vue'
if (process.browser) {
  // TODO: hieunt - need to import from style
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}

function formatNumber(val, defaultVal, floatNum = 0) {
  let n = Number.parseFloat(val)
  return n
    ? val.toLocaleString('en-GB', {
        minimumFractionDigits: floatNum,
      })
    : defaultVal || val
}

const obj = Object.assign(
  {
    scrollToTop: true,
    components: {
      SystemProductVert,
      SearchArea,
      LazyComp01,
      SystemProductHor,
      ShowMore,
      BalanceScale,
      Sync,
      BubbleChart,
      ColumnChart,
      ProductVertical,
      BubbleChart02,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        pieChartOptions: {
          width: 320,
          showInLegend: true,
          exporting: true,
          title: {
            useHTML: true,
            text: `<h2 class="chart-title m-0"><b>${this.$t('7')}</b></h2>`,
            style: {
              color: '#7d7d7d',
              fontSize: '20px',
              fontWeight: 'bold',
            },
            align: 'center',
          },
        },
        scatterOptions: {
          name1: this.$t('20'),
          name2: this.$t('21'),
          name3: this.$t('22'),
          subTitle: {
            text: this.$t('9'),
            verticalAlign: 'bottom',
          },
          title: {
            useHTML: true,
            text: `<h2 class="chart-title m-0"><b>${this.$t('8')}</b></h2>`,
            style: {
              color: '#7d7d7d',
              fontSize: '20px',
              fontWeight: 'bold',
            },
          },
        },
        bubblesOp: {
          yAxis: {
            title: {
              text: this.$t('24'),
            },
          },
          xAxis: {
            title: {
              text: this.$t('25'),
            },
          },
          zAxis: {
            title: {
              text: this.$t('15'),
            },
          },
          legend: {
            enabled: false,
          },
          yunit: 'JPY',
          xunit: this.$t('28'),
        },
        colChartOp: {
          xLabel: true,
          width: 300,
          height: 300,
          yTitle: this.$t('23'),
          plotOptions: {
            series: {
              borderWidth: 0,
              dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.yt}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                  fontSize: '13px',
                  fontFamily: 'Verdana, sans-serif',
                },
              },
            },
          },
          tooltip: {
            headerFormat:
              '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: `<span style="color:{point.color}">{point.name}</span>: <b>{point.yt}</b><br/>`,
          },
        },
      }
    },
    computed: {
      slider() {
        let s = Array.from(this.$store.getters['getTopSliders'] || [])
        return s.sort(() => (Math.random() > 0.5 ? 1 : -1))
      },
    },
    mounted() {
      this.$nextTick(() => {
        $(this.$refs.slider).owlCarousel({
          slideTransition: 'ease',
          autoplayTimeout: 8e3,
          loop: false,
          autoplay: true,
          smartSpeed: 500,
          autoplayHoverPause: true,
          items: 1,
          // dotClass: 'custom-dot',
        })
      })
    },
    methods: {
      onSliderReady() {
        this.$nextTick(() => {
          $('.slider2').owlCarousel({
            slideTransition: 'ease',
            autoplayTimeout: 8e3,
            loop: true,
            autoplay: true,
            items: 5,
            nav: true,
            dots: false,
            margin: 12,
            center: false,
            lazyLoad: true,
            slideBy: 5,
            smartSpeed: 500,
            autoplayHoverPause: true,
            autoWidth: true,
            stagePadding: 1000,
            mergeFit: false,
          })
        })
      },
    },
    async asyncData({ app }) {
      let [top, sliders, rankingActive] = await Promise.all([
          app.GoGoHTTP.get('/api/v3/surface/top', { params: { rtRankingLimit: 6, m: 3 } }),
          app.GoGoHTTP.get('/api/v3/surface/top/sliders'),
          app.GoGoHTTP.get('/api/v3/surface/top/rankingActive'),
        ]),
        defaultData = {
          title: '',
          flag: 'JP',
          data: [],
        }
      let _chartColumnScatterLine = top.chartColumnScatterLine || {},
        _column = _chartColumnScatterLine.column || []
      _column.map((item, index) => {
        if (index === 0) {
          item.name = `1~4,999`
          item.yt = formatNumber(item.y)
          return item
        }
        let a = formatNumber(index * 5000),
          b = formatNumber((index + 1) * 5000 - 1)
        item.name = `${a}~${b}`
        item.yt = formatNumber(item.y)
        return item
      })
      if (!top.chartColumnScatterLine) {
        top.chartColumnScatterLine = {}
      }
      top.chartColumnScatterLine.column = _column

      return {
        bestsell: (top.bestsell || []).slice(0, 6),
        rtRanking: (top.rtRanking || []).slice(0, 6),
        criterial: top.criterial || {
          financial: defaultData,
          unemploy: defaultData,
          rateOf3M: defaultData,
          amountOf3M: defaultData,
          profitOf3M: defaultData,
          riskOf3M: defaultData,
        },
        sliders,
        newProduct: top.newProduct || [],
        rankingActive: rankingActive || [],
        chartColumnScatterLine: top.chartColumnScatterLine || {
          column: [],
          scatterLine: [],
        },
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/en`,
          },
          {
            rel: 'alternate',
            hreflang: 'ja',
            href: `https://www.gogojungle.co.jp/`,
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `https://www.gogojungle.co.jp/en`,
          },
          {
            rel: 'alternate',
            hreflang: 'th',
            href: `https://www.gogojungle.co.jp/th`,
          },
          {
            rel: 'alternate',
            hreflang: 'vi',
            href: `https://www.gogojungle.co.jp/vi`,
          },
          {
            rel: 'alternate',
            hreflang: 'x-default',
            href: `https://www.gogojungle.co.jp/`,
          }
        ],
      }
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.slider-container {
  height: 310px;
  overflow-y: hidden;
}
/deep/ .owl-stage-outer .item {
  display: unset;
}
.list-product {
  border: 1px solid #b1b1b1;
  .bg-dot {
    border-top: 1px solid #dbdbdb;
  }
  .icon-other {
    width: 30px;
    height: 30px;
    background: #7d7d7d;
    border-radius: 50%;
    color: white;
    font-weight: bold;
    font-size: 16px;
    &.no-circle {
      padding: 2px;
    }
    &.icon-yen {
      font-size: 18px;
      padding-top: 4px;
    }
  }
  .title-icon,
  .sub-title,
  .title-icon h2 {
    font-size: 20px;
    color: #7d7d7d;
    line-height: 24px;
  }
  .sub-title {
    font-size: 16px;
  }
  /deep/ .chart-title {
    font-size: 20px;
    color: #7d7d7d;
    text-align: center;
    line-height: 24px;
  }
  .c-bestsell {
    /deep/ .product-BjNGX {
      width: 150px;
      padding: 12px;
      .product-name {
        font-size: 14px;
        margin: 7px 0 3px;
      }
      .prices {
        font-size: 14px;
      }
      .rate-num {
        color: #666;
      }
    }
  }
  /deep/ .old-price {
    margin-left: 0;
  }
  .best-more {
    text-decoration: none;
    background: #79818d;
    color: white;
    width: 300px;
    height: 40px;
    font-size: 14px;
    &:hover {
      text-decoration: none;
    }
  }
  .criterial-wrapp {
    flex: 1 0 auto;
    .product-BjNGXdi {
      min-height: 103px;
    }
    > div:not(:last-child) {
      border-bottom: dotted 1px #ccc;
    }
  }
}
.left-content {
  width: 670px;
  .w50p {
    width: 48.5%;
  }
}
.right-content {
  width: 300px;
  .title-right {
    margin: 0;
    height: 30px;
    border-left: 3px solid #dbdbdb;
    background: #f0f0f0;
    font-size: 16px;
    color: #7d7d7d;
  }
  .layout-col > div {
    border-bottom: dotted 1px #ccc;
  }
}
</style>
