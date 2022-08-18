<template>
  <Container :tieup="tieup.content" class="m-b-30">
    <company-bar v-if="companies !== {}" :items="toolbar" />
    <FxTable :headers="reviews" :data="companies" />
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
      return await getData(app, route, '/reviews')
    },
    methods: {
      descriptionTemplate() {
        return this.$t('reviewsDes')
      },
    },
    data() {
      return {
        titleChunk: this.$t('reviewsTitle'),
        reviews: [
          this.$t('2'),
          this.$t('4'),
          this.$t('5'),
          this.$t('6'),
          this.$t('7'),
          this.$t('8'),
          this.$t('9'),
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
