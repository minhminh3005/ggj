<template>
  <div class="w-1000 flex layout-col">
    <a href="/finance/videos/10106">
      <img src="/img/assets/pc/portfolio/portfolio_infomation.jpg" alt="" />
    </a>
    <div class="flex space-between mt-20">
      <div class="list-products">
        <div class="w-full p-5 bg-co-59 border-all fs-11">
          <div class="flex mid mb-5" :class="{ disabled: loadingChart }">
            <Checkbox
              :attrs="{ value: 10 }"
              v-model="setPeriod"
              class="fs-11"
            />
            <div class="cursor-pointer" @click="()=>{setPeriod = !setPeriod}">{{ $t('1') }}</div>
          </div>
          <div class="flex mid">
            <DatePicker
              class="h-30"
              :class="{ disabled: !setPeriod }"
              v-model="from"
              data-vv-value-path="date"
              required
              :format="'YYYY/MM/DD'"
              :end-date="true"
              @input="onChangeDate"
            />
            <label class="ml-5 mr-5 mb-0"> ~ </label>
            <DatePicker
              class="h-30"
              v-model="to"
              data-vv-value-path="date"
              required
              :class="{ disabled: !setPeriod }"
              :format="'YYYY/MM/DD'"
              :end-date="true"
              @input="onChangeDate"
            />
          </div>
        </div>
        <div v-if="selectedProducts.length" class="border-all w-full mt-10 overflow products">
          <div
            class="flex mid fs-10"
            v-for="(item, idx) in selectedProducts"
            :key="'j230ads' + item.id + idx"
            :class="'item bg-' + (idx % 2)"
          >
            <div class="p-5">
              <button
                class="btn-status fs-10 text-center"
                :class="{ off: !item.statusType, on: item.statusType }"
                @click="enableProduct(idx)"
              >
                {{ item.statusType ? 'ON' : 'OFF' }}
              </button>
            </div>
            <a class="name wrap-text" :href="item.detailUrl" :title="item.name" target="_blank">
              {{ item.name }}
            </a>
            <div class="ml-5">
              <input
                type="text"
                name=""
                class="pl-5 pr-5 pr-5 input input-lot"
                v-model.number="dec[item.id]"
                @input="onChangeLot(item.id)"
              /><span class="ml-5">Lot</span>
            </div>
            <div class="p-5 ml-10 cursor-pointer" @click="onRemove(item.id)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 13v6c0 .552-.448 1-1 1s-1-.448-1-1v-6c0-.552.448-1 1-1s1 .448 1 1zm7-1c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1s1-.448 1-1v-6c0-.552-.448-1-1-1zm-4 0c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1s1-.448 1-1v-6c0-.552-.448-1-1-1zm4.333-8.623c-.882-.184-1.373-1.409-1.189-2.291l-5.203-1.086c-.184.883-1.123 1.81-2.004 1.625l-5.528-1.099-.409 1.958 19.591 4.099.409-1.958-5.667-1.248zm4.667 4.623v16h-18v-16h18zm-2 14v-12h-14v12h14z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div v-else class="border-all mt-10 no-data" style="min-height: 481px;">
          {{ $t('25') }}
        </div>
      </div>
      <div class="chart-products p-10">
        <div class="pl-30 pr-30 col-white">
          <div>
            <div class="text-center title mt-5" v-if="!lineStock.length">
              {{ $t('2') }}
            </div>
            <LineStockv9
              ref="lineStockChart"
              :chart="lineStock"
              :option="lineStockOptions"
              v-if="!loadingChart && lineStock.length"
            />
            <div v-if="!loadingChart && !lineStock.length" class="no-data">{{ $t('26') }}</div>
          </div>
        </div>
        <div v-if="loadingChart" class="loading-chart">
          <Loading />
        </div>
      </div>
    </div>
    <div
      class="w-full border-all mt-20 mb-20 search-products pl-10 pr-10 mt-5 mb-5 flex mid pt-10 pb-10"
    >
      <input
        type="text"
        class="ml-20 border-double"
        :placeholder="$t('15')"
        v-model="searchText"
        @keyup="onEnter"
      />
      <button class="w-100 h-30 ml-20" @click="onSearch">
        {{ $t('16') }}
      </button>
    </div>
    <Table01 :headers="headers" class="mt-10 system-table" v-if="data" @onchangesorttype="onSort" :sort-type="sortType" :options="tblOpt">
      <tr
        v-for="(item, index) in (data || {}).data"
        :key="item.id"
        class="row-middle-all pt-10 pb-10"
      >
        <td class="text-center">
          <Checkbox
            :attrs="{ value: { id: item.id, name: item.name } }"
            :checked="checkedBox(item.id) > -1"
            @input="onSelectProduct(item.id)"
            :key="`product-${index}`"
            class="product-checkbox"
            :class="{'disabled': disableCheckbox }"
          />
        </td>
        <td>
          <a class="clamp clamp-3" :href="item.detailUrl">{{ item.name }}</a>
        </td>
        <td class="text-center">
          <img
            :src="
              'http://chart.apis.google.com/chart?chs=110x36&cht=lc&chd=t:' +
                item.balanceCurve +
                '&chco=5931F6&chds=a'
            "
            alt=""
          />
        </td>
        <td class="text-center">
          {{ formatNumber(item.profitRate, '0.00') }}%
        </td>
        <td class="text-center">
          {{ formatNumber(item.maximalDrawdown, '0.00') }}%
        </td>
        <td class="text-center">
          {{ formatProfitFactor(item.profitFactor) }}
        </td>
        <td class="text-center">
          {{ formatNumber(item.riskReturn, '0.00') }}
        </td>
        <td class="text-center">
          {{ formatNumber(item.winningRate, '0.00') }}%
        </td>
        <td class="text-right">
          <span class="pl-5 pr-5 wrap-text">
            {{ formatNumber(item.pipsTotal, '0.00') }}
          </span><span class="fs-10">pips</span>
        </td>
        <td class="text-right">
          {{ formatNumber(item.profitTotal, '0.00') }}円
        </td>
        <td class="text-right">
          <span class="pl-5 pr-5 text-right">
            {{ formatNumber(item.operatingMonths, '0.00') }}ヶ月
          </span>
        </td>
        <td class="text-center">
          <span>{{ item.category == 1 ? 0.1 : 100 }} Lot</span>
        </td>
      </tr>
      <!-- no data-->
      <tr v-if="!(data || {}).data || (!(data || {}).data || []).length">
        <td colspan="12" class="text-center">{{ $t('30') }}</td>
      </tr>
    </Table01>
    <Paging
      class="flex center theme1 mt-20"
      :cur-page="data.currentPage || 1"
      :total="data.lastPage || 1"
      :from="data.pagingFrom || 1"
      :to="data.pagingTo || 1"
      :hascroll="false"
      @pagingclick="onPagingClick"
    />
    <GogoModal
      :show="showAlert"
      :cancel-text="'Ok'"
      :ok-text="''"
      @update:show="(val) => (showAlert = val)"
      :width="500"
      :height="200"
    >
      <div slot="modal-body" class="warning flex center mid">
        {{ $t('32') }}
      </div>
    </GogoModal>
    <GogoModal
      :show="showAlertLogin"
      :cancel-text="''"
      :ok-text="$t('29')"
      @update:show="(val) => (showAlertLogin = val)"
      :width="500"
      :height="200"
      @ok="navigateToLogin"
      class="alert-login"
    >
      <div slot="modal-body" class="warning flex center mid">
        {{ $t('28') }}
      </div>
    </GogoModal>
  </div>
</template>
<script>
import detail from './index.js'
export default detail
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
