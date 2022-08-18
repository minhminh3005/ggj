<template>
  <Container :tieup="tieup.content">
    <div class="pb-30">
      <div class="grow12 mt-10">
        <div class="header-title">{{ $t('3') }}</div>
      </div>
      <div class="fs-25 pt-20">{{ $t('4') }}</div>
      <table01 :headers="headers" class="custom mt-20 fs-12" @onchangesorttype="onSortTransation" :sort-type="sortType">
        <tr v-for="(company, index) in transationList" :key="index" class="row-middle-all">
          <td>
            <a :href="'/companies/' + company.id">
              <img :title="company.name" height="37" width="160" :src="'/img/companies/' + company.id + '/thumbnail'" class="w-160 cursor-pointer" />
            </a>
          </td>
          <td v-for="(item, i) in company.data" :key="i" class="text-right p-5">
            {{ !item ? '-' : item + '円' }}
          </td>
        </tr>
      </table01>
      <div class="fs-25 pt-40">{{ $t('5') }}</div>
      <table01 :headers="headers" class="custom mt-20 fs-12" @onchangesorttype="onSortDate" :sort-type="sortType1">
        <tr v-for="(company, index) in dateList" :key="index" class="row-middle-all">
          <td>
            <a :href="'/companies/' + company.id">
              <img :title="company.name" height="37" width="160" :src="'/img/companies/' + company.id + '/thumbnail'" class="w-160 cursor-pointer" />
            </a>
          </td>
          <td v-for="(item, i) in company.data" :key="i" class="text-right p-5">
            {{ !item ? '-' : item + '円' }}
          </td>
        </tr>
      </table01>
    </div>
  </Container>
</template>

<script>
import i18n from '@@/lang/desktop/companies-stocks.json'
import Table01 from '@@/../components/input/Table01.vue'
import Container from '@/components/companies/Container.vue'
import title from '@@/../common/pages'
const obj = Object.assign(
  {
    i18n: {
      messages: i18n,
    },
    components: {
      Table01,
      Container
    },
    async asyncData({ app, route }) {
      let [{ transation, date }, tieup] = await Promise.all([
        app.GoGoHTTP.get('/api/v3/surface/company/stocks'),
        app.GoGoHTTP.get('/api/v3/surface/campaigns')
      ])
      return {
        tieup,
        transationList: transation,
        dateList: date,
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
        sortType: -1,
        sortType1: -1,
        headers: [
          {
            title: this.$t('6'),
            classes: ['text-center'],
          },
          {
            title: this.$t('7', { num: '10' }),
            classes: ['fs-11', 'w-70'],
            sortList: [1, 2],
          },
          {
            title: this.$t('7', { num: '20' }),
            classes: ['fs-11', 'w-70'],
            sortList: [3, 4],
          },
          {
            title: this.$t('7', { num: '30' }),
            classes: ['fs-11', 'w-70'],
            sortList: [5, 6],
          },
          {
            title: this.$t('7', { num: '50' }),
            classes: ['fs-11', 'w-70'],
            sortList: [7, 8],
          },
          {
            title: this.$t('7', { num: '100' }),
            classes: ['fs-11', 'w-80'],
            sortList: [9, 10],
          },
          {
            title: this.$t('7', { num: '300' }),
            classes: ['fs-11', 'w-80'],
            sortList: [11, 12],
          },
        ],
        titleChunk: this.$t('Title'),
      }
    },
    methods: {
      onSortTransation(type) {
        this.onSort(type, 'sortTransation', 'sortType')
      },
      onSortDate(type) {
        this.onSort(type, 'sortDate', 'sortType1')
      },
      onSort(type, fn, sortType) {
        this[sortType] = type
        switch (type) {
          case 1:
          case 2:
            this[fn](type === 1 ? 1 : -1, 0)
            break
          case 3:
          case 4:
            this[fn](type === 3 ? 1 : -1, 1)
            break
          case 5:
          case 6:
            this[fn](type === 5 ? 1 : -1, 2)
            break
          case 7:
          case 8:
            this[fn](type === 7 ? 1 : -1, 3)
            break
          case 9:
          case 10:
            this[fn](type === 9 ? 1 : -1, 4)
            break
          case 11:
          case 12:
            this[fn](type === 11 ? 1 : -1, 5)
            break
        }
      },
      sortTransation(type, col) {
        this.transationList.sort((a, b) => {
          return (a.data[col] - b.data[col]) * type
        })
      },
      sortDate(type, col) {
        this.dateList.sort((a, b) => {
          return (a.data[col] - b.data[col]) * type
        })
      },
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
.header-title {
  background: rgb(81, 81, 81);
  border-left: 5px solid #9c3;
  color: white;
  height: 30px;
  line-height: 34px;
  padding-left: 10px;
  font-size: 12px;
}
.custom {
  border-radius: 0;
  min-width: 600px !important;
  border: 1px solid #dadada;
  /deep/ thead {
    a {
      color: black;
    }
    background: rgb(231, 231, 231);
    color: black;
    th {
      &:nth-child(even) {
        background-color: rgb(221, 222, 223);
      }
    }
    tr {
      &:nth-child(even) {
        background-color: rgb(248, 248, 248);
      }
      th {
        &:first-child {
          border-top-left-radius: 0;
        }
        &:last-child {
          border-top-right-radius: 0;
        }
      }
    }
  }
  /deep/ tbody {
    tr {
      td:not(:last-child) {
        border-right: 1px solid #dadada;
      }
    }
  }
}
i {
  height: 6px;
  line-height: 4px;
}
table {
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
}
.fs-25 {
  font-size: 25px;
}
.w-160 {
  width: 160px;
}
</style>
