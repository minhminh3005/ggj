<template>
  <div v-if="(info.paidOptions || []).length">
    <div id="btn-show-product" @click="onClickBtn" :class="{'active' : isClicked }">
      <Plus class="plus" />
      <span class="c-optionsButton_text">{{ $t('1') }}</span>
      <ChevronRight class="arrow-right rotate" :class="{'rotated' : isClicked }" />
    </div>
    <div id="list-product-wrapper">
      <div id="list-product" v-if="isClicked">
        <checkbox
          v-for="item in info.paidOptions"
          v-model="paidSelected"
          :attrs="{ id: 'paidSelected-' + item.id, value: item.id }"
          :label="contentHTML(item)"
          :key="'paidSelected-' + item.id"
          :is-html="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/paid-option.json'
import Plus from '@@/../components/icons/Plus.vue'
import ChevronRight from '@@/../components/icons/ChevronRight.vue'
import Checkbox from '@@/../components/form/Checkbox.vue'

export default {
  components: {
    ChevronRight, Checkbox, Plus
  },
  props: {
    communicates: {
      type: Array,
      default: () => {
        return []
      },
    },
    customFunc: Function,
  },
  i18n: {
    messages: i18n,
  },
  computed:{
    info() {
      return this.$store.state.cart.info
    },
    paidSelected: {
      set(vals) {
        this.$store.commit('cart/setOptionsSelected', vals)
      },
      get() {
        return this.$store.getters['cart/getOptionsSelected']
      }
    }
  },
  data() {
    return {
      isClicked: false,
    }
  },
  methods: {
    contentHTML(item) {
      // #28a7e1
      return `<div style="word-break: break-all;">${item.optionName}</div>
            <div style="text-align:right; font-weight: bold;">
              <span style="color:#FF8500" >+</span>
              ￥${this.formatNumber(item.optionPrice)}
            </div>`
    },
    onClickBtn() {
      this.isClicked = !this.isClicked
    }
  },
}
</script>

<style lang="scss" scoped>
$padding-space: 4vw;
#btn-show-product {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding-top: 10px;
  margin-top: 10px;
  background: #fff;
  border-bottom: 1px solid #dbdbdb;
  padding-bottom: 10px;
  &.active {
    border-right: 1px solid #ccc;
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    box-shadow: 0 3px 6px #0003;
    border-bottom: none;
  }
}
.rotated {
  transform: rotate(90deg);
}
#list-product-wrapper {
  position: relative;
}
#list-product {
  display: block;
  width: 92vw;
  position: absolute;
  z-index: 9;
  text-align: left;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  background: #fff;
  box-shadow: 0 3px 4px rgba(102, 102, 102, 0.5);
}
#btn-show-product:hover + #list-product-wrapper #list-product {
  display: block;
}
#list-product-wrapper:hover #list-product {
  display: block;
}
/deep/ .arrow-right {
  width: 18px;
  height: 18px;
  background: #777;
  border-radius: 50%;
  svg {
    color: #fff;
  }
}
/deep/ .plus {
  width: 20px;
  height: 20px;
  color: #777;
  svg {
    color: #777;
  }
}
.c-optionsButton_text {
  margin-left: 5px;
  margin-right: 8px;
  font-size: 14px;
  color: #333;
  padding-top: 2px;
}
/deep/ .c-label {
  display: block;
  padding: 22px 24px 8px 35px !important;
  cursor: pointer;
  margin-bottom: 0 !important;
  font-weight: normal !important;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 3vw;
    left: 3vw;
    width: calc(100% - 8vw);
    height: 1px;
    background: #dbdbdb;
  }
  .checkmark {
    top: 36% !important;
    left: 10px !important;
  }
}
</style>
