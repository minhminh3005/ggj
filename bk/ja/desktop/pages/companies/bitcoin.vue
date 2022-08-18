<template>
  <Container :tieup="tieup.content">
    <div class="mb-30 mt-30">
      <table class="co-black w-full">
        <thead>
          <tr class="title-table" v-show="headers.length">
            <th class="text-center pt-5 pb-5" v-for="(item,index) in headers" :key="index+'wgYur'">
              <span v-html="item" class="fs-11"></span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="h-50" v-for="(company,i) in companies" :key="i">
            <td class="text-center">
              <a :href="'/companies/' + company.id">
                <img v-if="company.id" class="cursor-pointer" height="37" width="160" :src="'/img/companies/' + company.id + '/thumbnail'" alt="" :title="company.name" />
              </a>
            </td>
            <td>
              <div v-wrap-lines="2" class="text-left pl-10 pr-10">
                <span v-html="company.pr"></span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Container>
</template>

<script>
import i18n from '@@/lang/desktop/companies-bitcoin.json'
import Container from '@/components/companies/Container.vue'
import title from '@@/../common/pages'
const obj = Object.assign(
  {
    components: {
      Container,
    },
    i18n: {
      messages: i18n,
    },
    async asyncData({ app, route }) {
      let [companies, tieup] = await Promise.all([
        app.GoGoHTTP.get('/api/v3/surface/company/bitcoin'),
        app.GoGoHTTP.get('/api/v3/surface/campaigns'),
      ])
      return {
        tieup,
        companies,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp${route.path}`,
          },
        ],
      }
    },
    data() {
      return {
        headers: [this.$t('1'), this.$t('2')],
        titleChunk: this.$t('Title'),
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t('Des')
      },
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
table {
  border-collapse: collapse;
}
th {
  background-color: #e7e7e7;
  border: 1px solid white;
}
td {
  border: 1px solid white;
  font-size: 14px;
}
tr:nth-child(odd) {
  background-color: #eee;
}
tr:nth-child(even) {
  background-color: #f8f8f8;
}
.title-table {
  th {
    &:nth-child(even) {
      background-color: #dddedf;
    }
    span {
      &.fs-11 {
        line-height: 12px;
      }
      &.company-arrow {
        padding: 6px 0 0 5px;
      }
    }
  }
}
.h-50 {
  height: 50px;
}
</style>
