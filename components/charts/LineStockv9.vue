<template>
  <div ref="chartWrap" class="inner-chart"></div>
</template>

<script>
import HighCharts from 'highcharts-v9/highstock'
import Exporting from 'highcharts-v9/modules/exporting.js'
import commonfn from './line-stock'

export default commonfn(HighCharts, Exporting)
</script>
<style lang="scss" scoped>
  @import './line-stock.scss';
</style>
<docs>
  ```vue
  <template>
    <div style="height: 400px;">
      <LineStock :chart="chartData" />
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        chartData: [
        {
          name: "ストラテジー登録前",
          tooltip: {
            valueDecimals: 2
          },
          data: [
            [
              1268924400000,
              2000
            ],
            [
              1269270000000,
              4000
            ],
            [
              1269356400000,
              7000
            ],
          ]
        }]
      }
    },
  }
  </script>
  ```
</docs>
