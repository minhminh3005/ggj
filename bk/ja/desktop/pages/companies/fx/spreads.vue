<template>
  <Container :tieup="tieup.content" class="m-b-30">
    <company-bar v-if="companies !== {}" :items="toolbar" />
    <FxTable :headers="spreads" :data="companies" />
  </Container>
</template>

<script>
import i18n from '@@/lang/desktop/companies-fx.json'
import CompanyBar from '@/components/companies/CompanyBar.vue'
import FxTable from '@/components/companies/FxTable.vue'
import Container from '@/components/companies/Container.vue'
import title from '@@/../common/pages'
import { getData } from '@/js/companies/fx'
const obj = Object.assign(
  {
    i18n: {
      messages: i18n,
    },
    components: {
      CompanyBar,
      FxTable,
      Container,
    },
    async asyncData({ app, route }) {
      return await getData(app, route, '/spreads')
    },
    methods: {
      descriptionTemplate() {
        return this.$t('spreadsDes')
      },
    },
    data() {
      return {
        titleChunk: this.$t('spreadsTitle'),
        spreads: [
          this.$t('2'),
          'USD<br>/JPY',
          'EUR<br>/JPY',
          'GBP<br>/JPY',
          'AUD<br>/JPY',
          'NZD<br>/JPY',
          'EUR<br>/USD',
          this.$t('1'),
        ],
        toolbar: [
          {
            text: this.$t('10'),
            header: this.$t('13'),
            id: 'swaps',
            url: '/companies/fx/swaps',
          },
          {
            text: this.$t('11'),
            header: this.$t('14'),
            id: 'spreads',
            url: '/companies/fx/spreads',
          },
          {
            text: this.$t('12'),
            id: 'reviews',
            url: '/companies/fx/reviews',
          },
        ],
      }
    },
  },
  title
)
export default obj
</script>
