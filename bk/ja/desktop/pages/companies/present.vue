<template>
  <Container :tieup="tieup.content">
    <company-bar :items="toolbar" />
    <div class="flex layout-col" v-if="presents.length">
      <div class="mb-20 p-20 mt-20 present border-all" v-for="(item, idx) in presents" :key="'csShb' + item.id">
        <div class="flex mid space-between title mt-5 pl-15 pr-5" :style="{ 'background': 'url(/img/assets/pc/common/title-company-bg.jpg) repeat' }">
          <img :src="'/img/assets/pc/common/tmp_rank_o.png'" alt="" />
          <span class="grow0 ml-10"><b>{{ item.name }}</b></span>
          <img :src="'/img/assets/pc/common/tmp_pk' + (8 + idx % 4) + '.png'" alt="" />
        </div>
        <div class="flex mt-30 present-container">
          <a :href="item.rUrl">
            <img :src="`/img/affiliates/${item.id}/banner`" alt="" />
          </a>
          <div class="flex layout-col ml-20 grow0">
            <div v-html="item.pr"></div>
          </div>
        </div>
        <div class="mt-30 mb-20 text-center">
          <a :href="item.rUrl">
            <img class="redirect" :src="'/img/assets/pc/common/tmp_a_open.png'" alt="" />
          </a>
        </div>
      </div>
    </div>
    <p class="co-red text-center" v-else>{{ $t('6') }}</p>
  </Container>
</template>

<script>
import i18n from '@@/lang/desktop/companies-index.json'
import CompanyBar from '@/components/companies/CompanyBar.vue'
import Container from '@/components/companies/Container.vue'
import title from '@@/../common/pages'
const categories = {
  fx: 1,
  stocks: 3,
}
const obj = Object.assign(
  {
    components: {
      CompanyBar,
      Container,
    },
    validate({ params }) {
      return ~['all', 'fx', 'stocks', undefined].indexOf(params.category)
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        selected: {
          id: '1',
        },
        toolbar: [
          {
            text: this.$t('3'),
            id: '0',
            url: '/companies/present/all',
          },
          {
            text: this.$t('4'),
            id: '1',
            url: '/companies/present/fx',
          },
          {
            text: this.$t('5'),
            id: '3',
            url: '/companies/present/stocks',
          },
        ],
      }
    },
    computed: {
      titleChunk() {
        return this.$t(
          `present${this.params.category || ''}Title`
        )
      },
    },
    async asyncData({ app, route, params }) {
      let [presents, tieup] = await Promise.all([
        app.GoGoHTTP.get('/api/v3/surface/company/present'),
        app.GoGoHTTP.get('/api/v3/surface/campaigns'),        
      ])
      if (params.category == 'fx' || params.category == 'stocks') {
        presents = presents.filter(i => {
          return i.cId == categories[params.category]
        })
      }
      return {
        tieup,
        presents,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp${route.path}`,
          },
        ],
        params,
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t(`present${this.params.category || ''}Des`)
      },
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.present {
  min-height: 330px;
  border-radius: 5px;
  .title {
    height: 49px;
    > img:first-child {
      width: 30px;
      height: 60px;
    }
    > img:last-child {
      width: 67px;
      height: 78px;
    }
  }
  .redirect {
    width: 367px;
    height: 40px;
    display: inline-block;
  }
  .mypage-button-common {
    background-color: rgb(140, 121, 216);
  }
  .present-container {
    img:first-child {
      width: 240px;
      height: 160px;
    }
  }
}
.co-red {
  color: red;
}
</style>
