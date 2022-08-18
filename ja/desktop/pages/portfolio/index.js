import Checkbox from '@@/../components/form/Checkbox.vue'
import Table01 from '@@/../components/input/Table01.vue'
import Paging from '@@/../components/paging/Paging.vue'
import LineStockv9 from '@@/../components/charts/LineStockv9.vue'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/portfolio.json'
import titleI18n from "@@/lang/common/portfolio-title.json"
import DatePicker from '@@/../components/input/DateTimePicker.vue'
import generateLDJson from "@@/../common/js/generateLDJson"
import { gotoLogin, pushState } from "@/utils/client/common"
import processChart from './process-chart'
import Loading from '@@/../components/icons/Loading.vue'
const PORTFOLIO_URL = "/api/v3/surface/portfolio"

const obj = Object.assign(
  {
    components: {
      Checkbox,
      Table01,
      LineStockv9,
      Paging,
      GogoModal,
      DatePicker,
      Loading
    },
    data() {
      return {
        minFromDate: moment().format('YYYY/MM/DD'),
        maxFromDate: moment().format('YYYY/MM/DD'),
        searchText: null,
        tblOpt: {
          isScrollable: false,
          widths: [],
          height: null,
          showIconSort: false,
          resetSort: true
        },
        headers: [
          {
            title: this.$t('3'),
            classes: ['text-center', 'w-40'],
          },
          {
            title: this.$t('4'),
            classes: ['text-center'],
            sortTitle: this.$t('33'),
            sortList: [1, 2],
          },
          {
            title: this.$t('5'),
            classes: ['text-center', 'w-120'],
          },
          {
            title: this.$t('6'),
            classes: ['text-center', 'w-70'],
            sortTitle: this.$t('34'),
            sortList: [3, 4],
          },
          {
            title: this.$t('7'),
            classes: ['text-center', 'w-70'],
            sortTitle: this.$t('35'),
            sortList: [5, 6],
          },
          {
            title: this.$t('8'),
            classes: ['text-center', 'w-50'],
            sortTitle: this.$t('36'),
            sortList: [7, 8],
          },
          {
            title: this.$t('9'),
            classes: ['text-center', 'w-80'],
            sortTitle: this.$t('37'),
            sortList: [9, 10],
          },
          {
            title: this.$t('10'),
            classes: ['text-center', 'w-60'],
            sortTitle: this.$t('38'),
            sortList: [11, 12],
          },
          {
            title: this.$t('11'),
            classes: ['text-center', 'w-90'],
            sortTitle: this.$t('39'),
            sortList: [13, 14],
          },
          {
            title: this.$t('12'),
            classes: ['text-center', 'w-90'],
            sortTitle: this.$t('40'),
            sortList: [15, 16],
          },
          {
            title: this.$t('13'),
            classes: ['text-center', 'w-80'],
            sortTitle: this.$t('41'),
            sortList: [17, 18],
          },
          {
            title: this.$t('14'),
            classes: ['text-center', 'w-80']
          },
        ],
        setPeriod: false,
        from: null,
        to: null,
        lineStockOptions: {
          exporting: true,
          sourceWidth: 600,
          sourceHeight: 400,
          allowHTML: true,
          split: true,
          title: this.$t('2'),
          selected: 5,
          rangeSelector: true,
          inputEnabled: true,
          navigator: true,
          allButtonsEnabled: true,
          subtitle :
          {
            text: '',
            useHTML: true,
          },
          chart: {
            height: 600,
            padding: 40,
          },
          legend: {
            enabled: true,
            align: 'center',
            verticalAlign: 'bottom',
            x: 0,
            y: 0,
            itemWidth: 190,
            margin: 5,
          },
          buttons: [
            {
              type: 'month',
              count: 1,
              text: '1M',
            },
            {
              type: 'month',
              count: 3,
              text: '3M',
            },
            {
              type: 'month',
              count: 6,
              text: '6M',
            },
            {
              type: 'ytd',
              text: 'YTD',
            },
            {
              type: 'year',
              count: 1,
              text: '1Y',
            },
            {
              type: 'all',
              count: 1,
              text: 'ALL',
            },
          ],
        },
        colors: ['#c3dd24', '#2078c3', '#c320b2', '#20c356', '#15cced'],
        showAlert: false,
        showAlertLogin: false,
        enabledNum: 0,
        timeOut: null,
        queue: {},
        getDataDebounce: this.debounce(this.onGetData.bind(this), 500),
        calChartDebounce: this.debounce(this.calChart.bind(this), 500),
        loadingChart: false,
        disableCheckbox: false,
      }
    },
    i18n: {
      messages: i18n,
    },
    async asyncData({ app, params, store, error, req }) {
      let locale = app.i18n.locale,
      titleChunk = titleI18n[locale].title,
      descriptionChunk = titleI18n[locale].description,
      keywordsChunk = titleI18n[locale].keywords,
      currentUrl = process.env.GOGO_URL + req.originalUrl,
      p = Number(params.p) || 1,
      keywords = params.w || '',
      type = !isNaN(params.t) ? Number(params.t) : null,
      sort = !isNaN(params.s) ? Number(params.s) : null,
      [data, selectedProducts] = [
        await app.GoGoHTTP.get(
          PORTFOLIO_URL, {
            params: {
              page: p,
              keywords: encodeURIComponent(keywords),
              sortType: type,
              sortOrder: sort
            }
          }
        ),
        await app.GoGoHTTP.get(`${PORTFOLIO_URL}/selected`),
      ],
      lineStock = [],
      dataChart = {},
      dec = {},
      sortType = 0

      if(type !== null && sort !== null) {
        sortType = (sort == 1) ? type*2 : type*2 - 1
      }

      if (params.w === '' && !data.length) {
        return error({ statusCode: 404 })
      }

      if (Array.isArray(selectedProducts)) {
        dec = selectedProducts.reduce((res, val) => {
          res[val.id] = val.lot
          return res
        }, {})
      }
      // breadcrumb
      store.commit('pushBC', {
        name: i18n[app.i18n.locale][31],
        target: { path: `/portfolio` },
      })
      return {
        data,
        titleChunk,
        descriptionChunk,
        keywordsChunk,
        localeHead: titleI18n[app.i18n.locale] || titleI18n['ja'],
        searchText: keywords,
        sortType,
        lineStock,
        dataChart,
        selectedProducts,
        dec,
        p,
        meta: [
          {
            name: "og:site_name",
            content: "GogoJungle",
            hid: "og:site_name"
          },
          {
            name: "og:type",
            content: "website",
            hid: "og:type"
          },
          {
            name: "og:title",
            content: titleChunk,
            hid: "og:title"
          },
          {
            name: "og:description",
            content: descriptionChunk,
            hid: "og:description"
          },
          {
            name: 'viewport',
            content: 'width=device-width',
          }
        ],
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/portfolio`,
          },
        ],
        jsonLDTemplate: generateLDJson({
          title: titleChunk,
          description: descriptionChunk,
          url: currentUrl,
        })
      }
    },
    computed: {
      selectedProductIds() {
        return Array.isArray(this.selectedProducts)
          ? this.selectedProducts
              .filter((item) => item.statusType == 1)
              .map((item) => item.id)
          : []
      },
    },
    mounted() {
      // if no selected products will select first data in table
      let datas = (this.data || {}).data || []
      if(!(this.selectedProducts || []).length && datas.length) {
        if (this.$store.state.user.id) {
          this.postAddProduct(datas[0].id)
        }else {
          let product = {
            ...datas[0],
            statusType: 1
          }
          this.selectedProducts.push(product)
          this.getDataLineStocks()
        }
      }else {
        this.getDataLineStocks()
      }

      this.to = moment().unix()
      this.from = moment().subtract(1, 'year').unix()
    },
    watch: {
      selectedProducts() {
        if (Array.isArray(this.selectedProducts)) {
          for (let i in this.selectedProducts) {
            this.selectedProducts[i].lot =
              this.dec[this.selectedProducts[i].id] || 0.1
          }
          this.dec = this.selectedProducts.reduce((res, val) => {
            res[val.id] = val.lot || 0.1
            return res
          }, {})
        }
      },
      setPeriod() {
        this.getDataLineStocks()
      }
    },
    methods: {
      formatProfitFactor(profit) {
        if(profit === 999999999) return '-'
        return this.formatNumber(profit, '0.00')
      },
      descriptionTemplate() {
        return this.descriptionChunk
      },
      keywordsTemplate() {
        return `${this.localeHead.keywords}`
      },
      onChangeDate(val, prevVal) {
        let dateVal = moment(val * 1000).format('YYYY-MM-DD')
        let datePrevVal = moment(prevVal * 1000).format('YYYY-MM-DD')
        // if same day, no get new data
        if(!moment(dateVal).isSame(datePrevVal)) {
          this.getDataLineStocks()
        }
      },
      navigateToLogin() {
        gotoLogin(`u=${location.pathname}`)
      },
      checkedBox(id) {
        return Array.isArray(this.selectedProducts)
          ? this.selectedProducts.findIndex((item) => item.id === id)
          : -1
      },
      async getSelectedProducts(refeshChart = true) {
        this.disableCheckbox = false
        let res = await this.GoGoHTTP.get(`${PORTFOLIO_URL}/selected`)
        if (res) {
          this.selectedProducts = res
          if(refeshChart) {
            this.getDataLineStocks(
              res.filter((item) => item.statusType == 1).map((item) => item.id)
            )
          }
        }
      },
      calChart() {
        this.loadingChart = true
        let data = JSON.parse(JSON.stringify(this.dataChart))
        this.lineStock = []

        let [l1, l2, ls, tData] = processChart(data, this.dec), colorIdx = 0

        // gain/loss portfolio line
        if (l1.length) {
          this.lineStock.push({
            name: this.$t('18'),
            data: l1,
            color: '#ff0000',
            zIndex: 7,
            tooltip: {
              valueDecimals: 2,
            },
          })
        }

        // portfolio line
        if (l2.length) {
          this.lineStock.push({
            name: this.$t('17'),
            data: l2,
            color: '#ff890e',
            zIndex: 6,
            tooltip: {
              valueDecimals: 2,
            },
          })
        }

        // line chart
        for (let i in ls) {
          let prd = this.selectedProducts.filter(
            (item) => parseInt(item.id) === parseInt(i)
          )[0]
          this.lineStock.push({
            name: prd ? prd.name : '',
            data: ls[i],
            color: this.colors[colorIdx],
            id: prd ? prd.id : null,
            tooltip: {
              valueDecimals: 2,
            },
          })
          colorIdx++
        }

        // summary info
        let subtitle = `<br/><div class="text-center">${this.$t('19')}： ${this.formatNumber(Math.round(tData.portIncrease,0))}円&nbsp;&nbsp;&nbsp;&nbsp;${this.$t('20')}： ${this.formatNumber(Math.round(tData.maxPortDD,0))}円&nbsp;&nbsp;&nbsp;&nbsp;${this.$t('21')}： ${tData.profitFactor}<br/>${this.$t('22')}： ${tData.recovery}&nbsp;&nbsp;&nbsp;&nbsp;${this.$t('10')}： ${tData.winningRate}％&nbsp;&nbsp;&nbsp;&nbsp;${this.$t('23')}: ${this.formatNumber(tData.avgProfit)}円</div><br/>`
        this.lineStockOptions.subtitle.text = subtitle
        if(this.$refs['lineStockChart']) {
          this.$refs['lineStockChart'].innerChart.setTitle(null, {
            useHTML: true,
            text: subtitle
          })
        }

        this.loadingChart = false
      },
      onSelectProduct(id) {
        this.disableCheckbox = true
        if (this.$store.state.user.id) {
          let temp = this.selectedProducts.findIndex((item) => item.id === id)
          if (temp === -1) {
            this.dec[id] = 0.1
            this.postAddProduct(id)
          } else {
            this.onRemove(id)
          }
        } else {
          // case user not login
          let el = $(this.$el),
          input = el.find('table input[type="checkbox"]'),
          inputChecked = el.find('table input[type="checkbox"]:checked')

          // select default first item
          if(input.length) {
            input[0].checked = true
          }

          // uncheck item user select
          if(inputChecked.length) {
            inputChecked[inputChecked.length - 1].checked = false
          }

          // show modal warning login
          this.showAlertLogin = true
          this.disableCheckbox = false
        }
      },
      postAddProduct(id) {
        this.GoGoHTTP.post(`${PORTFOLIO_URL}/${id}/select`).then(() => {
          if(this.selectedProducts.length < 5) {
            this.loadingChart = true
            this.updateStatusType(id)
          }else {
            this.getSelectedProducts(false)
          }
        })
      },
      postRemoveProduct(id) {
        return this.GoGoHTTP.post(`${PORTFOLIO_URL}/${id}/remove`)
      },
      onSearch() {
        this.p = 1
        this.getDataDebounce()
      },
      onPagingClick(p) {
        this.p = p
        this.getDataDebounce()
      },
      onSort(type) {
        this.p = 1
        this.sortType = type
        this.getDataDebounce()
      },
      onGetData() {
        this.changeURL()
        this.getDataTable()
      },
      changeURL() {
        pushState({
          p: this.p || 1,
          t: this.sortType ? Math.round(this.sortType/2) : null,
          s: this.sortType ? Number(this.sortType%2 == 0) : null,
          w: this.searchText || null
        },null, '', '/portfolio')
      },
      async getDataTable() {
        let res = await this.GoGoHTTP.get(PORTFOLIO_URL, {
          params: {
            page: this.p,
            keywords: encodeURIComponent(this.searchText) || null,
            sortType: this.sortType ? Math.round(this.sortType/2) : null,
            sortOrder: this.sortType ? Number(this.sortType%2 == 0) : null
          }
        })
        if(res) { this.data = res }
      },
      onEnter(e) {
        if (e.keyCode === 13) {
          this.onSearch()
        }
      },
      getDataLineStocks(ids = []) {
        this.loadingChart = true
        let me = this
        let productIds = ids.length ? ids.join() : me.selectedProductIds.join() || ''

        if (!productIds.length) {
          this.dataChart = {}
          this.calChart()
          return
        }
        this.GoGoHTTP.get(`${PORTFOLIO_URL}/linestock`, {
          params: {
            from: me.setPeriod && me.from ? me.from : null,
            to: me.setPeriod && me.to ? me.to : null,
            productIds,
          },
        }).then((data) => {
          if (data.length) {
            me.dataChart = {}
            for (let i = 0; i < data.length; i++) {
              me.dataChart[data[i]['productId']] = data[i]
            }
            this.calChart()
          }else {
            this.loadingChart = false
          }

        })
      },
      enableProduct(idx) {
        if(!this.queue[idx]) {
          this.queue[idx] = this.debounce(this.onEnable.bind(this), 500)
        }
        this.queue[idx](idx)
      },
      onEnable(idx) {
        if (!this.selectedProducts[idx]) {
          return
        }

        // update enable
        this.selectedProducts[idx].statusType = !this.selectedProducts[idx].statusType

        this.enabledNum = (this.selectedProducts.filter(item => item.statusType) || []).length
        let statusType = this.selectedProducts[idx].statusType
        // let statusType = !this.selectedProducts[idx].statusType

        // enable maximun 5 products
        if (this.enabledNum > 5 && statusType) {
          this.showAlert = true
          this.enabledNum = 6
          this.selectedProducts[idx].statusType = !this.selectedProducts[idx].statusType
          return
        }

        this.updateStatusType(this.selectedProducts[idx].id)
      },
      updateStatusType(id) {
        this.GoGoHTTP.post(`${PORTFOLIO_URL}/${id}/updateStatus`).then(
          () => {
            this.getSelectedProducts()
          }
        )
      },
      onRemove(id) {
        this.loadingChart = true
        this.selectedProducts = this.selectedProducts.filter((item) => {
          return item.id !== id
        })
        if (!this.$store.state.user.id) {
          this.removeLineStockData(id)
          return
        }
        this.postRemoveProduct(id).then(() => {
          this.removeLineStockData(id)
        })
      },
      removeLineStockData(_id) {
        this.disableCheckbox = false
        delete this.dataChart[_id]
        this.calChart()
      },
      onChangeLot(id) {
        if(!this.selectedProductIds.includes(id)) {
          return
        }
        this.calChartDebounce()
      },
    },
    title,
  },
  title
)
export default obj
