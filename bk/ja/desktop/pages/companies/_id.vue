<template>
  <Container :tieup="tieup.content">
    <div class="mt-20">
      <div class="header-title pl-10">{{ cashback.name }}</div>
      <div v-if="cashback !== []" class="cashback-container flex p-20 border-all">
        <div>
          <a class="img-wrapp" :href="cashback.url">
            <img width="180" height="45" :src="'/img/companies/' + cashback.id + '/thumbnail'" />
            <img width="180" height="170" class="mt-10" :src="'/img/companies/' + cashback.id" />
          </a>
        </div>
        <div class="grow12 ml-20">
          <div class="review-wrap flex mid space-between pl-15 pr-15">
            <div class="review-tit flex mid">
              <b>{{ $t('2') }}:</b>
            </div>
            <rate :stars="cashback.avg || 0" class="fs-30 pl-10" :alway-show="true" />
          </div>
          <div class="com-des mt-15 fs-13" v-html="cashback.companyPr"></div>
          <div class="mt-20 btn-links text-center">
            <a :href="cashback.url" class="co-white">‣{{ $t('1', {name: cashback.name}) }}</a>
          </div>
        </div>
      </div>
      <div class="cash-review mt-30">
        <h4 class="review-title flex">
          <Edit class="mt-5" />
          <b>{{ $t('3') }}</b>
        </h4>
        <div class="p-20 border-all">
          <div class="flex space-between pb-20">
            <table class="table-review">
              <thead>
                <tr>
                  <td class="w-100"></td>
                  <td class="w-25 text-center"><b>1</b></td>
                  <td class="w-25 text-center"><b>2</b></td>
                  <td class="w-25 text-center"><b>3</b></td>
                  <td class="w-25 text-center"><b>4</b></td>
                  <td class="w-25 text-center"><b>5</b></td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="w-100 fs-12"><b>{{ $t('4') }}</b></td>
                  <td v-for="(i, key) in 5" :key="key" class="text-center"><input type="radio" v-validate="{ rules: { required: true, min_value: 1 } }" name="r1" v-model.number="myReview.eval1" :value="i" /></td>
                </tr>
                <tr>
                  <td class="w-100 fs-12"><b>{{ $t('5') }}</b></td>
                  <td v-for="(i, key) in 5" :key="key" class="text-center"><input type="radio" v-validate="{ rules: { required: true, min_value: 1 } }" name="r2" v-model.number="myReview.eval2" :value="i" /></td>
                </tr>
                <tr>
                  <td class="w-100 fs-12"><b>{{ $t('6') }}</b></td>
                  <td v-for="(i, key) in 5" :key="key" class="text-center"><input type="radio" v-validate="{ rules: { required: true, min_value: 1 } }" name="r3" v-model.number="myReview.eval3" :value="i" /></td>
                </tr>
                <tr>
                  <td class="w-100 fs-12"><b>{{ $t('7') }}</b></td>
                  <td v-for="(i, key) in 5" :key="key" class="text-center"><input type="radio" v-validate="{ rules: { required: true, min_value: 1 } }" name="r4" v-model.number="myReview.eval4" :value="i" /></td>
                </tr>
                <tr>
                  <td class="w-100 fs-12"><b>{{ $t('8') }}</b></td>
                  <td v-for="(i, key) in 5" :key="key" class="text-center"><input type="radio" v-validate="{ rules: { required: true, min_value: 1 } }" name="r5" v-model.number="myReview.reviewStars" :value="i" /></td>
                </tr>
              </tbody>
            </table>
            <div class="review-post">
              <p class="fs-12"><b>{{ $t('9') }}</b></p>
              <input v-model="myReview.title" v-validate="{ rules: { required: true } }" name="title" type="text" class="w-full input-review fs-12" />
              <p class="fs-12"><b>{{ $t('10') }}*</b></p>
              <textarea v-model="myReview.content" v-validate="{ rules: { required: true } }" name="content" class="w-full input-textarea fs-12"></textarea>
            </div>
          </div>
          <div class="capcha-wrapp flex mid mt-20 pt-20">
            <div class="flex">
              <captcha ref="captcha" :value="captchaText" />
              <div class="ml-10">
                <input type="text" v-model="captchaText" />
                <span class="fs-11 mt-5">{{ $t('11') }}</span>
              </div>
            </div>
            <div class="text-center">
              <button @click="onSubmit" :class="{ 'disabled': posting }" class="btn-submit">‣{{ $t('12') }}</button>
            </div>
          </div>
          <b v-show="error1" class="co-red">{{ $t('13') }}</b><br />
          <b v-show="error2" class="co-red">{{ $t('14') }}</b>
        </div>
      </div>
      <div class="user-review mt-30">
        <h4 class="review-title text-center">
          <b>{{ $t('15', {name: cashback.name}) }}</b>
        </h4>
        <div class="p-10 mb-30 border-all" v-if="cashback.reviews">
          <div v-for="(review, key) in cashback.reviews" :key="key">
            <div class="user-info flex space-between mid p-5">
              <img src="/img/assets/pc/common/default/user.png" width="50" height="50" />
              <div class="cash-col-1">
                <div class="flex mid space-between">
                  <p class="fs-12">{{ $t('16') }}</p>
                  <b class="fs-16">{{ review.reviewStars }}</b>
                </div>
                <rate :stars="review.reviewStars" class="review-star" />
              </div>
              <div class="cash-rate text-center">
                <p class="fs-12">{{ $t('17') }}</p>
                <b class="fs-16">{{ review.eval1 }}</b>
              </div>
              <div class="cash-rate text-center">
                <p class="fs-12">{{ $t('18') }}</p>
                <b class="fs-16">{{ review.eval2 }}</b>
              </div>
              <div class="cash-rate text-center">
                <p class="fs-12">{{ $t('19') }}</p>
                <b class="fs-16">{{ review.eval3 }}</b>
              </div>
              <div class="cash-rate text-center m-r-10">
                <p class="fs-12">{{ $t('20') }}</p>
                <b class="fs-16">{{ review.eval4 }}</b>
              </div>
            </div>
            <div class="p-5">
              <h4 class="fs-14 m-t-20 m-b-15"><b>{{ review.title }}</b></h4>
              <div class="m-t-10 fs-12" v-html="review.content"></div>
              <p class="m-t-20 text-right fs-12">{{ formatTime(review.publishedDate) }}</p>
            </div>
          </div>
        </div>
        <div class="text-center co-red p-10 mb-30 border-all" v-else>
          {{ $t('21') }}
        </div>
      </div>
      <div v-if="cashback.tieUpData" class="cash-review mt-30">
        <h4 class="fs-15 review-title">
          <b>{{ $t('22', {name: cashback.name}) }}</b>
        </h4>
        <div class="p-15 mb-30 border-all flex flex-wrap">
          <div class="m-10" v-for="(item, i) in cashback.tieUpData" :key="i">
            <a :href="item.linkUrl">
              <img :src="'/img/affiliates/' + item.id + '/thumbnail'" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<script>
