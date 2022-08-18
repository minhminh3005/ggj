<template>
  <!-- screen request -->
  <section v-if="page === 1" class="w-estimate">
    <!-- tab show history -->
    <div v-if="isShowHis || isShowEdit" class="background-hidden"></div>
    <GogoModal :show="isShowHis" @update:show="(val) => (isShowHis = val)">
      <div slot="modal-header" class="modal-header history-title">
        <div class="flex space-between">
          <div class="his-topic">{{ $t('17') }}</div>
          <button
            class="close-his flex center mid"
            @click="() => (isShowHis = false)"
          >
            <CloseIcon current-color="#505050" />
          </button>
        </div>
      </div>
      <div slot="modal-body" class="history-body">
        <div
          class="flex layout-col history-item"
          @click="chooseToFill(option)"
          v-for="option in formatHistory"
          :key="option.id"
        >
          <span class="his-title">{{ option.title }}</span>
          <span class="his-outline mt-5">{{ option.outline }}</span>
          <div class="flex mt-5">
            <span class="his-title-date small-width">{{ $t('title3') }}</span>
            <div
              class="clamp clamp-3"
            >
              <span
                v-for="(file, index) in option.attachmentFiles"
                :key="`new-file-${index}`"
                class="his-file"
              >
                {{ file.name }}
              </span>
            </div>
          </div>
          <div class="flex mt-5">
            <span class="his-title-date small-width">
              {{
                $t('title4')
              }}
            </span>
            <div
              class="clamp clamp-3"
            >
              <span
                v-for="(url, index) in option.URLs"
                :key="`old-file-${index}`"
                class="his-url"
              >
                {{ url }}
              </span>
            </div>
          </div>
          <div class="flex mt-5">
            <div class="flex auto">
              <span class="his-title-date">{{ $t('title5') }}</span>
              <span class="his-content-date">{{ formatNumber(option.budget) || '-' }} {{ $t('currency') }}</span>
            </div>
            <div class="flex auto">
              <span class="his-title-date">{{ $t('title6') }}</span>
              <span class="his-content-date">
                {{ option.deadlineAtFormat || '-' }}
              </span>
            </div>
            <div class="flex auto">
              <span class="his-title-date">{{ $t('title7') }}</span>
              <span class="his-content-date">
                {{ option.supplyHopeAtFormat || '-' }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div slot="modal-footer" class="d-none"></div>
    </GogoModal>
    <!-- tab show editing title-outline  -->
    <div v-if="isShowEdit" class="edit">
      <div
        class="flex center mid"
        style="height: 56px; border-bottom: 1px solid #ddd;"
      >
        <div class="his-topic">{{ $t('28') }}</div>
        <button class="close-his flex center mid" @click="isShowEdit = false">
          <CloseIcon current-color="#505050" />
        </button>
      </div>
      <div
        class="flex layout-col"
        style="cursor: pointer; padding: 12px; margin: 20px; border: 1px solid #ccc;"
        @click="chooseToEdit(option)"
        v-for="(option, index) in template"
        :key="index"
      >
        <span class="his-title">{{ option.title }}</span>
        <span class="his-outline">{{ option.content }}</span>
      </div>
    </div>
    <!-- screen request -->
    <div class="estimate">
      <span class="estimate-topic">{{ $t('43') }}</span>
      <div class="line-topic"></div>
    </div>
    <div>
      <div class="estimate-c">
        <div class="estimate-c-title">
          <span class="estimate-title">{{ $t('2') }}</span>
          <button class="must-input" :class="[service.id === 1 ? '' : 'border-none']">
            {{ service.id === 1 ? $t('must') : '' }}
          </button>
        </div>
        <div class="estimate-c-content large-title">
          <span class="estimate-topic-content">{{ service.name }}</span>
        </div>
        
        <!-- only show large = 投資  -->
        <select
          v-if="service.id === 1"
          class="select-es"
          v-model="selectedSubMid"
          @change="onChangeSubMid"
        >
          <option value="" selected disabled hidden>
            {{ $t('45') }}
          </option>
          <option
            v-for="option in subListMid"
            :key="option.id"
            :value="{ id: option.id, name: option.name }"
          >
            {{ option.name }}
          </option>
        </select>
      </div>
    </div>
    <!-- middle cate -->
    <div>
      <div class="estimate-c">
        <div class="estimate-c-title">
          <span class="estimate-title">{{ $t('14') }}</span>
          <button class="must-input">{{ $t('must') }}</button>
        </div>
        <select
          :class="checkDisabledMiddle() ? 'disable-input' : ''"
          class="select-es"
          v-model="selectedRequire"
        >
          <option value="" selected disabled hidden>
            {{ checkDisabledMiddle() ? '-' : $t('45') }}
          </option>
          <option
            v-for="option in middleList"
            :key="option.id"
            :value="{ id: option.id, name: option.name }"
          >
            {{ option.name }}
          </option>
        </select>
      </div>
    </div>
    <button
      :style="checkDisabled() ? 'pointer-events : none' : ''"
      @click="showHistory"
      :class="
        !history.length
          ? 'estimate-btn-topic hide-btn-his'
          : 'estimate-btn-topic show-btn-his'
      "
    >
      {{ $t('4') }}
    </button>
    <!-- 1 -->
    <skeleton :type-page="1">
      <template v-slot:title>
        <span class="estimate-title">{{ $t('title1') }}</span>
        <button class="must-input">{{ $t('must') }}</button>
      </template>
      <template>
        <div class="flex end pos-rel">
          <input
            name="title"
            v-validate="{ rules: { required: true, min: 1, max: 50 } }"
            v-model="title"
            class="border-form w-full"
            :class="checkDisabled() ? 'disable-input' : ''"
            style="height: 50px; padding-left: 10px; max-height: 44px;"
          />
          <span class="ml-5 limit-character">50</span>
        </div>
        <span
          v-show="
            isClient &&
              errors.has('title') &&
              errors.firstByRule('title', 'required')
          "
          class="text-err"
        >
          {{ $t('22') }}
        </span>
        <span
          v-show="
            isClient &&
              errors.has('title') &&
              errors.firstByRule('title', 'max')
          "
          class="text-err"
        >
          {{ $t('33') }}
        </span>
      </template>
    </skeleton>
    <!-- 2 -->
    <skeleton :type-page="1">
      <template v-slot:title>
        <span class="estimate-title">{{ $t('title2') }}</span>
        <button class="must-input">{{ $t('must') }}</button>
      </template>
      <template>
        <textarea
          v-validate="{ rules: { required: true, min: 1, max: 2000 } }"
          :class="checkDisabled() ? 'disable-input' : ''"
          name="outline"
          v-model="outline"
          class="border-form special text-area w-full resize-vertical mt-5"
          style="height: 212px; padding-left: 10px;"
        ></textarea>
        <div 
          class="add-text-ske-2"
          :style="
            checkDisabled() ? 'pointer-events : none;background: #f5f5f5' : ''
          "
        >
          <templateList
            :selected-service="true"
            @selectTemplate="onSelectTemplate"
            @formError="onFormError"
          />
          <span>2000</span>
        </div>
        <span
          v-show="
            isClient &&
              errors.has('outline') &&
              errors.firstByRule('outline', 'max')
          "
          class="text-err"
        >
          {{ $t('31') }}
        </span>
        <span
          v-show="
            isClient &&
              errors.has('outline') &&
              errors.firstByRule('outline', 'required')
          "
          class="text-err"
        >
          {{ $t('23') }}
        </span>
      </template>
    </skeleton>
    <!-- 3 -->
    <skeleton :type-page="1">
      <template v-slot:title>
        <span class="estimate-title">{{ $t('title3') }}</span>
        <button class="not-must-input">{{ $t('not-must') }}</button>
      </template>
      <template>
        <div v-if="historyFile.length" class="file-item-area">
          <div
            class="file-item"
            v-for="(item, index) in historyFile"
            :key="`his-s-file-${index}`"
          >
            <ClipIcon />
            <span>
              {{ item.name }}
            </span>
            <a @click="removeFileHistory(index)">
              <CloseIcon class="cursor-pointer" />
            </a>
          </div>
        </div>
        <div v-if="filesUpload.length" class="file-item-area">
          <div
            class="file-item"
            v-for="(item, index) in filesUpload"
            :key="`new-s-file-${index}`"
          >
            <ClipIcon />
            <span>
              {{ item.name }}
            </span>
            <a @click="removeFile(index)">
              <CloseIcon class="cursor-pointer" />
            </a>
          </div>
        </div>
        <div>
          <ImportFile
            :class="checkDisabled() ? 'disable-input' : ''"
            ref="importFile"
            accept=".zip, .rar, .pdf, .mq4, .ex4, .mq5, .ex5"
            @input="fileChanged"
            :multiple="3"
            :maxsize="5"
          />
          <div class="text-danger mt-5" v-if="checkErr">
            <b>{{ $t(checkErr) }}</b>
          </div>
        </div>
      </template>
    </skeleton>
    <!-- 4 -->
    <skeleton :type-page="1">
      <template v-slot:title>
        <span class="estimate-title">{{ $t('title4') }}</span>
        <button class="not-must-input">{{ $t('not-must') }}</button>
      </template>
      <template>
        <textarea
          @input="checkContentUrl"
          v-model="strUrl"
          :class="checkDisabled() ? 'disable-input' : ''"
          @keydown.space.prevent
          class="border-form text-area w-full resize-vertical mt-5"
          style="height: 181px; padding-left: 10px;"
        ></textarea>
        <span class="text-err" v-if="errUrl === 1">{{ $t('12') }}</span>
        <span class="text-err" v-else-if="errUrl === 2">{{ $t('13') }}</span>
        <span v-else style="display: none;"></span>
      </template>
    </skeleton>
    <!-- 5 -->
    <skeleton :type-page="1">
      <template v-slot:title>
        <span class="estimate-title">{{ $t('title5') }}</span>
        <button class="must-input">{{ $t('must') }}</button>
      </template>
      <template>
        <div class="flex mid">
          <input
            name="budget"
            maxlength="11"
            :class="checkDisabled() ? 'disable-input' : ''"
            v-validate="{
              rules: {
                required: true,
                numeric: true,
                min_value: 400,
                max_value: 2147483647,
              },
            }"
            v-model="budget"
            class="border-form"
            style="width: 250px; height: 50px; padding-left: 10px; font-size: 16px;"
          />
          <span style="margin-left: 14px;">{{ $t('10') }}</span>
        </div>
        <span
          v-show="
            isClient &&
              errors.has('budget') &&
              errors.firstByRule('budget', 'required')
          "
          class="text-err"
        >
          {{ $t('24') }}
        </span>
        <span
          v-show="
            isClient &&
              errors.has('budget') &&
              errors.firstByRule('budget', 'numeric')
          "
          class="text-err"
        >
          {{ $t('32') }}
        </span>
        <span
          v-show="
            isClient &&
              errors.has('budget') &&
              errors.firstByRule('budget', 'max_value')
          "
          class="text-err"
        >
          {{ $t('30') }}
        </span>
        <span
          v-show="
            isClient &&
              errors.has('budget') &&
              errors.firstByRule('budget', 'min_value')
          "
          class="text-err"
        >
          {{ $t('29') }}
        </span>
      </template>
    </skeleton>
    <!-- 6 -->
    <skeleton :type-page="1">
      <template v-slot:title>
        <span class="estimate-title">{{ $t('title6') }}</span>
        <button class="must-input">{{ $t('must') }}</button>
      </template>
      <template>
        <Calendar
          :class="checkDisabled() ? 'disable-date' : ''"
          name="deadline"
          :min-date="true"
          data-vv-value-path="date"
          data-vv-validate-on="input|change|blur"
          v-model="deadLineAt"
          :end-date="true"
          :min-string="getDateNow"
        />
        <span class="text-err" v-show="errDeadLine">{{ $t('25') }}</span>
      </template>
    </skeleton>
    <!-- 7 -->
    <skeleton :type-page="1">
      <template v-slot:title>
        <span class="estimate-title">{{ $t('title7') }}</span>
        <button class="must-input">{{ $t('must') }}</button>
      </template>
      <template>
        <div
          class="date-es"
        >
          <Calendar
            v-model="supplyHopeAt"
            :style="isSupply ? 'pointer-events :none' : ''"
            :class="checkDisabled() || isSupply ? 'disable-date' : ''"
            name="delivery"
            :min-date="true"
            data-vv-value-path="date"
            data-vv-validate-on="input|change|blur"
            :end-date="true"
            :min-string="getDateNow"
          />
          <label 
            :style="checkDisabled() ? 'pointer-events : none' : ''"
            class="check-date-es"
          >
            <input
              @input="checkDateOfSupply"
              v-model="isSupply"
              type="checkbox"
            />{{ $t('11') }}
          </label>
        </div>
        <span class="text-err" v-show="errSupplyHope">{{ $t('26') }}</span>
      </template>
    </skeleton>
    <div>
      <GogoModal
        :show="showFormError"
        @close="() => (showFormError = false)"
        :width="'400px'"
        :height="'auto'"
      >
        <div slot="modal-body" class="p-30">
          {{ $t(formErrorText) }}
        </div>
        <div slot="modal-footer" class="d-none"></div>
      </GogoModal>
    </div>
    <div class="frame-btn">
      <div class="line-topic"></div>
      <button 
        :class="checkDisabled() ? 'disable-input disabled' : ''"
        @click="nextToConfirm" class="btn-requests"
      >
        {{ $t('6') }}
      </button>
    </div>
  </section>
  <!-- screen confirm -->
  <section class="w-estimate" v-else-if="page === 2">
    <div class="flex estimate-warning">
      <span class="estimate-topic">{{ $t('43') }}</span>
      <div class="f-warn">
        <div class="icon-warning">!</div>
        <span class="warning-text">{{ $t('18') }}</span>
      </div>
    </div>
    <div class="line-topic"></div>
    <skeleton>
      <template v-slot:title>
        <span class="estimate-title">{{ $t('2') }}</span>
      </template>
      <template>
        <span class="text-confirm">{{ service.name || '-' }}</span>
      </template>
      <template v-if="service.id === 1">
        <span class="text-confirm"> > {{ selectedSubMid.name || '-' }}</span>
      </template>
    </skeleton>
    <skeleton>
      <template v-slot:title>
        <span class="estimate-title">{{ $t('14') }}</span>
      </template>
      <template>
        <span class="text-confirm">{{ selectedRequire.name || '-' }}</span>
      </template>
    </skeleton>
    <skeleton>
      <template v-slot:title>
        <span class="estimate-title">{{ $t('title1') }}</span>
      </template>
      <template>
        <span
          style="font-size: 16px; line-height: 24px; color: #333; font-weight: bold;"
        >
          {{ title }}
        </span>
      </template>
    </skeleton>
    <skeleton>
      <template v-slot:title>
        <span class="estimate-title">{{ $t('title2') }}</span>
      </template>
      <template>
        <div class="flex layout-col">
          <span
            class="his-outline"
            v-for="(str, index) in arrOutline"
            :key="index"
            v-html="str"
          >
            {{ str }}
          </span>
        </div>
      </template>
    </skeleton>
    <skeleton>
      <template v-slot:title>
        <span class="estimate-title">{{ $t('title3') }}</span>
      </template>
      <template>
        <!-- file -->
        <template v-if="historyFile.length || filesUpload.length">
          <div
            class="file-item"
            v-for="(item, index) in historyFile"
            :key="`his-c-file-${index}`"
          >
            <span>
              {{ item.name }}
            </span>
          </div>
          <div
            class="file-item"
            v-for="(item, index) in filesUpload"
            :key="`new-c-file-${index}`"
          >
            <span>
              {{ item.name }}
            </span>
          </div>
        </template>
        <template v-else>
          -
        </template>
      </template>
    </skeleton>
    <skeleton>
      <template v-slot:title>
        <span class="estimate-title">{{ $t('title4') }}</span>
      </template>
      <template v-if="urlInConfirm.length">
        <div class="flex layout-col">
          <a
            style="color: #377cb8;"
            :href="url"
            v-for="(url, index) in urlInConfirm"
            :key="index"
          >
            {{ url }}
          </a>
        </div>
      </template>
      <template v-else>
        -
      </template>
    </skeleton>
    <skeleton>
      <template v-slot:title>
        <span class="estimate-title">{{ $t('title5') }}</span>
      </template>
      <template>
        <span class="text-confirm">
          {{ formatNumber(Number(budget)) }} {{ $t('currency') }}
        </span>
      </template>
    </skeleton>
    <skeleton>
      <template v-slot:title>
        <span class="estimate-title">{{ $t('title6') }}</span>
      </template>
      <template>
        <span class="text-confirm">{{ formatDeadLineDate || '-' }}</span>
      </template>
    </skeleton>
    <skeleton>
      <template v-slot:title>
        <span class="estimate-title">{{ $t('title7') }}</span>
      </template>
      <template>
        <span class="text-confirm">{{ formatSupplyHopeDate || '-' }}</span>
      </template>
    </skeleton>
    <div class="line-topic"></div>
    <div class="flex center mid f-btn-request">
      <button @click="backToRequest" class="btn-back">{{ $t('19') }}</button>
      <button
        @click="submit"
        class="btn-next"
        :class="{ disabled: processing }"
        :disabled="processing"
      >
        <div class="flex mid center">
          <b class="fs-18">{{ $t('20') }}</b>
          <Loading
            v-if="processing"
            class="ml-10 sm"
            style="width: 20px; height: 20px;"
          />
        </div>
      </button>
    </div>
    <GogoModal
      :show="isShowError"
      @close="() => (isShowError = false)"
      :width="'400px'"
      :height="'auto'"
    >
      <div slot="modal-body" class="p-30">
        {{ $t('44') }}
      </div>
      <div slot="modal-footer" class="d-none"></div>
    </GogoModal>
  </section>
  <!-- screen complete -->
  <section class="w-estimate" v-else>
    <div class="flex">
      <span class="estimate-topic">{{ $t('21') }}</span>
    </div>
    <div class="line-topic"></div>
    <skeleton>
      <template v-slot:title>
        <span class="estimate-title">{{ $t('2') }}</span>
      </template>
      <template>
        <span class="text-confirm">{{ service.name || '-' }}</span>
      </template>
      <template v-if="service.id === 1">
        <span class="text-confirm"> > {{ selectedSubMid.name || '-' }}</span>
      </template>
    </skeleton>
    <skeleton>
      <template v-slot:title>
        <span class="estimate-title">{{ $t('14') }}</span>
      </template>
      <template>
        <span class="text-confirm">{{ selectedRequire.name || '-' }}</span>
      </template>
    </skeleton>
    <skeleton>
      <template v-slot:title>
        <span class="estimate-title">{{ $t('title1') }}</span>
      </template>
      <template>
        <span
          style="font-weight: bold; font-size: 16px; line-height: 24px; color: #333; "
        >
          {{ title }}
        </span>
      </template>
    </skeleton>
    <skeleton>
      <template v-slot:title>
        <span class="estimate-title">{{ $t('title2') }}</span>
      </template>
      <template>
        <div class="flex layout-col">
          <span
            class="his-outline"
            v-for="(str, index) in arrOutline"
            :key="index"
            v-html="str"
          >
            {{ str }}
          </span>
        </div>
      </template>
    </skeleton>
    <skeleton>
      <template v-slot:title>
        <span class="estimate-title">{{ $t('title3') }}</span>
      </template>
      <template>
        <!-- file -->
        <template v-if="historyFile.length || filesUpload.length">
          <div
            class="file-item"
            v-for="(item, index) in historyFile"
            :key="`file-${index}`"
          >
            <span>
              {{ item.name }}
            </span>
          </div>
          <div
            class="file-item"
            v-for="(item, index) in filesUpload"
            :key="`file-${index}`"
          >
            <span>
              {{ item.name }}
            </span>
          </div>
        </template>
        <template v-else>
          -
        </template>
      </template>
    </skeleton>
    <skeleton>
      <template v-slot:title>
        <span class="estimate-title">{{ $t('title4') }}</span>
      </template>
      <template>
        <div class="flex layout-col">
          <a
            style="color: #377cb8;"
            :href="url"
            v-for="(url, index) in urlInConfirm"
            :key="index"
          >
            {{ url }}
          </a>
        </div>
      </template>
    </skeleton>
    <skeleton>
      <template v-slot:title>
        <span class="estimate-title">{{ $t('title5') }}</span>
      </template>
      <template>
        <span class="text-confirm">
          {{ formatNumber(Number(budget)) }} {{ $t('currency') }}
        </span>
      </template>
    </skeleton>
    <skeleton>
      <template v-slot:title>
        <span class="estimate-title">{{ $t('title6') }}</span>
      </template>
      <template>
        <span class="text-confirm">{{ formatDeadLineDate || '-' }}</span>
      </template>
    </skeleton>
    <skeleton>
      <template v-slot:title>
        <span class="estimate-title">{{ $t('title7') }}</span>
      </template>
      <template>
        <span class="text-confirm">{{ formatSupplyHopeDate || '-' }}</span>
      </template>
    </skeleton>
  </section>
