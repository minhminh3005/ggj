<template>
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <span class="header-term">{{ $t('24') }}</span>
        <span class="close-icon" @click="$emit('close')"><CloseIcon /></span>
      </div>
      <div class="share-body">
        <p>{{ $t('25') }}</p>
        <div class="user-info email">
          <span>{{ $t('30') }}</span>
          <p>{{ (userInfo || {}).email }}</p>
        </div>
        <div class="user-info nick-name">
          <span>{{ $t('26') }}</span>
          <p>{{ (userInfo || {}).nickName }}</p>
        </div>
        <p>{{ $t('27') }}</p>
        <div v-html="term" class="w-full term-cls mt-10 border-all p-10"></div>
        <Checkbox class="mt-20 fs-12" v-model.number="isDelivery" :label="$t('28')" />
        <button @click="$emit('login', isDelivery)" class="pl-10 text-left btn-orange">
          {{ $t('29') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Checkbox from '@@/../components/form/Checkbox.vue'
import i18n from '@@/lang/desktop/login.json'
import CloseIcon from '@@/../common/components/close-icon'

export default {
  i18n: {
    messages: i18n,
  },
  props: {
    userInfo: {
      type: Object,
      default: () => {},
    }
  },
  components: {
    Checkbox, CloseIcon
  },
  data() {
    return {
      term: '',
      isDelivery: 1,
    }
  },
  methods: {
    async getTerm() {
      try {
        let data = await this.GoGoHTTP.get('/api/v3/terms/user')
        if(data) this.term = data
      } catch(err) { console.log(err) }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getTerm()
    })
  }
}
</script>
<style>
.ggj-layout {
  overflow: hidden !important;
}
</style>
<style lang="scss" scoped>
.modal-dialog {
  margin: 0;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0,0,0,.5);
  z-index: 1050;
  width: 100%;
  display: flex;
  justify-content: center;
  .modal-content {
    @media only screen and (min-width: 568px) {
      width: 568px;
      height: 65% !important;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .close-icon {
    position: absolute;
    top: 15px;
    right: 20px;
    &:hover {
      cursor: pointer;
    }
  }
  i.icon-cls {
    width: 20px !important;
    height: 20px !important;
  }
  .modal-header {
    height: 50px;
    padding: 15px 30px;
    &:first-child {
      font-size: 20px;
      color: #434343DE;
    }
  }
  .share-body {
    color: #222;
    font-size: 14px;
    padding: 15px 30px !important;
    height: calc(100% - 50px);
    overflow-y: auto;
    scrollbar-width: thin;
    &::-webkit-scrollbar {
      width: 8px;
      cursor: pointer;
      &-track {
        background: transparent;
      }
      &-thumb {
        background: #d6d6d6;
        border-radius: 5px;
      }
    }
    .user-info {
      margin: 20px 0;
      span {
        font-weight: bold;
      }
      p {
        margin: 5px 0 0 0;
      }
    }
  }
  .term-cls {
    height: 250px;
    overflow-y: auto;
    text-align: justify;
    background: #E7E7EA;
    border-radius: 5px;
    border: 1px #b4b5b6 solid;
    scrollbar-width: thin;
    &::-webkit-scrollbar {
      width: 6px;
      cursor: pointer;
      &-track {
        background: transparent;
      }
      &-thumb {
        background: #707070;
        border-radius: 5px;
      }
    }
  }
  .btn-orange {
    border: none;
    outline: none;
    color: white;
    display: block;
    background: #f60;
    height: 40px;
    line-height: 40px;
    padding-right: 10px;
  }
}
</style>
