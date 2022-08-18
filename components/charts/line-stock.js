import ChartWrapper from './chart-wrapper'
import i18n from '@@/lang/components/line-stock.json'

export default function (HighCharts, Exporting) {
  if (process.browser) {
    Exporting(HighCharts)
  }
  return {
    mixins: [ChartWrapper],
    i18n: {
      messages: i18n,
    },
    methods: {
      initChart() {
        let me = this
        HighCharts.setOptions({
          lang: {
            rangeSelectorZoom: this.$t('1'),
            rangeSelectorFrom: this.$t('2'),
            rangeSelectorTo: this.$t('3'),
            printChart: this.$t('4'),
            contextButtonTitle: this.$t('5'),
            downloadJPEG: this.$t('6'),
            downloadPDF: this.$t('7'),
            downloadPNG: this.$t('8'),
            downloadSVG: this.$t('9'),
            numericSymbols: null,
            thousandsSep: ',',
          },
        })
        me.innerChart = HighCharts.stockChart(me.$refs.chartWrap, {
          chart: me.option.chart || {
            height: me.option.height,
            margin: me.option.margin || 0,
          },
          credits: {
            enabled: false,
          },
          title: {
            text: me.option.title,
          },
          subtitle: me.option.subtitle || {},
          scrollbar: me.option.scrollbar || {
            enabled: true,
          },
          exporting: {
            enabled: me.option.exporting || false,
            sourceWidth: me.option.sourceWidth || null,
            sourceHeight: me.option.sourceHeight || null,
            allowHTML: me.option.allowHTML || false,
          },
          yAxis: [
            {
              minorTickInterval: 'auto',
              lineColor: '#888',
              lineWidth: 1,
              tickColor: '#888',
              plotLines: [
                {
                  value: 0,
                  width: 2,
                  color: '#eee',
                },
              ],
              labels: {
                align: 'right',
                formatter: function() {
                  return (
                    this.value.toString().replace(/(\d)(?=(\d\d\d)+$)/g, '$1,') +
                    ' 　'
                  )
                },
              },
            },
          ],
          xAxis: [
            {
              gridLineWidth: 1,
              lineColor: '#555',
              tickColor: '#888',
              labels: {
                formatter: function() {
                  return moment(this.value).format('YY/MM/DD')
                },
              },
            },
          ],
          legend: me.option.legend || {
            enabled: true,
            layout: 'horizontal',
            floating: true,
            x: 0,
            y: 22,
          },
          rangeSelector: {
            enabled: me.option.rangeSelector || false,
            selected: me.option.selected || 5,
            allButtonsEnabled: me.option.allButtonsEnabled || false,
            inputPosition: me.option.inputPosition || {},
            buttonPosition: me.option.buttonPosition || {},
            inputEnabled: me.option.inputEnabled || false,
            inputDateFormat: '%Y/%m/%d',
            buttons: me.option.buttons || [
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
                type: 'year',
                count: 1,
                text: '12M',
              },
              {
                type: 'year',
                count: 2,
                text: '24M',
              },
              {
                type: 'all',
                count: 1,
                text: 'ALL',
              },
            ],
          },
          navigator: {
            baseSeries: 0,
            enabled: me.option.navigator || false,
          },
          plotOptions: {
            series: {
              dataGrouping: {
                dateTimeLabelFormats: {
                  millisecond: [
                    '%Y/%m/%d %H:%M:%S.%L',
                    '%Y/%m/%d %H:%M:%S.%L',
                    '-%H:%M:%S.%L',
                  ],
                  second: ['%Y/%m/%d %H:%M:%S', '%Y/%m/%d %H:%M:%S', '-%H:%M:%S'],
                  minute: ['%Y/%m/%d %H:%M', '%Y/%m/%d %H:%M', '-%H:%M'],
                  hour: ['%Y/%m/%d %H:%M', '%Y/%m/%d %H:%M', '-%H:%M'],
                  day: ['%Y/%m/%d', '%Y/%m/%d', '-%Y/%m/%d'],
                  week: ['%Y/%m/%d', '%Y/%m/%d', '-%Y/%m/%d'],
                  month: ['%B %Y', '%B', '-%B %Y'],
                  year: ['%Y', '%Y', '-%Y'],
                },
              },
            },
          },
          tooltip: me.option.tooltip || {
            enabled: true,
            borderColor: '#666666',
            xDateFormat: '%A, %b %e, %Y',
            pointFormat:
              `<span style="font-weight: bold; color:{series.color}">{series.name}</span><span style="font-weight: bold">: {point.y:,.0f}${me.option.curUnit || '円'}</span><br />`,
          },
          series: me.chart || [],
        })
      },
    },
  }
}