</template>

<script>
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import CloseIcon from '@@/../common/components/close-icon'
import Catalog from '@@/../components/form/DropdownEstimate.vue'
import pencil from '@@/../components/icons/Pencil02.vue'
import skeleton from '@/components/estimate/ChildSkeleton.vue'
import ImportFile from '@@/../components/input/ImportFileEstimate.vue'
import Calendar from '@@/../components/input/DateTimePicker.vue'
import i18n from '@@/lang/desktop/estimate-index.json'
import title from '@@/../common/pages'
import ClipIcon from '@@/../common/components/clip-icon'
import Loading from '@@/../components/icons/Loading.vue'
import templateList from './templates.vue'
import GogoModal from '@@/../components/modals/GogoModal.vue'

if (process.browser) {
  Vue.use(VeeValidate, {
    inject: true,
    events: 'none',
  })
}

const obj = Object.assign(
  {
    scrollToTop: true,
    components: {
      GogoModal,
      ClipIcon,
      CloseIcon,
      skeleton,
      pencil,
      ImportFile,
      Calendar,
      Catalog,
      Loading,
      templateList,
    },
    i18n: {
      messages: i18n,
    },

    data() {
      return {
        selectedSubMid: '',
        historyFile: [],
        arrOutline: [],
        urlInConfirm: [],
        isShowEdit: false,
        isClient: process.browser,
        strUrl: '',
        selectedRequire: '',
        formatDeadLineDate: '',
        formatSupplyHopeDate: '',
        imgSource: [],
        formData: [],
        errDeadLine: false,
        errSupplyHope: false,
        isSupply: false,
        page: 1, // 1 : fill   2 : confirm   3: complete
        isShowHis: false,
        errUrl: 0, // 1: wrong format  2: need <br> when import multi urls
        title: '',
        outline: '',
        filesUpload: [],
        URLs: [],
        budget: null,
        deadLineAt: 0,
        supplyHopeAt: 0,
        processing: false,
        bkSupplyHopeAt: 0,
        isShowError: false,
        showFormError: false,
        formErrorText: '',
        checkErr: null,
      }
    },
    async asyncData({ app, params, store, error, redirect, route }) {
      let userId = store.state.user.id
      if (!userId) {
        return redirect(`/login?u=${route.fullPath}`)
      }
      let [middleInfo, allCateLevel, history, userInfo, template] = []
      try {
        [middleInfo, allCateLevel, history, userInfo, template] = await Promise.all([
          app.GoGoHTTP.get(
            `/api/share-room/estimate/request/serviceCategoryMiddle/${params.productId}`
          ),
          app.GoGoHTTP.get(
            `/api/share-room/estimate/surface/categories`
          ),
          app.GoGoHTTP.get(`/api/share-room/estimate/request/history`),
          app.GoGoHTTP.get(
            `/api/share-room/estimate/request/infor/${params.userId}/${params.productId}`
          ),
          app.GoGoHTTP.get(`/api/share-room/display/rooms/templates`),
        ])
      } catch (e) {
        console.log(e)
        return error({ statusCode: 404 })
      }
      if (
        !((userInfo || {}).product || {}).id ||
        !((userInfo || {}).user || {}).id ||
        !((userInfo || {}).product || {}).isEstimate ||
        ((userInfo || {}).product || {}).userId !=
          ((userInfo || {}).user || {}).id
      ) {
        return error({ statusCode: 404 })
      }
      let formatHistory = history.map((data) => {
        if (!data.supplyHopeAt) {
          return {
            ...data,
            deadlineAtFormat: moment(data.deadlineAt * 1000).format(
              'YYYY/MM/DD'
            ),
            supplyHopeAtFormat: '',
          }
        } else {
          return {
            ...data,
            deadlineAtFormat: moment(data.deadlineAt * 1000).format(
              'YYYY/MM/DD'
            ),
            supplyHopeAtFormat: moment(data.supplyHopeAt * 1000).format(
              'YYYY/MM/DD'
            ),
          }
        }
      })

      const shareroomId = 13 

      let { large, middle, requirmentItems, categoryMiddleGroupByLargeId } = allCateLevel    
      
      let middleInfoId = middleInfo ? middleInfo.id : 1,
          middleCate = middle.find(mid => mid.id === middleInfoId),
          service = large.find(large => large.id === middleCate.serviceCategoryLargeId),
          middleList = categoryMiddleGroupByLargeId[service.id] || [], 
          subListMid = categoryMiddleGroupByLargeId['1'] || []
          
      // https://gogojungle.backlog.jp/view/OAM-60888
      store.commit('pushBC', {
        name: (i18n[app.i18n.locale || 'ja']['bc-lv2'] || '').replace(
          '{productName}',
          ((userInfo || {}).product || {}).name
        ),
        path: `/estimate/${params.userId}/${params.productId}`,
      })
      return {
        shareroomId,
        categoryMiddleGroupByLargeId,
        requirmentItems,
        middleList,
        subListMid,
        template,
        formatHistory,
        history,
        service,
        params,
        userInfo,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/estimate/${params.userId}/${params.productId}`,
          },
        ],
      }
    },
    computed: {
      getDateNow: {
        get() {
          return moment().format('YYYY/MM/DD')
        },
        set() {},
      },
    },
    watch: {
      $route() {
        document.documentElement.style.overflow = null
      },
    },
    methods: {
      checkDisabledMiddle() {
        if(this.service.id === 1 && !this.selectedSubMid) return true
        return false
      },
      checkDisabled() {
        if(!this.selectedRequire) return true
        return false
      },
      onChangeSubMid() {
        this.selectedRequire = ""
        // select shareroomId = 13 => middleList by largeId = 3
        if(this.selectedSubMid.id === this.shareroomId) {
          this.middleList = this.categoryMiddleGroupByLargeId['3']
        } else this.middleList = this.requirmentItems
      },
      onFormError(val) {
        this.showFormError = true
        this.formErrorText = val
      },
      formatOutline() {
        this.arrOutline = this.outline.split('\n')
      },
      scrollTop() {
        $('html, body').animate({ scrollTop: '0px' }, 0)
      },
      showEdit() {
        this.scrollTop()
        this.isShowEdit = true
      },
      chooseToEdit(option) {
        this.isShowEdit = false
        this.title = option.title
        this.outline = option.content
      },
      onSelectTemplate(value) {
        if (!value) return
        this.outline = value
      },
      backToRequest() {
        this.page = 1
        this.scrollTop()
      },
      descriptionTemplate() {
        return this.$t('des-lv2', {
          name: ((this.userInfo || {}).user || {}).nickName,
          productName: ((this.userInfo || {}).product || {}).name,
        })
      },
      titleTemplate() {
        return this.$t('title-lv2', {
          name: ((this.userInfo || {}).product || {}).name,
        })
      },
      showHistory() {
        this.isShowHis = true
        this.scrollTop()
      },
      isNumber(e) {
        e = e ? e : window.event
        var charCode = e.which ? e.which : e.keyCode
        if (
          charCode > 31 &&
          (charCode < 48 || charCode > 57) &&
          charCode !== 46
        ) {
          e.preventDefault()
        } else {
          return true
        }
      },
      getBase64(file, cb) {
        let reader = new FileReader()
        reader.onloadend = () => {
          cb(reader.result)
        }
        reader.readAsDataURL(file)
      },
      fileChanged(_file) {
        this.imgSource = []
        if (!_file) {
          return
        }
        if (_file.err) {
          this.checkErr = _file.err
          return
        }
        this.checkErr = null
        for (let i = 0; i < _file.length; i++) {
          this.filesUpload.push(_file[i])
        }
      },
      removeFileHistory(index) {
        this.historyFile.splice(index, 1)
      },
      removeFile(index) {
        this.filesUpload.splice(index, 1)
      },
      checkDateOfSupply() {
        if (!this.isSupply) {
          this.bkSupplyHopeAt = this.supplyHopeAt
          this.supplyHopeAt = 0
        } else {
          this.supplyHopeAt = this.bkSupplyHopeAt
        }
      },
      chooseToFill(option) {
        this.historyFile = [...option.attachmentFiles]
        this.strUrl = option.URLs.join('\n')
        this.URLs  = option.URLs
        this.isShowHis = false
        this.deadLineAt = option.deadlineAt
        this.title = option.title
        this.budget = option.budget
        this.outline = option.outline
        if (this.isSupply) this.supplyHopeAt = 0
        else this.supplyHopeAt = option.supplyHopeAt
        if (
          option.deadlineAtFormat != moment().format('YYYY/MM/DD') &&
          moment().unix() > option.deadlineAt
        )
          this.deadLineAt = 0
        if (
          (option.supplyHopeAtFormat != moment().format('YYYY/MM/DD') &&
            moment().unix() > option.supplyHopeAt) ||
          !option.supplyHopeAt
        )
          this.supplyHopeAt = 0
      },
      checkContentUrl() {
        let num = 0
        this.URLs = this.strUrl.split('\n')
        this.URLs.forEach((str) => {
          if (!this.isUrl(str) && str != '') {
            this.errUrl = 1
            return
          } else num++
        })
        if (num == this.URLs.length) this.errUrl = 0
      },
      isUrl(str) {
        return /^(https?:\/\/)(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b/g.test(
          str
        )
      },
      nextToConfirm() {
        this.urlInConfirm = this.URLs.filter((url) => url !== '')
        this.$validator.validateAll().then((success) => {
          if (!this.deadLineAt) this.errDeadLine = true
          else this.errDeadLine = false
          if (!this.isSupply && !this.supplyHopeAt) this.errSupplyHope = true
          else this.errSupplyHope = false
          if (
            !success ||
            this.errUrl ||
            !this.deadLineAt ||
            (!this.isSupply && !this.supplyHopeAt)
          ) {
            return
          }
          this.formatOutline()
          this.scrollTop()
          this.page = 2
          this.formatDeadLineDate = moment(this.deadLineAt * 1000).format(
            'YYYY/MM/DD'
          )
          if (!this.isSupply)
            this.formatSupplyHopeDate = moment(this.supplyHopeAt * 1000).format(
              'YYYY/MM/DD'
            )
          else this.formatSupplyHopeDate = ''
        })
      },
      submit() {
        let historyFile = []
        this.historyFile.forEach((file) => historyFile.push(file.fileId))
        this.processing = true
        let formData = new FormData()
        for (let i = 0; i < this.filesUpload.length; i++) {
          formData.append('attachment', this.filesUpload[i])
        }
        if(this.service.id !== 1 || (this.service.id === 1 && this.selectedSubMid.id === 13)) {
          formData.append('serviceCategoryMiddleId', this.selectedRequire.id)
          formData.append('requirementItemsMiddleId', null)
        } else {
          formData.append('serviceCategoryMiddleId', this.selectedSubMid.id)
          formData.append('requirementItemsMiddleId', this.selectedRequire.id)
        }
        formData.append('title', this.title)
        formData.append('outline', this.outline)
        formData.append('URLs', this.strUrl)
        formData.append('budget', this.budget)
        formData.append('historyAttachmentFileIds', historyFile)
        formData.append('deadLineAt', this.deadLineAt)
        if (!this.isSupply) formData.append('supplyHopeAt', this.supplyHopeAt)
        this.GoGoHTTP.post(
          `/api/share-room/estimate/request/${this.params.userId}/${this.params.productId}`,
          formData
        )
          .then(() => {
            this.page = 3
            this.scrollTop()
          })
          .catch((err) => {
            console.log('Err submit in estimate', err)
            this.processing = false
            this.isShowError = true
          })
          .finally(() => {
            this.processing = false
          })
      },
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