import i18n from '@@/lang/desktop/companies-id.json'
import Captcha from '@/components/companies/Captcha.vue'
import Rate from '@@/../components/product/Rate.vue'
import Edit from '@@/../components/icons/Edit.vue'
import Container from '@/components/companies/Container.vue'
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import title from '@@/../common/pages'
import { filterInt } from '@/utils/client/common'

if (process.browser) {
  Vue.use(VeeValidate, {
    inject: true,
    events: 'none',
  })
}

const obj = Object.assign(
  {
    validate({ params }) {
      return !isNaN(filterInt(params.id))
    },
    i18n: {
      messages: i18n,
    },
    components: {
      Captcha,
      Rate,
      Edit,
      Container,
    },
    async asyncData({ app, route, params, store, error }) {
      let [cashback, myReview, tieup] = await Promise.all([
        app.GoGoHTTP.get(`/api/v3/surface/company/${params.id}`),
        app.GoGoHTTP.get(`/api/v3/surface/company/${params.id}/review`),
        app.GoGoHTTP.get('/api/v3/surface/campaigns'),
      ])
      if (!cashback || !Object.keys(cashback).length) {
        return error({ statusCode: 404 })
      }
      store.commit('pushBC', {
        name: cashback.name,
        target: { name: 'companies-index-id', params: params },
      })
      return {
        tieup,
        cashback,
        myReview: myReview || {
          eval1: null,
          eval2: null,
          eval3: null,
          eval4: null,
          reviewStars: 0,
          title: '',
          content: '',
        },
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp${route.path}`,
          },
        ],
      }
    },
    methods: {
      getCashBackData() {
        this.GoGoHTTP.get(
          `/api/v3/surface/company/${this.$route.params.id}`
        ).then(data => {
          this.cashback = data || []
        })
      },
      checkCaptcha() {
        this.$refs.captcha.validate(result => {
          if (result) {
            this.error2 = false
            this.posting = true
            this.GoGoHTTP.post(
              `/api/v3/surface/company/${this.$route.params.id}/review`,
              this.myReview
            )
              .then(() => {
                this.$refs.captcha.randomValue()
                this.getCashBackData()
              })
              .finally(() => {
                this.posting = false
              })
          } else {
            this.error2 = true
          }
        })
      },
      onSubmit() {
        this.$validator.validateAll().then(result => {
          if (!result) {
            this.error1 = true
            return
          }
          this.error1 = false
          this.checkCaptcha()
        })
      },
      descriptionTemplate() {
        return (this.cashback.companyPr || '').slice(0, 300)
      },
    },
    computed: {
      titleChunk() {
        return this.$t('1', { name: this.cashback.name })
      },
    },
    data() {
      return {
        isClient: process.browser,
        posting: false,
        error1: false,
        error2: false,
        myReview: {
          eval1: null,
          eval2: null,
          eval3: null,
          eval4: null,
          reviewStars: 0,
          title: '',
          content: '',
        },
        captchaText: null,
        cashback: [],
        toolbar: [
          {
            text: this.$t('1'),
            id: '1',
          },
          {
            text: this.$t('2'),
            id: '2',
          },
          {
            text: this.$t('3'),
            id: '3',
          },
          {
            text: this.$t('4'),
            id: '4',
          },
        ],
      }
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.icon-cls {
  width: 24px;
  height: 24px;
}
.cashback-container {
  > div:first-child {
    flex: 0 0 180px;
  }
  .img-wrapp {
    display: block;
    img {
      border: 1px solid #ececec;
    }
  }
  .review-wrap {
    background: #f5f5f5;
    height: 45px;
    .review-tit {
      font-size: 18px;
      color: #6d6d6d;
      padding-top: 1px;
    }
    /deep/ .gg-rating {
      font-size: 30px;
      .rate-num {
        display: none;
      }
    }
  }
  .com-des {
    min-height: 110px;
    line-height: 19px;
    color: #6d6d6d;
  }
}
.header-title {
  background: rgb(81, 81, 81);
  border-left: 5px solid #9c3;
  line-height: 45px;
  font-weight: bold;
  font-size: 18px;
  height: 40px;
  color: white;
}
.item-name {
  color: #e5455d;
  font-weight: bold;
  vertical-align: middle;
}
.btn-links {
  a {
    display: inline-block;
    background: #ef1740;
    font-weight: bold;
    border-radius: 3px;
    padding: 10px 20px 8px;
    text-decoration: none;
    color: white;
    &:hover {
      background: #f53055;
      color: white;
    }
    &:focus {
      outline: none;
      color: white;
    }
  }
}
.tags-link {
  a {
    color: #333;
    display: inline-block;
    background: #ececec;
    text-decoration: none;
    border-radius: 2px;
    &:hover {
      text-decoration: underline;
    }
  }
}
h4.review-title {
  background: #585858;
  line-height: 40px;
  color: white;
  margin: 0;
  font-size: 15px;
  padding: 0 15px;
  height: 35px;
}
.user-review {
  > h4 {
    border-top: 3px solid #9c3;
  }
  .user-info {
    background: #ececec;
  }
}
.cash-rate {
  p {
    margin: 0 0 2px;
  }
}
.cash-col-1 {
  margin-bottom: -5px;
  > div {
    p {
      margin: 0;
    }
  }
  .review-star {
    margin-top: -6px;
  }
  /deep/ .gg-rating {
    font-size: 22px;
    .rate-num {
      display: none;
    }
  }
}
.fs-16 {
  font-size: 16px;
}
.table-review {
  color: #6d6d6d;
  input {
    height: 25px;
    cursor: pointer;
  }
  .w-100 {
    width: 100px;
  }
  .w-25 {
    width: 25px;
  }
}
.review-post {
  width: 330px;
  p {
    margin-bottom: 5px;
  }
  input,
  textarea {
    border: 1px solid #d2d2d2;
    border-radius: 0;
    outline: none;
    resize: none;
  }
  .input-review {
    height: 30px;
    padding: 0 10px;
    margin-bottom: 15px;
  }
  .input-textarea {
    height: 100px;
    padding: 5px 10px;
  }
}
.capcha-wrapp {
  border-top: 1px solid #d2d2d2;
  height: 100px;
  > div {
    width: 50%;
  }
  input {
    outline: none;
    border-radius: 0;
    width: 130px;
    height: 30px;
    padding: 0 10px;
    & ~ span {
      line-height: 17px;
      display: block;
    }
  }
  .btn-submit {
    font-weight: bold;
    background: #00a300;
    border: none;
    color: white;
    border-radius: 2px;
    outline: none;
    height: 45px;
    line-height: 45px;
    padding: 0 30px;
    &:hover {
      background: #0cb70c;
    }
  }
  .fs-11 {
    font-size: 11px;
  }
}
.disabled {
  opacity: 0.5;
  pointer-events: none;
}
.co-red {
  color: red;
}
</style>
